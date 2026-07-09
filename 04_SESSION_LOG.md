# SESSION LOG: Oura POC — updated Wed 2026-07-08 ~9:30 PM (END OF DAY)
**Feed this file to a new LLM session for full context. Demo: TOMORROW Thu 12:00 PM at restaurant lunch.**

## Bottom line
Phases A+B are LIVE IN PRODUCTION: https://oura-poc-dashboard.vercel.app/ — dark-mode leaderboard, real Oura sandbox data via InstantDB, live-updating, token-lock security VERIFIED by test. A /story page (non-technical build narrative) is also live at /story. **Phase C (real OAuth) is tomorrow's build and, per Danny's bar, the actual win condition: Tracy's real ring data must be flowing by the demo.**

## Infrastructure (all working, all accounts Lawrence's)
- GitHub: github.com/git-ll-ext8/oura-poc-dashboard (public; STATUS.md at root = supervision channel; auto-deploys to Vercel on push to master)
- Vercel: project oura-poc-dashboard, team Lawrence-POC (Hobby), 2FA enabled. Env var set: NEXT_PUBLIC_INSTANT_APP_ID (Production+Preview, marked safe)
- InstantDB: app oura-poc-dashboard, App ID 96b57038-cc1d-4db6-9b66-7a86d802d443. Admin token in .env.local ONLY (gitignored). ouraTokens entity client-locked in perms — verified empty from client despite real row existing
- Builder: Claude Code Desktop "</> Code" tab, folder C:\AI.Dev\Misc\Oura.Ring.App\510.Claude.Code, model Sonnet (token conservation). Codex fallback bundle in ..\520.Codex (resume-from-repo logic built in)
- Session token limit hit ~9 PM Wed; resets 10:40 PM. No impact on 7:30 AM start.

## Key decisions today
1. Demo bar RAISED by Lawrence: sandbox-only no longer wins the bet — Tracy's REAL data must flow. Phase C promoted from stretch to must-have.
2. Demo format: restaurant lunch, laptop on phone hotspot. Wow moment = Nadia signs in LIVE at the table, flips her own consent toggles, leaderboard re-ranks itself on the open screen, numbers cross-checked against her Oura app. Mobile responsiveness demoted to bonus.
3. /story page added for non-technical effort narrative (from What_Was_Actually_Built doc).
4. Phase C acceptance criterion: consent completed → real scores appear on already-open leaderboard within ~30s, no refresh, LIVE badge.

## Open items (tonight/tomorrow)
- [ ] Lawrence tonight: create Oura account via BROWSER at cloud.ouraring.com (mobile app blocks without ring) → register API app → Client ID/Secret. Redirect URIs: https://oura-poc-dashboard.vercel.app/api/auth/oura/callback AND http://localhost:3000/api/auth/oura/callback
- [ ] FALLBACK if account needs a ring: Tracy registers the app tomorrow 8 AM (script in runbook)
- [ ] RESEARCH (Claude, ~7 AM or tonight 10:40+): ground-truth Oura docs on ring-free dev accounts/sandbox — Lawrence recalls reading it's possible
- [ ] Tracy: open Oura app on waking (sync!) + 9:30 sign-in = dress rehearsal
- [ ] Nadia: casual login check + has phone at lunch (don't spoil surprise)
- [x] Vercel 2FA enabled · [x] /story live · [x] token-lock verified · [x] effort doc written

## Tomorrow = 06_DEMO_DAY_RUNBOOK.md (timeline, all prompts pre-written, fallbacks, cleanup list)
