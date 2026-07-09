# STATUS — Oura Team Wellness Dashboard

**Updated:** 2026-07-08 (Wed evening) by Claude Code
**Deadline:** Thu 2026-07-09 12:00 PM ET — live demo on boardroom screen

## Current phase
Phase B core done (Leaderboard tab reads live from InstantDB, sandbox-sourced). Blocked on Vercel import for the live URL — not yet confirmed banked.

## Banked milestones
- [x] Phase 0 — Environment verified (Node v22.23.1, npm 11.6.4, Git 2.55.0 already present; nothing installed/modified)
- [x] Phase A — Static Next.js dashboard built, pixel-matching Danny's mockup (sidebar nav, Leaderboard/Quarterly Growth/Weekly Trends/Achievements views, ring-arc scores, Recharts charts)
- [x] Git repo created and pushed: https://github.com/git-ll-ext8/oura-poc-dashboard
- [x] InstantDB app connected (`oura-poc-dashboard`, app id `96b57038-cc1d-4db6-9b66-7a86d802d443`)
- [x] `instant.schema.ts` pushed — members, ouraTokens, consents, dailyScores
- [x] `instant.perms.ts` pushed — **ouraTokens fully client-locked** (view/create/update/delete = "false") before any real token exists
- [x] Seed script (`npm run seed`, Admin SDK) pulls live Oura sandbox data (readiness/sleep/activity/steps) for all 5 members, writes `dailyScores` with `source: "sandbox"` — re-run safe (wipes + recreates)
- [x] Leaderboard tab rewired to `db.useQuery` — live member cards, category leaders, and weekly chart, sourced from InstantDB (not hardcoded)
- [ ] **Vercel import + first deploy — NOT YET CONFIRMED.** Lawrence has a Vercel account linked to GitHub but hasn't confirmed the import is done or given a URL.
- [ ] Formal token-lock devtools verification (mandatory Phase C gate — deferred until a real token row exists to test against; permission rule is already live)
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
4. Then: Phase C stretch (Oura OAuth for Tracy) or polish Quarterly/Trends/Achievements tabs (currently still static/hardcoded — acceptable per CLAUDE.md's definition of done, which only requires the Leaderboard to be InstantDB-backed).

## Notes for the other agent (Codex fallback, `..\520.Codex`)
- Stack ended up on Next.js 16.2.10 / React 19.2.4 (not 15 as originally planned in 03_TECH_STACK.md) — `create-next-app@latest` now resolves to 16. App Router conventions unchanged, no blocking issues found.
- Oura sandbox endpoints (`https://api.ouraring.com/v2/sandbox/usercollection/...`) DO require an `Authorization` header but accept any string as bearer token (confirmed live, contradicts a literal reading of "no account needed" in the docs — you still need *a* header, just not a real credential).
- Sandbox fixture data is a fixed canned dataset (same values regardless of caller) — the seed script (`scripts/seed.mjs`) applies a small deterministic per-member offset so the leaderboard doesn't show 5 identical members. This is a real cosmetic/scope decision, not a bug.
- Dropped "HRV ms" as a live metric — Oura's readiness/sleep/activity sandbox endpoints (the only ones in scope per 02_IMPLEMENTATION_PLAN.md §1) don't return a raw HRV-in-ms field. Replaced the mockup's "Best HRV" category card with "Best Activity" on the live Leaderboard tab only. Quarterly/Trends/Achievements tabs still show the original mockup's HRV numbers from static `lib/data.ts` — those tabs are intentionally NOT wired to InstantDB yet (out of the CLAUDE.md minimum-win scope).
- `.env.local` holds `NEXT_PUBLIC_INSTANT_APP_ID` and `INSTANT_ADMIN_TOKEN` — gitignored, confirmed never staged.
