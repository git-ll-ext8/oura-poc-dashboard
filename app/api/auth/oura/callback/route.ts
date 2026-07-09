import { id } from "@instantdb/admin";
import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/instant-admin";
import {
  OAUTH_STATE_COOKIE,
  SESSION_COOKIE,
  exchangeCodeForToken,
  fetchOuraRaw,
  isKnownMemberShortId,
  last7DayRange,
} from "@/lib/oura";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const cookie = req.cookies.get(OAUTH_STATE_COOKIE)?.value;

  console.log("[oura/callback] received code?", !!code, "state?", state);

  if (!code || !state || !cookie) {
    console.error("[oura/callback] missing code/state/cookie");
    return NextResponse.json({ error: "Missing code, state, or oauth cookie" }, { status: 400 });
  }

  const [nonce, member] = cookie.split(":");
  if (nonce !== state || !isKnownMemberShortId(member)) {
    console.error("[oura/callback] state mismatch or unknown member", { nonce, state, member });
    return NextResponse.json({ error: "State mismatch — possible CSRF or stale session" }, { status: 400 });
  }

  try {
    console.log(`[oura/callback] exchanging code for tokens (member=${member})...`);
    const tokens = await exchangeCodeForToken(code);
    console.log("[oura/callback] token exchange OK, expires_in=", tokens.expires_in);

    const existingTokens = await adminDb.query({ ouraTokens: { $: { where: { memberId: member } } } });
    const deleteOldTokens = existingTokens.ouraTokens.map((t) => adminDb.tx.ouraTokens[t.id].delete());
    await adminDb.transact([
      ...deleteOldTokens,
      adminDb.tx.ouraTokens[id()].update({
        memberId: member,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt: Date.now() + tokens.expires_in * 1000,
      }),
    ]);
    console.log(`[oura/callback] tokens stored for member=${member} (old rows replaced: ${deleteOldTokens.length})`);

    const { startDate, endDate } = last7DayRange();
    console.log(`[oura/callback] pulling real daily data ${startDate}..${endDate}`);
    const [readiness, sleep, activity] = await Promise.all([
      fetchOuraRaw(tokens.access_token, "daily_readiness", startDate, endDate),
      fetchOuraRaw(tokens.access_token, "daily_sleep", startDate, endDate),
      fetchOuraRaw(tokens.access_token, "daily_activity", startDate, endDate),
    ]);
    console.log(
      `[oura/callback] real data counts — readiness:${readiness.length} sleep:${sleep.length} activity:${activity.length}`
    );

    const days = new Set<string>();
    for (const r of readiness) days.add(r.day);
    for (const s of sleep) days.add(s.day);
    for (const a of activity) days.add(a.day);

    let wroteAnyData = false;
    if (days.size > 0) {
      const byDay = <T extends { day: string }>(rows: T[]) => new Map(rows.map((r) => [r.day, r]));
      const readinessByDay = byDay(readiness);
      const sleepByDay = byDay(sleep);
      const activityByDay = byDay(activity);

      const existingScores = await adminDb.query({
        dailyScores: { $: { where: { memberId: member, source: "oura" } } },
      });
      const deleteOldScores = existingScores.dailyScores.map((s) => adminDb.tx.dailyScores[s.id].delete());

      const newScores = [...days].map((day) =>
        adminDb.tx.dailyScores[id()].update({
          memberId: member,
          day,
          readiness: readinessByDay.get(day)?.score ?? 0,
          sleep: sleepByDay.get(day)?.score ?? 0,
          activity: activityByDay.get(day)?.score ?? 0,
          steps: activityByDay.get(day)?.steps ?? 0,
          source: "oura",
        })
      );

      await adminDb.transact([...deleteOldScores, ...newScores]);
      wroteAnyData = true;
      console.log(`[oura/callback] wrote ${newScores.length} real dailyScores rows for member=${member}`);

      const memberRows = await adminDb.query({ members: { $: { where: { shortId: member } } } });
      const memberRow = memberRows.members[0];
      if (memberRow) {
        await adminDb.transact([adminDb.tx.members[memberRow.id].update({ isLive: true })]);
        console.log(`[oura/callback] members.isLive=true for member=${member}`);
      } else {
        console.error(`[oura/callback] no members row found for shortId=${member} — cannot set isLive`);
      }
    } else {
      console.log(`[oura/callback] no real data returned for member=${member} — graceful no-op (e.g. no ring paired)`);
    }

    const redirectUrl = new URL("/consent", req.nextUrl.origin);
    redirectUrl.searchParams.set("member", member);
    if (!wroteAnyData) redirectUrl.searchParams.set("nodata", "1");

    const res = NextResponse.redirect(redirectUrl.toString());
    res.cookies.set(SESSION_COOKIE, member, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 900,
      path: "/",
    });
    res.cookies.delete(OAUTH_STATE_COOKIE);
    return res;
  } catch (err) {
    console.error("[oura/callback] FAILED:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
