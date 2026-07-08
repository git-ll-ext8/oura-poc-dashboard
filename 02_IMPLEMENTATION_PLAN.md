# IMPLEMENTATION PLAN: Oura Team Wellness Dashboard (POC)
**Build spec for Claude Code (Desktop "</> Code" tab) — also executable by any LLM agent or human developer.**
**Deadline:** Live demo Thu 2026-07-09 12:00 PM ET on a boardroom screen.

---

## 0. Context an LLM Needs (read first)
- Company: CentreCourt (Toronto). POC for a 5-person Ops team wellness leaderboard.
- Users: Danny Chan, Lawrence Liao, Kat Dineros, Nadia Mercuri, Tracy Li (+ Laura Cortez, external tester).
- Only Nadia, Tracy, Laura own Oura Ring 4 today. Demo requirement: **all 5 team members shown with sandbox data; Tracy additionally signed in with REAL Oura OAuth showing real scores.**
- Danny's dark-mode HTML dashboard mockup is the HTML file inside the `HTML.Dashboard.Mockup\` subfolder of the working directory. Match its visual design exactly.

## 1. Ground-Truth API Facts (verified 2026-07-06 — re-verify against https://cloud.ouraring.com/v2/docs before coding)
- Base URL: `https://api.ouraring.com/v2/usercollection/...`
- Sandbox: `https://api.ouraring.com/v2/sandbox/usercollection/...` — fake generated data, one sandbox endpoint per data type, usable without a real user.
- **Personal Access Tokens were deprecated Dec 2025.** OAuth2 (authorization code flow) is the ONLY auth path for real users.
  - Authorize URL: `https://cloud.ouraring.com/oauth/authorize`
  - Token URL: `https://api.ouraring.com/oauth/token`
  - Users can enable/disable individual scopes on the consent screen.
- API apps allow up to 10 users without Oura approval (we need ≤6 — fine).
- Users MUST have an active Oura Membership or the API returns 403 for their data.
- Key endpoints for this POC:
  - `GET /v2/usercollection/daily_readiness?start_date&end_date`
  - `GET /v2/usercollection/daily_sleep?start_date&end_date`
  - `GET /v2/usercollection/daily_activity?start_date&end_date`
  - `GET /v2/usercollection/daily_resilience`, `/daily_stress` (private view only)
  - `GET /v2/usercollection/personal_info` (display name/email — request minimal scopes)
- Scopes: request only `email personal daily` for the POC.
- Rate limits: per-token and per-app; 429 on breach. POC traffic is trivial, but cache responses server-side anyway.

## 2. Architecture
```
Browser ──> Next.js app on Vercel
              ├─ / (public demo dashboard — leaderboard)
              ├─ /me (private view for a signed-in user)
              ├─ /api/auth/oura/login      → redirect to Oura authorize URL
              ├─ /api/auth/oura/callback   → exchange code for tokens, store
              ├─ /api/refresh              → cron/manual: pull latest scores per user
              └─ /api/leaderboard          → merged sandbox + real user data (shared-metrics only)
Database: InstantDB (client-syncing realtime DB; docs: https://www.instantdb.com/docs)
  Client SDK (@instantdb/react) in the browser: READS leaderboard data live.
  Admin SDK (@instantdb/admin) in Next.js API routes only: ALL writes + token storage.
  entities (instant.schema.ts):
    members(name, role, isExternal, avatar, isLive)
    ouraTokens(memberId, accessToken, refreshToken, expiresAt)   -- CLIENT-LOCKED, see rule below
    consents(memberId, metric, shareOnLeaderboard)
    dailyScores(memberId, day, readiness, sleep, activity, source 'sandbox'|'oura')
Secrets (Vercel env vars): OURA_CLIENT_ID, OURA_CLIENT_SECRET, INSTANT_APP_ID, INSTANT_ADMIN_TOKEN, APP_BASE_URL
```
Design rules:
- **NON-NEGOTIABLE TOKEN LOCK:** in `instant.perms.ts`, the `ouraTokens` entity MUST be fully client-locked:
  ```ts
  ouraTokens: { allow: { view: "false", create: "false", update: "false", delete: "false" } }
  ```
  Only the server-side Admin SDK (which bypasses permissions via INSTANT_ADMIN_TOKEN) may touch it. INSTANT_ADMIN_TOKEN lives only in Vercel env vars, never in client code (no `NEXT_PUBLIC_` prefix).
  **Mandatory verification step (Phase C):** from an incognito browser with devtools open, attempt `db.useQuery({ ouraTokens: {} })` and confirm it returns a permission error / empty. Also confirm no token strings appear in the Network tab websocket frames. Do not proceed to demo without this check passing.
- Consents + dailyScores are also written ONLY by the server (client perms: view "true", create/update/delete "false"), except the consent toggle which goes through an API route so the server validates the signed-in user.
- Server-side only token handling. Access/refresh tokens NEVER reach the browser.
- Leaderboard renders via the client SDK's live query → updates in real time on the boardroom screen (demo moment: Tracy syncs her ring, screen updates without refresh).
- Leaderboard endpoint filters by `consents` — a metric a user hasn't opted into is omitted, rendered as "Private".
- Sandbox seeding: on first deploy, a seed script pulls 30 days from the sandbox endpoints and writes rows for Danny, Lawrence, Kat, Nadia (and Tracy until she signs in) with `source='sandbox'`. When Tracy completes OAuth, her rows switch to `source='oura'` and a "LIVE" badge appears on her card.
- External flag: Laura `is_external=true` → excluded from any exported/reporting views.

## 3. Build Phases — EMERGENCY TIMELINE (build starts Wed 2026-07-08 evening; demo Thu 12:00 PM)
Executor: **Claude Code (Desktop app "</> Code" tab)** on Lawrence's machine, folder `C:\AI.Dev\Misc\Oura.Ring.App\510.Claude.Code` (Codex fallback: `..\520.Codex`).
Rule: each phase ends with a WORKING DEPLOYED APP. Never start the next phase until the current one is banked. Any phase alone is a winnable demo.

### Phase 0 — Environment (Wed eve, ~20 min, Claude Code does it)
0a. Verify/install via winget: Node.js LTS, Git. Do NOT uninstall or modify anything already present.
0b. Lawrence creates accounts when prompted: GitHub → Vercel (sign in with GitHub) → InstantDB. (Oura dev account deferred to Phase C.)

### Phase A — Static dashboard LIVE (Wed eve, ~1–2 hrs) ← MINIMUM WIN
1. `npx create-next-app@latest` (TypeScript, App Router, Tailwind).
2. UI: pixel-match the mockup in `HTML.Dashboard.Mockup\`. Only if it is unreadable/missing, fall back to building a polished dark-mode team leaderboard — 5 member cards (Danny, Lawrence, Kat, Nadia, Tracy), readiness/sleep/activity scores 0–100, 7-day sparklines (Recharts), medal ranking, "LIVE"/"SANDBOX" badges — with hardcoded realistic JSON.
3. Push to GitHub, deploy to Vercel. ✅ BET-WINNING BASELINE BANKED.

### Phase B — InstantDB + sandbox data (Wed eve, ~1–2 hrs)
4. InstantDB setup; `instant.schema.ts` + `instant.perms.ts` per §2 — token lock rule FIRST, before any token exists. Push schema + perms.
5. Seed script (server, Admin SDK) pulls 30 days from Oura sandbox endpoints for all 5 members.
6. Dashboard reads via client live query (`db.useQuery`). Redeploy. ✅ Real API-shaped data, updating live.

### Phase C — Real OAuth (STRETCH — only if Phase B is banked and it's before ~10 PM Wed, else Thu 8–10 AM)
7. Lawrence: Oura account (mobile app, skip ring pairing) → cloud.ouraring.com developer portal → register app → Client ID/Secret → Vercel env vars. Redirect URIs: production Vercel URL AND `http://localhost:3000/api/auth/oura/callback`.
8. Authorization-code flow + refresh; tokens via Admin SDK into client-locked `ouraTokens`.
9. Per-metric consent toggles (default OFF).
10. **Token-lock verification (§2). Blocking gate.**
11. Tracy signs in from her phone (Thu morning is fine — she syncs her ring on waking, scores appear live).
**If Phase C isn't solid by Thu 10:30 AM → cut it. Demo A+B and say "individual sign-in ships Friday." The bet is won on A+B.**

### Phase D — Demo prep (Thu 10:30–11:30 AM)
12. DEPLOY FREEZE at 10:30. Screenshot every view (backup deck). Test URL at boardroom resolution; fonts readable from 3 m.

## 4. Demo-Day Runbook (Thu 11:30 AM)
1. Open URL on boardroom screen 30 min early; hard-refresh.
2. If Phase C shipped: confirm Tracy's LIVE badge + today's scores (remind her at 9 AM to open her Oura app to sync). If not: sandbox data is the demo — equally winnable.
3. Backup: screenshots of every view saved to a local folder + phone.
4. Narrative: idea → live product overnight → thesis slide → pilot ask → collect the bet.

## 5. Out of Scope for POC (say no to scope creep)
- Mobile app (Expo) — phase 2, see tech stack doc.
- Webhooks — polling/manual refresh is fine for 6 users.
- Historical analytics, admin panel, notifications, challenges engine.

## 6. Risk Register
| Risk | Mitigation |
|---|---|
| Tracy has no active Oura Membership → API 403 | Membership CONFIRMED active. She must open her Oura app to sync before scores appear; fallback: Nadia or Laura |
| InstantDB perms misconfigured → tokens sync to clients | Token-lock rule in perms + mandatory devtools verification gate (Phase C) |
| Oura account creation requires ring pairing | Fallback: Tracy creates/owns the developer app registration |
| OAuth redirect mismatch errors | Register BOTH the production Vercel URL and `http://localhost:3000/api/auth/oura/callback` |
| Vercel deploy issues Thu AM | Deploy freeze Thu 10:30 AM; after that the app is read-only |
| Oura API outage during demo | All demo data served from our DB cache, never live-fetched during the demo |
