// Deletes the fake row written by scripts/write-test-token.mjs.
import { init } from "@instantdb/admin";

const APP_ID = process.env.NEXT_PUBLIC_INSTANT_APP_ID;
const ADMIN_TOKEN = process.env.INSTANT_ADMIN_TOKEN;
const db = init({ appId: APP_ID, adminToken: ADMIN_TOKEN });

const { ouraTokens } = await db.query({ ouraTokens: {} });
const testRows = ouraTokens.filter((t) => t.memberId === "TEST");
if (testRows.length === 0) {
  console.log("No TEST rows found — nothing to delete.");
} else {
  await db.transact(testRows.map((t) => db.tx.ouraTokens[t.id].delete()));
  console.log(`Deleted ${testRows.length} test row(s).`);
}
