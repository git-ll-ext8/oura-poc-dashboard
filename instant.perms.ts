import type { InstantRules } from "@instantdb/react";

// NON-NEGOTIABLE TOKEN LOCK (see CLAUDE.md / 02_IMPLEMENTATION_PLAN.md §2):
// ouraTokens must never be readable or writable from the client. Only the
// server-side Admin SDK (INSTANT_ADMIN_TOKEN, which bypasses all rules below)
// may touch this entity. Verify with a devtools check before Phase C demo.
const rules = {
  ouraTokens: {
    allow: {
      view: "false",
      create: "false",
      update: "false",
      delete: "false",
    },
  },
  members: {
    allow: {
      view: "true",
      create: "false",
      update: "false",
      delete: "false",
    },
  },
  dailyScores: {
    allow: {
      view: "true",
      create: "false",
      update: "false",
      delete: "false",
    },
  },
  consents: {
    allow: {
      view: "true",
      create: "false",
      update: "false",
      delete: "false",
    },
  },
} satisfies InstantRules;

export default rules;
