import { id } from "@instantdb/admin";
import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/instant-admin";
import { OAUTH_STATE_COOKIE, SESSION_COOKIE, exchangeCodeForToken, isKnownMemberShortId } from "@/lib/oura";
import { syncMemberScores } from "@/lib/oura-sync";

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

    const result = await syncMemberScores(member, tokens.access_token);

    const redirectUrl = new URL("/consent", req.nextUrl.origin);
    redirectUrl.searchParams.set("member", member);
    if (!result.wroteAnyData) redirectUrl.searchParams.set("nodata", "1");

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
