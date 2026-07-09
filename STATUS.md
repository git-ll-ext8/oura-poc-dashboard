# STATUS — Oura Team Wellness Dashboard

**Updated:** 2026-07-08 (Wed evening) by Claude Code
**Deadline:** Thu 2026-07-09 12:00 PM ET — live demo on boardroom screen

## Current phase
Phase B core done and security-verified (Leaderboard reads live from InstantDB, token-lock confirmed in-browser). Working autonomously through the rest of Phase B while Lawrence completes the Vercel import in parallel.

## Banked milestones
- [x] Phase 0 — Environment verified (Node v22.23.1, npm 11.6.4, Git 2.55.0 already present; nothing installed/modified)
- [x] Phase A — Static Next.js dashboard built, pixel-matching Danny's mockup (sidebar nav, Leaderboard/Quarterly Growth/Weekly Trends/Achievements views, ring-arc scores, Recharts charts)
- [x] Git repo created and pushed: https://github.com/git-ll-ext8/oura-poc-dashboard
- [x] InstantDB app connected (`oura-poc-dashboard`, app id `96b57038-cc1d-4db6-9b66-7a86d802d443`)
- [x] `instant.schema.ts` pushed — members, ouraTokens, consents, dailyScores
- [x] `instant.perms.ts` pushed — **ouraTokens fully client-locked** (view/create/update/delete = "false") before any real token exists
- [x] Seed script (`npm run seed`, Admin SDK) pulls live Oura sandbox data (readiness/sleep/activity/steps) for all 5 members, writes `dailyScores` with `source: "sandbox"` — re-run safe (wipes + recreates)
- [x] Leaderboard tab rewired to `db.useQuery` — live member cards, category leaders, and weekly chart, sourced from InstantDB (not hardcoded)
- [x] **Token-lock verified in a real browser**: wrote a fake row to `ouraTokens` via Admin SDK, confirmed the client SDK's `db.useQuery({ouraTokens:{}})` returns `rows: []` (no leak, no error) despite the row existing, then deleted the fake row. Reusable scripts kept at `scripts/write-test-token.mjs` / `scripts/delete-test-token.mjs` for re-verification before the Phase C demo gate.
- [x] Weekly Trends tab rewired to `db.useQuery` too (sleep/activity/steps, last 7 days, real dates) — in scope since it's the same `dailyScores` data already fetched, not fabricated history
- [x] Sidebar team list now ranked from the same live query instead of stale hardcoded order — was a real (if minor) inconsistency, now fixed
- [x] Dead code removed from `lib/data.ts` (`ranked`, `weeklySeries`, `weeklyPointStandings`, unused `DAYS`/`SPREAD`) now that Leaderboard/Trends/Sidebar no longer read from it — `lib/data.ts` is now used only by Quarterly Growth and Achievements (deliberately still static, see notes below)
- [ ] **Vercel import + first deploy — NOT YET CONFIRMED.** Lawrence has a Vercel account linked to GitHub, import in progress.
- [ ] Phase C (stretch) — Real OAuth for Tracy

## Live URLs
- GitHub: https://github.com/git-ll-ext8/oura-poc-dashboard
- Vercel: **not yet deployed — this is the current blocker**

## Current blocker
Waiting on Lawrence to complete the Vercel import and report back the deploy URL. Once imported, the project needs one env var set before/during first deploy:
- `NEXT_PUBLIC_INSTANT_APP_ID` = `96b57038-cc1d-4db6-9b66-7a86d802d443` (not secret, safe to expose — required for the client SDK to connect)

`INSTANT_ADMIN_TOKEN` and Oura credentials are NOT needed on Vercel yet (seed script runs locally only; Phase C will need them later for OAuth API routes).

## Next step
1. Lawrence imports `oura-poc-dashboard` repo in Vercel, adds `NEXT_PUBLIC_INSTANT_APP_ID` env var, deploys.
2. Verify live URL renders the leaderboard with real InstantDB data (not a loading spinner stuck / blank).
3. Update this file with the deploy URL.
4. Then: Phase C stretch (Oura OAuth for Tracy). Quarterly Growth and Achievements stay static/hardcoded by design — they need fabricated multi-quarter history and streak tracking our schema/Oura sandbox don't provide, which is "historical analytics," explicitly out of scope per CLAUDE.md §5.

## Notes for the other agent (Codex fallback, `..\520.Codex`)
- Stack ended up on Next.js 16.2.10 / React 19.2.4 (not 15 as originally planned in 03_TECH_STACK.md) — `create-next-app@latest` now resolves to 16. App Router conventions unchanged, no blocking issues found.
- Oura sandbox endpoints (`https://api.ouraring.com/v2/sandbox/usercollection/...`) DO require an `Authorization` header but accept any string as bearer token (confirmed live, contradicts a literal reading of "no account needed" in the docs — you still need *a* header, just not a real credential).
- Sandbox fixture data is a fixed canned dataset (same values regardless of caller) — the seed script (`scripts/seed.mjs`) applies a small deterministic per-member offset so the leaderboard doesn't show 5 identical members. This is a real cosmetic/scope decision, not a bug.
- Dropped "HRV ms" as a live metric — Oura's readiness/sleep/activity sandbox endpoints (the only ones in scope per 02_IMPLEMENTATION_PLAN.md §1) don't return a raw HRV-in-ms field. Replaced the mockup's "Best HRV" category card with "Best Activity" on the Leaderboard, and "HRV (ms)" with "Activity Score" on Weekly Trends — both now live from InstantDB. Quarterly Growth and Achievements still show the original mockup's static numbers (including HRV) from `lib/data.ts` — deliberately NOT wired, since they need fabricated multi-quarter history / streak tracking that's out of scope (CLAUDE.md §5, "historical analytics").
- `.env.local` holds `NEXT_PUBLIC_INSTANT_APP_ID` and `INSTANT_ADMIN_TOKEN` — gitignored, confirmed never staged.
