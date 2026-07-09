# STATUS — Oura Team Wellness Dashboard

**Updated:** 2026-07-09 (Thu morning) by Claude Code
**Deadline:** Thu 2026-07-09 12:00 PM ET — live demo on boardroom screen. Phase C hard deadline: working in production by 11:00 AM.

## Current phase
**Phase C code is complete and verified on localhost.** OAuth login→callback→token-storage→real-data-pull→consent flow tested end-to-end with Lawrence's real Oura account (no ring, so the empty-data path was what got exercised — confirmed graceful, no crash). Token-lock re-verified with a REAL token in the table. **Presentation package also shipped** (queued after Phase C, did not block it): data-source badges + live-transition pulse on the leaderboard, plus 3 new slide-deck pages (`/story`, `/script`, `/thesis`) for the demo itself. Only remaining blocker: Lawrence adds Vercel env vars and redeploys, then Tracy tests for real in production.

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
- [x] **Vercel import + first deploy — LIVE.** https://oura-poc-dashboard.vercel.app/ — confirmed by Lawrence in-browser rendering live InstantDB data in production. **✅ BET-WINNING BASELINE BANKED (Phase A+B).**
- [x] **`/story` page shipped** — `docs/STORY.md` (Lawrence's non-technical delivery summary) converted into a polished page at `/story`, matching the dashboard's dark-mode design language: comparison table, numbered plain-terms build list, and the "AI was the construction crew..." line as a featured pull-quote banner. Subtle "The Story" link added to the bottom of the sidebar nav (works from any page — the 4 view items now navigate back to `/` if clicked while elsewhere, no behavior change on the dashboard itself). Verified: local build/lint clean, both routes prerender static, leaderboard confirmed unregressed with live data after the change.
- [x] **Oura app registered**: "CentreCourt Wellness POC", scopes email/personal/daily, redirect URIs registered for both localhost and production.
- [x] **OAuth login route** (`/api/auth/oura/login?member=<shortId>`) — redirects to real Oura authorize URL, sets httpOnly CSRF-nonce cookie carrying the member selection. Verified via `curl` against the actual running dev server: correct `client_id`/`redirect_uri`/`scope`/`state`.
- [x] **OAuth callback route** (`/api/auth/oura/callback`) — exchanges code for tokens, stores via Admin SDK into the locked `ouraTokens` entity, pulls real daily readiness/sleep/activity for the last 7 days, writes `dailyScores` with `source: "oura"`, sets `members.isLive = true` — but ONLY if real data actually came back. **Tested live end-to-end with Lawrence's real Oura account** (results below).
- [x] **Empty-data path verified graceful**: Lawrence's account has no ring. Real logs: `readiness:0 sleep:0 activity:0` → `"no real data returned ... graceful no-op"` → no dailyScores written, isLive stays false, no crash, redirected to consent page with a friendly "no ring data yet" banner.
- [x] **Consent page + `/api/consent`** — 3 toggles (readiness/sleep/activity), default OFF, session-cookie-gated save. Consent-save path independently verified via direct request (httpOnly blocks browser JS, not a direct HTTP client) since Lawrence's test run didn't click Save — confirmed round-trip write works, then cleaned up that synthetic test data.
- [x] **Token-lock re-verified with a REAL token**: Lawrence's actual OAuth token is now in `ouraTokens` (Admin SDK sees it: 1 row, `memberId=L`). Re-ran the client-side check — `db.useQuery({ouraTokens:{}})` still returns `rows: []` from the browser. Lock holds under real conditions, not just the synthetic test.
- [x] Leaderboard gates real (`source: "oura"`) member metrics by consent — sandbox members (Danny/Nadia/Lawrence-normally/Kathrina) unaffected, always shown. "Sign in with Oura" CTA added to any non-live member card. LIVE badge shows once `isLive` is true.
- [x] **Presentation package — data-source badges** (`components/LeaderboardView.tsx`, `app/globals.css`): sandbox members get a subtle muted "DEMO DATA" badge; oura-sourced members get a prominent glowing "● LIVE — real Oura Ring data" badge with a pulsing box-shadow animation. When a member's `isLive` flips false→true while the card is mounted, a brief highlight-pulse animation fires on the card (verified live: flipped a member's `isLive` via Admin SDK while the leaderboard was open in-browser — badge updated with no refresh, confirming the exact mechanism the acceptance criterion depends on).
- [x] **Presentation package — reusable `SlideDeck` component** (`components/SlideDeck.tsx`): full-viewport sections via CSS scroll-snap, arrow-key/PageUp/PageDown/Space navigation, clickable progress dots. Shared by all 3 new pages below.
- [x] **`/story` rebuilt as a 5-slide deck** (was an article page) — mockup-vs-product 2-card comparison, big-number stats (1 evening/1,500+ lines/4 platforms/$0), privacy shield slide, the featured quote as a full-slide banner, closing line.
- [x] **New `/script` page** — presenter cue cards (`components/ScriptView.tsx`), one big card per step (4 steps + fallback), stage directions in italic muted text, spoken lines in large bold — designed to be advanced with arrow keys while presenting hands-free.
- [x] **New `/thesis` page** — 5 management-pitch slides (`components/ThesisView.tsx`): the thesis statement, what the POC proves, a 3-segment experiment timeline (Weeks 1-4 baseline / 5-16 leaderboard+challenges / 17 report), honest limits framed as the reason to expand, the ask.
- [x] Sidebar gained a compact "The Story · Presenter Script · Thesis" text-link row at the bottom — explicitly flagged (in a code comment) as POC-only, to remove before any real-team rollout.
- [ ] **Vercel env vars — NOT YET ADDED.** See exact names/values below. This is the current blocker before Tracy can test in production.
- [ ] Tracy's real production sign-in — pending the above

## Live URLs
- GitHub: https://github.com/git-ll-ext8/oura-poc-dashboard
- Vercel (production): **https://oura-poc-dashboard.vercel.app/**

## Current blocker
**Waiting on 3 Vercel env vars + a redeploy — Lawrence's click, not mine.** Exact values below. Once added and redeployed, Tracy can sign in for real.

## Vercel env vars needed NOW (Settings → Environment Variables → Production)
| Name | Value | Secret? |
|---|---|---|
| `OURA_CLIENT_ID` | `eaa6a0ea-7cfa-4f4b-b5cd-b8038930306b` | No, but no need to expose either — server-only var |
| `OURA_CLIENT_SECRET` | `wzuuH2JyGnXYcLKgK4n4z3RaS0G73Qlu6-9j0vxlOCI` | **Yes — mark sensitive/encrypted in Vercel** |
| `APP_BASE_URL` | `https://oura-poc-dashboard.vercel.app` | No — must exactly match the registered redirect URI's origin |

`NEXT_PUBLIC_INSTANT_APP_ID` should already be set from Phase B — no change needed there. `INSTANT_ADMIN_TOKEN` was NOT previously needed on Vercel but **IS now required** (the callback/consent routes run server-side on Vercel and need it) — add it too:

| Name | Value | Secret? |
|---|---|---|
| `INSTANT_ADMIN_TOKEN` | `249ed72c-330d-4e4d-a85b-8ba455156f5c` | **Yes — mark sensitive/encrypted** |

After adding all 4, redeploy (Vercel should prompt, or trigger via the Deployments tab → redeploy latest).

## Next step
1. Lawrence adds the 4 env vars above in Vercel, redeploys.
2. Confirm the production site still loads correctly (sandbox data, no crash) post-redeploy.
3. Tracy opens the production URL, clicks "Sign in with Oura" on her card, completes real Oura consent, completes our consent toggles.
4. **Watch the acceptance criterion happen live**: her card should flip to real data + LIVE badge within ~30s, on an already-open tab, no refresh — this works automatically because InstantDB pushes the update to every open `db.useQuery` subscriber the moment the Admin SDK writes it.
5. If anything's off at that point: check Vercel's function logs for the callback/consent routes (same `console.log`/`console.error` lines verified locally should appear there).

## Notes for the other agent (Codex fallback, `..\520.Codex`)
- Stack ended up on Next.js 16.2.10 / React 19.2.4 (not 15 as originally planned in 03_TECH_STACK.md) — `create-next-app@latest` now resolves to 16. App Router conventions unchanged, no blocking issues found.
- Oura sandbox endpoints (`https://api.ouraring.com/v2/sandbox/usercollection/...`) DO require an `Authorization` header but accept any string as bearer token (confirmed live, contradicts a literal reading of "no account needed" in the docs — you still need *a* header, just not a real credential).
- Sandbox fixture data is a fixed canned dataset (same values regardless of caller) — the seed script (`scripts/seed.mjs`) applies a small deterministic per-member offset so the leaderboard doesn't show 5 identical members. This is a real cosmetic/scope decision, not a bug.
- Dropped "HRV ms" as a live metric — Oura's readiness/sleep/activity sandbox endpoints (the only ones in scope per 02_IMPLEMENTATION_PLAN.md §1) don't return a raw HRV-in-ms field. Replaced the mockup's "Best HRV" category card with "Best Activity" on the Leaderboard, and "HRV (ms)" with "Activity Score" on Weekly Trends — both now live from InstantDB. Quarterly Growth and Achievements still show the original mockup's static numbers (including HRV) from `lib/data.ts` — deliberately NOT wired, since they need fabricated multi-quarter history / streak tracking that's out of scope (CLAUDE.md §5, "historical analytics").
- `.env.local` holds `NEXT_PUBLIC_INSTANT_APP_ID`, `INSTANT_ADMIN_TOKEN`, `OURA_CLIENT_ID`, `OURA_CLIENT_SECRET`, `APP_BASE_URL` — gitignored, confirmed never staged.
- New route `app/story/page.tsx` + `components/StoryView.tsx` — a stakeholder-facing page, source content lives in `docs/STORY.md`. Not linked from CLAUDE.md's spec, added per direct instruction outside the phase plan.
- Gotcha hit Wed night: the local `next dev` Turbopack server can go stale (kept serving pre-edit CSS/JS) without erroring, and stopping/restarting via the preview tool's serverId didn't actually kill the underlying OS process — had to `Stop-Process` the actual node PIDs (find via `netstat`/`Get-CimInstance Win32_Process`) before a real restart picked up recent changes. If a change looks "not applied" in local dev despite correct source and a clean `npm run build` output, suspect this before assuming a code bug.
- **Phase C member-selection design decision:** rather than a single generic "Sign in with Oura" button, the CTA lives on each non-live member card and passes `?member=<shortId>` to `/api/auth/oura/login`. That shortId is round-tripped through an httpOnly cookie (`oura_oauth_state`, format `nonce:shortId`) set at login and read back at callback — this doubles as CSRF protection (nonce must match the `state` param) and as "who is this" (no separate account-matching/lookup needed). Deliberately simple for a 5-person trusted-team POC; not a security review-grade session system.
- `members.isLive` is set independent of consent — it flips true as soon as real Oura data is successfully pulled and written, regardless of what the user later consents to share. Consent only controls which *values* are visible, not the LIVE badge itself. This matches the plan's own description ("when Tracy completes OAuth ... a LIVE badge appears") and the acceptance criterion's framing (badge + data appear together once consent is *completed*, since consent happens right after in the same flow).
- `ouraTokens` upsert pattern: callback deletes any existing token row for that memberId before inserting the fresh one (same for `dailyScores` with `source: "oura"`) — safe to re-run OAuth for the same member without accumulating duplicates.
- Weekly Trends tab is NOT consent-gated (only Leaderboard is, per the explicit instruction wording) — a deliberate scope cut given the 11 AM deadline, not an oversight.
- Presentation pages (`/story`, `/script`, `/thesis`) are content/static-only per explicit instruction — no OAuth/leaderboard logic touched by them (the one exception, the badge layer in `LeaderboardView.tsx`, was done and pushed as its own commit BEFORE the 11:00 freeze, separately from the slide pages which could run to 11:15).
- Gotcha hit this morning: an `Edit` call left a stray duplicate closing `}` in `globals.css` because the old_string I matched didn't include the original rule's trailing brace, so the file's leftover `}` landed right after my newly-inserted CSS block. Turbopack failed with `CssSyntaxError: Unexpected }` at the exact line. Fix: count `{`/`}` balance (`grep -c` or a quick Node one-liner) when a CSS edit produces a syntax error and the line number alone isn't obviously wrong.
- `preview_inspect`'s reported `boundingBox` was unreliable for at least one element during this session (showed a `.slide` narrower than its parent when the real DOM was fine) — when a layout looks broken but the CSS looks right, cross-check with `element.getBoundingClientRect()` via `preview_eval` (extract plain numbers manually — `JSON.stringify(rect)` returns `{}` since DOMRect properties are prototype getters) before trusting the inspect tool's numbers.
