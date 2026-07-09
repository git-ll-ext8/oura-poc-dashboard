// One-off: write a fake ouraTokens row via Admin SDK so we can verify from the
// browser that the client-lock in instant.perms.ts actually blocks reads.
// Deletes are handled by scripts/delete-test-token.mjs. Not part of the app.
import { init, id } from "@instantdb/admin";

const APP_ID = process.env.NEXT_PUBLIC_INSTANT_APP_ID;
const ADMIN_TOKEN = process.env.INSTANT_ADMIN_TOKEN;
const db = init({ appId: APP_ID, adminToken: ADMIN_TOKEN });

const testId = id();
await db.transact([
  db.tx.ouraTokens[testId].update({
    memberId: "TEST",
    accessToken: "FAKE-DO-NOT-LEAK-abc123",
    refreshToken: "FAKE-DO-NOT-LEAK-xyz789",
    expiresAt: Date.now() + 3600_000,
  }),
]);
console.log("TEST_TOKEN_ID=" + testId);
