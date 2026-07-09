export type DbMember = {
  id: string;
  shortId: string;
  name: string;
  role: string;
  color: string;
  isExternal: boolean;
  isLive: boolean;
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
export function isMetricVisible(member: LiveMember, metric: MetricKey): boolean {
  if (member.source !== "oura") return true;
  return member.consentedMetrics.has(metric);
}

export { weekdayLabel };
