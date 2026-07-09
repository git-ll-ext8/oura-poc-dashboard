// One-off: writes a fake oura-sourced dailyScores row for member L, then deletes it,
// to verify the badge fallback (source==="oura" -> DEMO DATA when rows are gone) works
// without touching members.isLive. Verification-only, not part of the app.
import { init, id } from "@instantdb/admin";

const [, , action] = process.argv;
const db = init({ appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID, adminToken: process.env.INSTANT_ADMIN_TOKEN });

if (action === "write") {
  const day = new Date().toISOString().slice(0, 10);
  await db.transact([
    db.tx.dailyScores[id()].update({
      memberId: "L",
      day,
      readiness: 91,
      sleep: 88,
      activity: 85,
      steps: 12000,
      source: "oura",
    }),
  ]);
  console.log("Wrote fake oura row for member L.");
} else if (action === "revoke") {
  const { dailyScores } = await db.query({ dailyScores: { $: { where: { memberId: "L", source: "oura" } } } });
  await db.transact(dailyScores.map((s) => db.tx.dailyScores[s.id].delete()));
  console.log(`Simulated revoke: deleted ${dailyScores.length} oura row(s) for member L.`);
} else {
  console.error("Usage: node scripts/simulate-revoke-test.mjs <write|revoke>");
  process.exit(1);
}
