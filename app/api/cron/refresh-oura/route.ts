import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/instant-admin";
import { OuraTokenRevokedError } from "@/lib/oura";
import { disconnectMember, getValidAccessToken, syncMemberScores } from "@/lib/oura-sync";

export const runtime = "nodejs";
export const maxDuration = 60;

// Triggered once daily by Vercel Cron (see vercel.json). Refreshes every connected
// member's Oura data. Safe to invoke more than once on the same day (upserts, not
// duplicates) and safe to re-run manually for testing via a matching Authorization header.
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
        console.log(`[cron/refresh-oura] member=${memberId} revoked, disconnecting`);
        await disconnectMember(memberId);
        results[memberId] = "disconnected (revoked)";
      } else {
        console.error(`[cron/refresh-oura] member=${memberId} FAILED:`, err);
        results[memberId] = `error: ${String(err)}`;
      }
    }
  }

  console.log("[cron/refresh-oura] run complete", results);
  return NextResponse.json({ ranAt: new Date().toISOString(), results });
}
