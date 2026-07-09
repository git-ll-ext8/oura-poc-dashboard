export type MemberId = "D" | "N" | "L" | "K" | "T";

export type Member = {
  id: MemberId;
  name: string;
  role: string;
  color: string;
  readiness: number;
  sleep: number;
  hrv: number;
  steps: number;
  streak: number;
  badges: number;
  prs: number;
  topBadge: string;
};

export const members: Member[] = [
  {
    id: "D",
    name: "Danny",
    role: "Principal",
    color: "#C9A84C",
    readiness: 88,
    sleep: 82,
    hrv: 58,
    steps: 9820,
    streak: 12,
    badges: 7,
    prs: 3,
    topBadge: "Monthly Champion",
  },
  {
    id: "N",
    name: "Nadia",
    role: "Talent Acq.",
    color: "#8BADC8",
    readiness: 91,
    sleep: 88,
    hrv: 62,
    steps: 11240,
    streak: 21,
    badges: 9,
    prs: 5,
    topBadge: "Sleep Streak ×21",
  },
  {
    id: "L",
    name: "Lawrence",
    role: "Manager",
    color: "#4CAF8A",
    readiness: 78,
    sleep: 85,
    hrv: 67,
    steps: 8600,
    streak: 17,
    badges: 8,
    prs: 4,
    topBadge: "HRV Elite",
  },
  {
    id: "K",
    name: "Kathrina",
    role: "Associate",
    color: "#A78BF6",
    readiness: 83,
    sleep: 79,
    hrv: 55,
    steps: 13100,
    streak: 8,
    badges: 6,
    prs: 2,
    topBadge: "Activity Leader",
  },
  {
    id: "T",
    name: "Tracy",
    role: "Analyst",
    color: "#E06060",
    readiness: 74,
    sleep: 71,
    hrv: 44,
    steps: 7340,
    streak: 4,
    badges: 3,
    prs: 1,
    topBadge: "10K Steps ×5",
  },
];

// Deterministic seeded PRNG so server and client render identical "realistic"
// variation without a hydration mismatch (Math.random() would differ per render).
function seedFromString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return h;
}

function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const QUARTERS = ["Q1", "Q2", "Q3", "Q4"] as const;

export type ImprovementRow = {
  memberId: MemberId;
  prev: number;
  curr: number;
  delta: number;
};

export const quarterlyImprovement: Record<"sleep" | "readiness" | "hrv" | "steps", ImprovementRow[]> = {
  sleep: [
    { memberId: "N", prev: 74, curr: 88, delta: 14 },
    { memberId: "L", prev: 78, curr: 85, delta: 7 },
    { memberId: "D", prev: 76, curr: 82, delta: 6 },
    { memberId: "K", prev: 74, curr: 79, delta: 5 },
    { memberId: "T", prev: 68, curr: 71, delta: 3 },
  ],
  readiness: [
    { memberId: "N", prev: 80, curr: 91, delta: 11 },
    { memberId: "K", prev: 74, curr: 83, delta: 9 },
    { memberId: "D", prev: 81, curr: 88, delta: 7 },
    { memberId: "L", prev: 72, curr: 78, delta: 6 },
    { memberId: "T", prev: 69, curr: 74, delta: 5 },
  ],
  hrv: [
    { memberId: "L", prev: 58, curr: 67, delta: 9 },
    { memberId: "N", prev: 54, curr: 62, delta: 8 },
    { memberId: "D", prev: 51, curr: 58, delta: 7 },
    { memberId: "K", prev: 49, curr: 55, delta: 6 },
    { memberId: "T", prev: 40, curr: 44, delta: 4 },
  ],
  steps: [
    { memberId: "K", prev: 9200, curr: 13100, delta: 3900 },
    { memberId: "N", prev: 8500, curr: 11240, delta: 2740 },
    { memberId: "D", prev: 7800, curr: 9820, delta: 2020 },
    { memberId: "L", prev: 7100, curr: 8600, delta: 1500 },
    { memberId: "T", prev: 6200, curr: 7340, delta: 1140 },
  ],
};

export const QUARTER_LABELS = ["Q1 '25", "Q2 '25", "Q3 '25", "Q4 '25", "Q1 '26"];

export function quarterlyTrend(member: Member): number[] {
  const rand = mulberry32(seedFromString(member.id + "quarterly-trend"));
  return QUARTER_LABELS.map((_, i) => Math.round(member.readiness - 14 + i * 3.5 + (rand() * 4 - 2)));
}

export const mostImproved = {
  memberId: "N" as MemberId,
  deltaOverall: 18,
  sleepDelta: 14,
  readinessDelta: 11,
  prsBroken: 4,
};

export function memberById(id: MemberId): Member {
  const m = members.find((x) => x.id === id);
  if (!m) throw new Error(`Unknown member id: ${id}`);
  return m;
}
