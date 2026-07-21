// Server-only. Shared by the OAuth sign-in callback AND the daily refresh cron job,
// so both paths pull/store data identically and can never drift apart.
import { id } from "@instantdb/admin";
import { adminDb } from "./instant-admin";
import { TokenSaveFailedError, fetchOuraRaw, last7DayRange, refreshAccessToken, type TokenResponse } from "./oura";

// Once-daily cron granularity means we should refresh well before actual expiry,
// not at the last minute — a multi-day buffer ensures we never hit an already-expired
// token in the ~24h gap between two scheduled runs.
const REFRESH_BUFFER_MS = 2 * 24 * 60 * 60 * 1000;

const SAVE_RETRY_ATTEMPTS = 4;
const SAVE_RETRY_DELAY_MS = 500;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// SAFETY-CRITICAL: once Oura issues a new token, the old refresh token may already
// be dead on Oura's side (rotation is common and undocumented for this API). So we
// never "rely on" the new token until it is confirmed durably saved — save first,
// read it back to verify the write actually landed, retry on any failure, and only
// then return it. If saving still fails after retries, we do NOT throw the fresh
// tokens away — we log them (the only path to manual recovery) and raise a distinct
// error that must NEVER be treated as "this person revoked access."
async function saveAndVerifyToken(
  tokenRowId: string,
  memberShortId: string,
  fresh: TokenResponse,
  attempt = 1
): Promise<void> {
  try {
    await adminDb.transact([
      adminDb.tx.ouraTokens[tokenRowId].update({
        accessToken: fresh.access_token,
        refreshToken: fresh.refresh_token,
        expiresAt: Date.now() + fresh.expires_in * 1000,
      }),
    ]);

    const { ouraTokens } = await adminDb.query({ ouraTokens: { $: { where: { memberId: memberShortId } } } });
    const saved = ouraTokens.find((t) => t.id === tokenRowId);
    if (saved?.accessToken === fresh.access_token && saved?.refreshToken === fresh.refresh_token) {
      console.log(`[oura-sync] member=${memberShortId} refreshed token saved and verified (attempt ${attempt})`);
      return;
    }
    throw new Error("read-back after save did not match what was written");
  } catch (err) {
    if (attempt < SAVE_RETRY_ATTEMPTS) {
      console.log(
        `[oura-sync] member=${memberShortId} save/verify attempt ${attempt} failed (${String(err)}), retrying...`
      );
      await sleep(SAVE_RETRY_DELAY_MS * attempt);
      return saveAndVerifyToken(tokenRowId, memberShortId, fresh, attempt + 1);
    }
    console.error(
      `[oura-sync] CRITICAL: member=${memberShortId} — Oura issued a new token but it could NOT be saved/verified after ${SAVE_RETRY_ATTEMPTS} attempts. Manual recovery may be required.`
    );
    // Logging the actual secret here is deliberate and ONLY happens in this
    // exhausted-retries branch — the alternative is losing the only copy of a
    // token Oura will not reissue, which is worse than a slim exposure window
    // in a private, access-controlled log viewer.
    console.error(
      `[oura-sync] RECOVERY DATA member=${memberShortId} access_token=${fresh.access_token} refresh_token=${fresh.refresh_token} expires_in=${fresh.expires_in}`
    );
    throw new TokenSaveFailedError(memberShortId);
  }
}

// Returns a usable access token for this member, refreshing it first if it's expired
// or expiring soon. Throws OuraTokenRevokedError (from lib/oura.ts) if Oura rejects
// the stored refresh token, or TokenSaveFailedError if a refresh succeeded but could
// not be durably saved — callers must treat these two very differently (see the
// cron route: only the former is even a CANDIDATE signal for "this person left,"
// and per explicit safety policy neither auto-disconnects anymore — both just alert).
export async function getValidAccessToken(memberShortId: string): Promise<string> {
  const { ouraTokens } = await adminDb.query({ ouraTokens: { $: { where: { memberId: memberShortId } } } });
  const tokenRow = ouraTokens[0];
  if (!tokenRow) throw new Error(`No stored Oura token for member=${memberShortId}`);

  if (tokenRow.expiresAt - Date.now() > REFRESH_BUFFER_MS) {
    return tokenRow.accessToken;
  }

  console.log(`[oura-sync] token for member=${memberShortId} expiring soon (or expired) — refreshing`);
  const fresh = await refreshAccessToken(tokenRow.refreshToken); // old token in DB is untouched up to this point
  await saveAndVerifyToken(tokenRow.id, memberShortId, fresh); // only returns once the new token is confirmed durable
  console.log(`[oura-sync] refreshed token for member=${memberShortId}, new expiry in ${fresh.expires_in}s`);
  return fresh.access_token;
}

// Deletes the stored token and all oura-sourced dailyScores for this member, and
// clears isLive — makes good on the /privacy promise ("revoke in Oura -> card
// returns to DEMO DATA") via the leaderboard's existing self-healing badge logic.
//
// NOT auto-invoked by the cron job as of 2026-07-20, per explicit safety policy:
// a failed refresh COULD mean genuine revocation, but could also mean a transient
// save/verify failure — and telling those apart with full certainty isn't possible.
// Given Tracy's/Nadia's tokens must be treated as irreplaceable while unattended,
// the cron only alerts on either failure now; this function stays available for
// a human (Lawrence) to call deliberately once a suspected revocation is confirmed.
export async function disconnectMember(memberShortId: string): Promise<void> {
  console.log(`[oura-sync] member=${memberShortId} token revoked — disconnecting and clearing real data`);
  const { ouraTokens, dailyScores, members } = await adminDb.query({
    ouraTokens: { $: { where: { memberId: memberShortId } } },
    dailyScores: { $: { where: { memberId: memberShortId, source: "oura" } } },
    members: { $: { where: { shortId: memberShortId } } },
  });

  const deletes = [
    ...ouraTokens.map((t) => adminDb.tx.ouraTokens[t.id].delete()),
    ...dailyScores.map((s) => adminDb.tx.dailyScores[s.id].delete()),
  ];
  const memberRow = members[0];
  const updates = memberRow ? [adminDb.tx.members[memberRow.id].update({ isLive: false })] : [];

  if (deletes.length > 0 || updates.length > 0) {
    await adminDb.transact([...deletes, ...updates]);
  }
  console.log(`[oura-sync] member=${memberShortId} reverted to DEMO DATA (${deletes.length} rows removed)`);
}

export type SyncResult = { wroteAnyData: boolean; daysWritten: number };

// Pulls the last 7 days of readiness/sleep/activity from Oura and stores them.
// UPSERTS per day (keyed on existing memberId+day+source="oura" row if one exists) —
// this is the key fix vs. the original sign-in-only version: it never deletes days
// outside the current fetch window, so history accumulates permanently instead of
// being wiped back to a rolling 7-day window on every sync.
export async function syncMemberScores(memberShortId: string, accessToken: string): Promise<SyncResult> {
  const { startDate, endDate } = last7DayRange();
  console.log(`[oura-sync] pulling real daily data for member=${memberShortId} ${startDate}..${endDate}`);
  const [readiness, sleep, activity] = await Promise.all([
    fetchOuraRaw(accessToken, "daily_readiness", startDate, endDate),
    fetchOuraRaw(accessToken, "daily_sleep", startDate, endDate),
    fetchOuraRaw(accessToken, "daily_activity", startDate, endDate),
  ]);
  console.log(
    `[oura-sync] member=${memberShortId} counts — readiness:${readiness.length} sleep:${sleep.length} activity:${activity.length}`
  );

  const days = new Set<string>();
  for (const r of readiness) days.add(r.day);
  for (const s of sleep) days.add(s.day);
  for (const a of activity) days.add(a.day);

  if (days.size === 0) {
    console.log(`[oura-sync] no real data returned for member=${memberShortId} — graceful no-op`);
    return { wroteAnyData: false, daysWritten: 0 };
  }

  const byDay = <T extends { day: string }>(rows: T[]) => new Map(rows.map((r) => [r.day, r]));
  const readinessByDay = byDay(readiness);
  const sleepByDay = byDay(sleep);
  const activityByDay = byDay(activity);

  const existing = await adminDb.query({
    dailyScores: { $: { where: { memberId: memberShortId, source: "oura" } } },
  });
  const existingByDay = new Map(existing.dailyScores.map((s) => [s.day, s]));

  const writes = [...days].map((day) => {
    const rowId = existingByDay.get(day)?.id ?? id();
    return adminDb.tx.dailyScores[rowId].update({
      memberId: memberShortId,
      day,
      readiness: readinessByDay.get(day)?.score ?? 0,
      sleep: sleepByDay.get(day)?.score ?? 0,
      activity: activityByDay.get(day)?.score ?? 0,
      steps: activityByDay.get(day)?.steps ?? 0,
      source: "oura",
    });
  });

  const { members } = await adminDb.query({ members: { $: { where: { shortId: memberShortId } } } });
  const memberRow = members[0];
  if (!memberRow) {
    console.error(`[oura-sync] no members row found for shortId=${memberShortId} — cannot set isLive/lastSyncedAt`);
  }
  const memberUpdates = memberRow
    ? [adminDb.tx.members[memberRow.id].update({ isLive: true, lastSyncedAt: Date.now() })]
    : [];

  await adminDb.transact([...writes, ...memberUpdates]);
  console.log(`[oura-sync] wrote/updated ${writes.length} dailyScores rows for member=${memberShortId}`);
  return { wroteAnyData: true, daysWritten: writes.length };
}
