import { init } from "@instantdb/admin";

// Server-only. Never import from a client component — INSTANT_ADMIN_TOKEN bypasses all perms.
export const adminDb = init({
  appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID!,
  adminToken: process.env.INSTANT_ADMIN_TOKEN!,
});
