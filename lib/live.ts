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

export type LiveMember = DbMember & {
  readiness: number;
  sleep: number;
  activity: number;
  steps: number;
  weekly: DbDailyScore[];
};

function weekdayLabel(day: string): string {
  return new Date(`${day}T00:00:00Z`).toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" });
}

export function buildLiveMembers(members: DbMember[], dailyScores: DbDailyScore[]): LiveMember[] {
  const byMember = new Map<string, DbDailyScore[]>();
  for (const score of dailyScores) {
    const list = byMember.get(score.memberId) ?? [];
    list.push(score);
    byMember.set(score.memberId, list);
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
      };
    });
}

export { weekdayLabel };
