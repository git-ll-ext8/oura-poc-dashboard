# CentreCourt Team Wellness Dashboard

A team wellness leaderboard POC pulling Oura Ring readiness/sleep/activity scores into InstantDB and rendering them live. See `STATUS.md` for current phase/blockers and `02_IMPLEMENTATION_PLAN.md` for the full build spec.

## Stack

Next.js 16 (App Router, TypeScript) · Tailwind CSS v4 · Recharts · InstantDB

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Requires a `.env.local` (gitignored, not committed) with:

```
NEXT_PUBLIC_INSTANT_APP_ID=<instantdb app id>
INSTANT_ADMIN_TOKEN=<instantdb admin token>
```

## Seeding data

Pulls 30 days of Oura sandbox data (readiness/sleep/activity/steps) and writes it to InstantDB for all 5 team members. Safe to re-run — wipes and recreates `members` + `dailyScores`.

```bash
npm run seed
```

## Data model

- `instant.schema.ts` — entities: `members`, `ouraTokens`, `consents`, `dailyScores`
- `instant.perms.ts` — **`ouraTokens` is fully client-locked** (view/create/update/delete all `"false"`). Only the server-side Admin SDK can touch it. Re-verify before any real-token demo with:
  ```bash
  node --env-file=.env.local scripts/write-test-token.mjs
  # then check the client can't see it (see STATUS.md for how this was verified)
  node --env-file=.env.local scripts/delete-test-token.mjs
  ```

## What's live vs. static

- **Leaderboard** and **Weekly Trends** read live from InstantDB (`db.useQuery`).
- **Quarterly Growth** and **Achievements** are still hardcoded (`lib/data.ts`) — they'd need fabricated multi-quarter history / streak tracking that's out of scope for this POC.

## Deployment

Deployed via Vercel, imported from this GitHub repo. Only `NEXT_PUBLIC_INSTANT_APP_ID` needs to be set as a Vercel env var for the current phase — it's a public identifier, not a secret.
