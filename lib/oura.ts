// Server-only helpers for the Oura OAuth2 authorization-code flow (Phase C).
// Never import this from a client component — it references OURA_CLIENT_SECRET.

export const KNOWN_MEMBER_SHORT_IDS = ["D", "N", "L", "K", "T"] as const;
export type KnownMemberShortId = (typeof KNOWN_MEMBER_SHORT_IDS)[number];

export function isKnownMemberShortId(value: string): value is KnownMemberShortId {
  return (KNOWN_MEMBER_SHORT_IDS as readonly string[]).includes(value);
}

export const OAUTH_STATE_COOKIE = "oura_oauth_state";
export const SESSION_COOKIE = "oura_session";

export function getRedirectUri(): string {
  const base = process.env.APP_BASE_URL;
  if (!base) throw new Error("APP_BASE_URL is not set");
  return `${base}/api/auth/oura/callback`;
}

type TokenResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
};

export async function exchangeCodeForToken(code: string): Promise<TokenResponse> {
  const clientId = process.env.OURA_CLIENT_ID;
  const clientSecret = process.env.OURA_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error("OURA_CLIENT_ID/SECRET not set");

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: getRedirectUri(),
    client_id: clientId,
    client_secret: clientSecret,
  });

  const res = await fetch("https://api.ouraring.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Oura token exchange failed: ${res.status} ${text}`);
  }
  return res.json();
}

export async function fetchOuraRaw(
  accessToken: string,
  metric: "daily_readiness" | "daily_sleep" | "daily_activity",
  startDate: string,
  endDate: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- raw Oura API rows, shape varies per metric
): Promise<any[]> {
  const url = `https://api.ouraring.com/v2/usercollection/${metric}?start_date=${startDate}&end_date=${endDate}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Oura ${metric} fetch failed: ${res.status} ${text}`);
  }
  const json = await res.json();
  return json.data ?? [];
}

export function last7DayRange(): { startDate: string; endDate: string } {
  const end = new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - 6);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  return { startDate: fmt(start), endDate: fmt(end) };
}
