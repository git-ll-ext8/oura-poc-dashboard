import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/instant-admin";
import { OuraTokenRevokedError, TokenSaveFailedError } from "@/lib/oura";
import { getValidAccessToken, syncMemberScores } from "@/lib/oura-sync";

export const runtime = "nodejs";
export const maxDuration = 60;

// Triggered once daily by Vercel Cron (see vercel.json). Refreshes every connected
// member's Oura data. Safe to invoke more than once on the same day (upserts, not
// duplicates) and safe to re-run manually for testing via a matching Authorization header.
//
// SAFETY POLICY (2026-07-20): this route never auto-deletes anyone's token or real
// data. A rejected refresh (OuraTokenRevokedError) or a refresh that couldn't be
// durably saved (TokenSaveFailedError) both just ALERT via the logs and the returned
// summary — the existing token/data is left exactly as it was. Confirming a genuine
// revocation and cleaning up (lib/oura-sync.ts -> disconnectMember) is a deliberate,
// human-triggered action now, not something this job decides on its own.
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    console.error("[cron/refresh-oura] rejected — missing/incorrect CRON_SECRET");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log("[cron/refresh-oura] starting daily refresh run");
  const { ouraTokens } = await adminDb.query({ ouraTokens: {} });
  console.log(`[cron/refresh-oura] found ${ouraTokens.length} connected member(s)`);

  const results: Record<string, string> = {};

  for (const tokenRow of ouraTokens) {
    const memberId = tokenRow.memberId;
    try {
      const accessToken = await getValidAccessToken(memberId);
      const result = await syncMemberScores(memberId, accessToken);
      results[memberId] = result.wroteAnyData ? `ok (${result.daysWritten} days)` : "ok (no data)";
    } catch (err) {
      if (err instanceof OuraTokenRevokedError) {
        console.error(
          `[cron/refresh-oura] ALERT member=${memberId}: Oura rejected the refresh (possible revoke). NOT auto-disconnecting — token/data left untouched. Needs manual review.`
        );
        results[memberId] = "ALERT: refresh rejected by Oura — left untouched, needs manual review";
      } else if (err instanceof TokenSaveFailedError) {
        console.error(
          `[cron/refresh-oura] ALERT member=${memberId}: refreshed token could not be saved/verified. Left untouched. Check logs above for recovery data.`
        );
        results[memberId] = "ALERT: token save failed after retries — left untouched, check logs";
      } else {
        console.error(`[cron/refresh-oura] member=${memberId} FAILED:`, err);
        results[memberId] = `error: ${String(err)}`;
      }
    }
  }

  console.log("[cron/refresh-oura] run complete", results);
  return NextResponse.json({ ranAt: new Date().toISOString(), results });
}
