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

export type TokenResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
};

// Thrown when Oura rejects a refresh_token specifically (revoked/invalid) — distinct
// from network errors or 5xx, which should be treated as transient and retried later,
// not treated as "this person disconnected."
export class OuraTokenRevokedError extends Error {
  constructor(detail: string) {
    super(`Oura refresh token rejected (likely revoked): ${detail}`);
    this.name = "OuraTokenRevokedError";
  }
}

// Thrown when Oura issued a new token but we could not durably save + verify it
// after retries. This is DIFFERENT from a revoked token — Oura's servers may have
// already invalidated the old refresh token as a side effect of issuing the new
// one, so the safe response is to alert loudly and touch nothing further, never
// to treat this the same as a real revocation.
export class TokenSaveFailedError extends Error {
  constructor(memberShortId: string) {
    super(`Refreshed token for member=${memberShortId} could not be durably saved/verified after retries`);
    this.name = "TokenSaveFailedError";
  }
}

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

// Standard OAuth2 refresh-token grant (RFC 6749 §6). Oura may rotate the refresh
// token on each use, so callers MUST persist whatever refresh_token comes back,
// not just the access_token.
export async function refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
  const clientId = process.env.OURA_CLIENT_ID;
  const clientSecret = process.env.OURA_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error("OURA_CLIENT_ID/SECRET not set");

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
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
    // 400/401 with an OAuth error body is the standard signal for "this refresh
    // token is no longer valid" (expired, revoked, or already superseded).
    // 5xx or network failures should NOT be treated the same way — those are
    // transient and the caller should just try again on the next scheduled run.
    if (res.status === 400 || res.status === 401) {
      throw new OuraTokenRevokedError(`${res.status} ${text}`);
    }
    throw new Error(`Oura token refresh failed: ${res.status} ${text}`);
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
