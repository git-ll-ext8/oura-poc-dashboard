import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { OAUTH_STATE_COOKIE, getRedirectUri, isKnownMemberShortId } from "@/lib/oura";

export async function GET(req: NextRequest) {
  const member = req.nextUrl.searchParams.get("member") ?? "";
  if (!isKnownMemberShortId(member)) {
    return NextResponse.json({ error: `Unknown member: ${member}` }, { status: 400 });
  }

  const nonce = randomUUID();
  const clientId = process.env.OURA_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json({ error: "OURA_CLIENT_ID not configured" }, { status: 500 });
  }

  const authorizeUrl = new URL("https://cloud.ouraring.com/oauth/authorize");
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("client_id", clientId);
  authorizeUrl.searchParams.set("redirect_uri", getRedirectUri());
  authorizeUrl.searchParams.set("scope", "email personal daily");
  authorizeUrl.searchParams.set("state", nonce);

  const res = NextResponse.redirect(authorizeUrl.toString());
  res.cookies.set(OAUTH_STATE_COOKIE, `${nonce}:${member}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });
  return res;
}
