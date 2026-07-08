# TECH STACK: Oura Team Wellness Dashboard
**Decision doc — web POC now, native iOS/Android later.**

## Guiding constraints
1. Live HTTPS URL by Thu 2026-07-09 12 PM (3 days).
2. OAuth2 server-side code flow → needs a backend (secrets can't live in a static page).
3. Same codebase/skills must extend to native mobile (Expo) in phase 2.
4. Built by Claude Code (Desktop "</> Code" tab) → prefer mainstream, heavily-documented stack.

## Decision (POC)
| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 15 (App Router, TypeScript)** | API routes = free backend for OAuth; best-documented React framework → LLM agents make fewest mistakes here |
| Styling | **Tailwind CSS** | Fast port of the dark-mode HTML mockup |
| Charts | **Recharts** | Sparklines + score trends, simple API |
| DB | **InstantDB** (free tier) | Realtime client-syncing DB → leaderboard updates live; same SDK family for web + Expo; Admin SDK for server-side writes; official LLM/agent skill (`npx skills add instantdb/skills`) |
| Token storage rule | `ouraTokens` entity **client-locked** in `instant.perms.ts` (view/create/update/delete = "false"); Admin SDK (server-only) is the sole writer | Oura OAuth tokens must never sync to browsers — verified pre-demo via devtools check |
| Hosting | **Vercel** (free/hobby) | git push → HTTPS URL in minutes; env-var secrets; preview deploys |
| Auth to Oura | **OAuth2 authorization-code flow**, hand-rolled in API routes (~100 lines) | PATs deprecated Dec 2025; flow is simple enough that an OAuth library is optional |
| App auth (who is viewing) | **None for POC** — dashboard is unlisted URL; `/me` keyed by session cookie set at OAuth callback | Real auth (Entra ID SSO) is phase-2; don't burn demo time |

### Alternatives considered
- **Digital Ocean App Platform:** solid, but adds container/app-spec setup time and ~$5/mo; choose it later if CentreCourt wants infra ownership. Migration from Vercel is low-effort (same Next.js app).
- **Hostinger:** PHP/static-oriented shared hosting; poor fit for Node SSR + serverless OAuth callbacks. Rejected.
- **Single Expo universal app (web + native from day 1):** tempting, but Expo web + server-side OAuth secrets is awkward and riskier under a 3-day deadline. Rejected for POC.
- **Neon Postgres / Supabase:** the boring-and-safe option (tokens physically can't reach browsers). Rejected in favor of InstantDB for realtime leaderboard + stronger Expo reuse; risk managed via the client-locked token entity + mandatory pre-demo verification. Revisit Postgres if production/HR review demands it.
- **InstantDB risk register:** (1) startup SaaS, US-hosted, holding wellness *scores* only — flagged for data-residency/privacy review before production; open source + self-hostable as exit path. (2) Permission-rule mistake could sync tokens to clients — mitigated by the token-lock rule + verification gate in the implementation plan. (3) Client-side cache means demo survives brief outages (net positive).

## Phase 2 (post-POC): native mobile
- **Expo (React Native) + Expo Router**, TypeScript.
- The Next.js API routes become the shared backend: mobile app calls `/api/leaderboard`, `/api/me`, and uses the same OAuth endpoints via `expo-auth-session` deep links.
- Shared package for TypeScript types/score logic (`/packages/shared`) → move repo to a simple monorepo (pnpm workspaces or Turborepo) when phase 2 starts, not before.
- Push notifications (challenge reminders) via Expo Notifications.
- Distribution: internal only → Expo EAS internal distribution / TestFlight + Play internal testing; MDM push via Intune possible later (Lawrence already runs Intune).

## Phase 2+ hardening checklist
- Entra ID SSO for viewer auth (CentreCourt is M365 shop)
- Oura webhooks instead of polling
- Token encryption via managed KMS, audit logging
- Move consent records + data-retention policy into writing with HR
