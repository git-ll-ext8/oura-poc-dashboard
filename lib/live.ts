export type DbMember = {
  id: string;
  shortId: string;
  name: string;
  role: string;
  color: string;
  isExternal: boolean;
  isLive: boolean;
  lastSyncedAt?: number;
};

export type DbDailyScore = {
  id: string;
  memberId: string;
  day: string;
  readiness: number;
  sleep: number;
  activity: number;
  steps: number;
  source: string;
};

export type DbConsent = {
  id: string;
  memberId: string;
  metric: string;
  shareOnLeaderboard: boolean;
};

export type MetricKey = "readiness" | "sleep" | "activity";

export type LiveMember = DbMember & {
  readiness: number;
  sleep: number;
  activity: number;
  steps: number;
  weekly: DbDailyScore[];
  source: string;
  consentedMetrics: Set<MetricKey>;
};

function weekdayLabel(day: string): string {
  return new Date(`${day}T00:00:00Z`).toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" });
}

export function buildLiveMembers(
  members: DbMember[],
  dailyScores: DbDailyScore[],
  consents: DbConsent[] = []
): LiveMember[] {
  const byMember = new Map<string, DbDailyScore[]>();
  for (const score of dailyScores) {
    const list = byMember.get(score.memberId) ?? [];
    list.push(score);
    byMember.set(score.memberId, list);
  }

  const consentsByMember = new Map<string, Set<MetricKey>>();
  for (const c of consents) {
    if (!c.shareOnLeaderboard) continue;
    const set = consentsByMember.get(c.memberId) ?? new Set<MetricKey>();
    set.add(c.metric as MetricKey);
    consentsByMember.set(c.memberId, set);
  }

  return members
    .filter((m) => !m.isExternal)
    .map((member) => {
      const scores = (byMember.get(member.shortId) ?? []).slice().sort((a, b) => a.day.localeCompare(b.day));
      const last7 = scores.slice(-7);
      const latest = scores[scores.length - 1];
      return {
        ...member,
        readiness: latest?.readiness ?? 0,
        sleep: latest?.sleep ?? 0,
        activity: latest?.activity ?? 0,
        steps: latest?.steps ?? 0,
        weekly: last7,
        source: latest?.source ?? "sandbox",
        consentedMetrics: consentsByMember.get(member.shortId) ?? new Set<MetricKey>(),
      };
    });
}

// Sandbox data has no real privacy concern (it's synthetic demo data) — always visible.
// Real Oura data is gated per-metric by the member's own consent choice, default private.
// Row-level version: consent is a CURRENT setting applied uniformly to all of a
// member's oura-sourced rows (there's no historical "what was shared on that day"
// record) — but each ROW's own source still matters, since one member can have both
// sandbox rows (old seed data) and oura rows (real pulls) in their history.
export function isRowVisible(source: string, consentedMetrics: Set<MetricKey>, metric: MetricKey): boolean {
  if (source !== "oura") return true;
  return consentedMetrics.has(metric);
}

export function isMetricVisible(member: LiveMember, metric: MetricKey): boolean {
  return isRowVisible(member.source, member.consentedMetrics, metric);
}

// Puts everyone with real Oura data first (so they're visible without scrolling),
// then everyone on sandbox data — readiness-descending within each group.
export function sortLiveFirst(members: LiveMember[]): LiveMember[] {
  return [...members].sort((a, b) => {
    const aLive = a.source === "oura" ? 1 : 0;
    const bLive = b.source === "oura" ? 1 : 0;
    if (aLive !== bLive) return bLive - aLive;
    return b.readiness - a.readiness;
  });
}

export function formatAbsoluteTime(ms: number): string {
  const d = new Date(ms);
  const datePart = d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const timePart = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return `${datePart} @ ${timePart}`;
}

export function formatRelativeTime(ms: number): string {
  const diffSec = Math.floor((Date.now() - ms) / 1000);
  if (diffSec < 60) return "just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? "" : "s"} ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hour${diffHr === 1 ? "" : "s"} ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay} day${diffDay === 1 ? "" : "s"} ago`;
}

// Flag data as visibly stale if the daily refresh hasn't run in well over a day —
// a healthy once-daily cron should never let this trip.
export function isStaleSync(ms: number): boolean {
  return Date.now() - ms > 36 * 60 * 60 * 1000;
}

export { weekdayLabel };
