// Verifies the ouraTokens client-lock against REAL token data (post-Phase-C).
// Confirms the Admin SDK can see the row (sanity check) — the actual client-side
// block was already proven with a synthetic row last night; this just re-confirms
// a real row exists and reminds to check the browser too before demo.
import { init } from "@instantdb/admin";

const APP_ID = process.env.NEXT_PUBLIC_INSTANT_APP_ID;
const ADMIN_TOKEN = process.env.INSTANT_ADMIN_TOKEN;
const db = init({ appId: APP_ID, adminToken: ADMIN_TOKEN });

const { ouraTokens } = await db.query({ ouraTokens: {} });
console.log(`ouraTokens rows visible to Admin SDK: ${ouraTokens.length}`);
for (const t of ouraTokens) {
  console.log(`  memberId=${t.memberId} accessToken=${t.accessToken.slice(0, 8)}... expiresAt=${new Date(t.expiresAt).toISOString()}`);
}
