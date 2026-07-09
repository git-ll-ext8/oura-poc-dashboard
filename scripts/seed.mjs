// Seed InstantDB with 30 days of Oura sandbox-shaped data for the 5 team members.
// Run with: npm run seed  (loads .env.local via `node --env-file`)
// Safe to re-run: wipes existing members/dailyScores rows first, then recreates them.

import { init, id } from "@instantdb/admin";

const APP_ID = process.env.NEXT_PUBLIC_INSTANT_APP_ID;
const ADMIN_TOKEN = process.env.INSTANT_ADMIN_TOKEN;

if (!APP_ID || !ADMIN_TOKEN) {
  console.error("[seed] Missing NEXT_PUBLIC_INSTANT_APP_ID or INSTANT_ADMIN_TOKEN. Check .env.local.");
  process.exit(1);
}

const db = init({ appId: APP_ID, adminToken: ADMIN_TOKEN });

const MEMBERS = [
  { shortId: "D", name: "Danny", role: "Principal", color: "#C9A84C" },
  { shortId: "N", name: "Nadia", role: "Talent Acq.", color: "#8BADC8" },
  { shortId: "L", name: "Lawrence", role: "Manager", color: "#4CAF8A" },
  { shortId: "K", name: "Kathrina", role: "Associate", color: "#A78BF6" },
  { shortId: "T", name: "Tracy", role: "Analyst", color: "#E06060" },
];

// Deterministic per-member spread so the leaderboard differentiates people —
// the Oura sandbox returns one fixed canned fixture regardless of caller, so
// without this every member would show identical scores.
function seedFromString(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return h;
}
function mulberry32(seed) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

async function fetchSandbox(path, startDate, endDate) {
  const url = `https://api.ouraring.com/v2/sandbox/usercollection/${path}?start_date=${startDate}&end_date=${endDate}`;
  const res = await fetch(url, { headers: { Authorization: "Bearer sandbox" } });
  if (!res.ok) {
    throw new Error(`[seed] Sandbox fetch failed for ${path}: ${res.status} ${await res.text()}`);
  }
  const json = await res.json();
  return json.data;
}

function toDateStr(d) {
  return d.toISOString().slice(0, 10);
}

async function main() {
  const end = new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - 29);
  const startDate = toDateStr(start);
  const endDate = toDateStr(end);

  console.log(`[seed] Fetching Oura sandbox data ${startDate} → ${endDate}...`);
  const [readiness, sleep, activity] = await Promise.all([
    fetchSandbox("daily_readiness", startDate, endDate),
    fetchSandbox("daily_sleep", startDate, endDate),
    fetchSandbox("daily_activity", startDate, endDate),
  ]);
  console.log(
    `[seed] Got ${readiness.length} readiness, ${sleep.length} sleep, ${activity.length} activity days.`
  );

  console.log("[seed] Wiping existing members + dailyScores...");
  const existing = await db.query({ members: {}, dailyScores: {} });
  const deleteTx = [
    ...existing.members.map((m) => db.tx.members[m.id].delete()),
    ...existing.dailyScores.map((d) => db.tx.dailyScores[d.id].delete()),
  ];
  if (deleteTx.length > 0) {
    await db.transact(deleteTx);
  }

  console.log("[seed] Creating members...");
  const memberIds = {};
  const createMembersTx = MEMBERS.map((m) => {
    const memberEntityId = id();
    memberIds[m.shortId] = memberEntityId;
    return db.tx.members[memberEntityId].update({
      shortId: m.shortId,
      name: m.name,
      role: m.role,
      color: m.color,
      isExternal: false,
      isLive: false,
    });
  });
  await db.transact(createMembersTx);

  console.log("[seed] Writing dailyScores...");
  const days = readiness.map((r) => r.day);
  const scoreTx = [];
  for (const member of MEMBERS) {
    const rand = mulberry32(seedFromString(member.shortId));
    const spread = 12;
    const offset = rand() * spread - spread / 2;

    days.forEach((day, i) => {
      const r = readiness[i]?.score ?? 75;
      const s = sleep[i]?.score ?? 75;
      const a = activity[i]?.score ?? 75;
      const steps = activity[i]?.steps ?? 8000;

      scoreTx.push(
        db.tx.dailyScores[id()].update({
          memberId: member.shortId,
          day,
          readiness: clamp(Math.round(r + offset), 0, 100),
          sleep: clamp(Math.round(s + offset), 0, 100),
          activity: clamp(Math.round(a + offset), 0, 100),
          steps: Math.max(0, Math.round(steps + offset * 200)),
          source: "sandbox",
        })
      );
    });
  }
  await db.transact(scoreTx);

  console.log(`[seed] Done. ${MEMBERS.length} members, ${scoreTx.length} dailyScores rows written.`);
}

main().catch((err) => {
  console.error("[seed] FAILED:", err);
  process.exit(1);
});
