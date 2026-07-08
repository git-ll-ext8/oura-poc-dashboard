# SESSION LOG: Oura POC Planning — updated 2026-07-08 (Wed) 5:45 PM
**Feed this file to a new LLM session for full context.**

## Project
CentreCourt Ops wellness POC. Thesis: healthy employees are higher-functioning. Web dashboard (leaderboard) built from Danny's dark-mode HTML mockup. **Hard deadline: Thu 2026-07-09 12:00 PM ET, live URL on boardroom screen.** Bet: working POC → Danny buys Oura Ring 5 + 1-yr subs for Lawrence, Kat, and himself.

## People
- Danny Chan — VP Ops, sponsor, made the mockup
- Lawrence Liao — IT Manager, building the POC (this project's owner)
- Kat Dineros — Office Manager | Nadia Mercuri — HR Recruiter | Tracy Li — Office Assistant
- Laura Cortez — Danny's wife, EXTERNAL tester (has Ring 4; exclude from mgmt reporting)
- Ring 4 owners today: Nadia, Tracy, Laura. Others get Ring 5 if bet is won.

## Decisions made this session
1. **Demo bar:** sandbox data for all 5 team members + **Tracy** signed in live via real OAuth.
2. **Hosting:** Vercel (fastest; DO considered for later, Hostinger rejected).
3. **Stack:** Next.js 15 + TypeScript + Tailwind + Recharts + InstantDB (realtime DB) on Vercel — switched from Neon Postgres per session discussion; ouraTokens entity client-locked, Admin SDK server-only. Expo mobile is phase 2.
4. **Leaderboard privacy:** composite scores only (readiness/sleep/activity), per-metric opt-in toggles, raw physiology private-view only.
5. **Thesis measurement:** weekly 1-min MS Forms pulse survey starts NOW (pre-ring baseline) + absence data; self-comparison before/after design; honest n=5 framing.
6. **Builder:** PRIMARY = Claude Code (Desktop "</> Code" tab) in C:\AI.Dev\Misc\Oura.Ring.App\510.Claude.Code. FALLBACK = Codex desktop app in ..\520.Codex (self-contained bundle). Both share one GitHub repo / Vercel / InstantDB; handoff via repo + this session log. Token rule: Sonnet/mid-tier for scaffolding, big models only for hard bugs.

## Verified API ground truth (2026-07-06)
- Oura PATs deprecated Dec 2025 → OAuth2 code flow mandatory (authorize: cloud.ouraring.com/oauth/authorize, token: api.ouraring.com/oauth/token).
- Sandbox endpoints: /v2/sandbox/usercollection/* (fake data, no account needed).
- ≤10 users needs no Oura approval; per-scope user consent built in.
- Active Oura Membership required or API returns 403.
- New developer portal released 2025; account without ring is possible.

## Open action items (Lawrence)
- [ ] **Phase C time:** create Oura account (mobile app, skip pairing) → cloud.ouraring.com → register API app → Client ID/Secret. Fallback: Tracy registers.
- [x] Tracy Oura Membership CONFIRMED active. Still needed: her 10-min availability (Thu AM ok) for OAuth sign-in.
- [x] Danny's HTML mockup in place: HTML.Dashboard.Mockup\ subfolder of BOTH work folders.
- [ ] Create MS Forms pulse survey + Power Automate Friday reminder (baseline starts this week).
- [ ] Ask Nadia to sanity-check the consent note (see thesis doc §5).

## Documents produced
- 01_THESIS_Healthy_Workers.md
- 02_IMPLEMENTATION_PLAN.md (LLM-agnostic build spec, phases A–D, risk register, demo runbook)
- 03_TECH_STACK.md
- 05_PROMPT_RESTART.md

## Next session goals
Claude Code executes Phases 0→A→B tonight (Wed), Phase C stretch. Mockup still not provided — fallback design authorized.
