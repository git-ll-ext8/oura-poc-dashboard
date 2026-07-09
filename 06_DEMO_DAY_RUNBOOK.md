# DEMO DAY RUNBOOK — Thursday July 9, 2026
**Demo: 12:00 PM at restaurant lunch · Laptop on phone hotspot · Live URL: https://oura-poc-dashboard.vercel.app/**
**State going in: Phases A+B live in production. /story page live. Phase C (real OAuth) is today's build — and per Danny's bar, THE win condition.**

---

## ~7:00 AM — Claude (Home tab) research task
Ground-truth pass on Oura developer docs: (a) confirm dev account creation without a ring, (b) exact signup path, (c) whether app registration differs from sandbox access. (Only needed if Lawrence's browser signup failed Wednesday night.)

## 7:30 AM — Deliver credentials, start Phase C
Prerequisite: Oura app registered (by Lawrence or Tracy-fallback below). Redirect URIs registered:
- `https://oura-poc-dashboard.vercel.app/api/auth/oura/callback`
- `http://localhost:3000/api/auth/oura/callback`

**PASTE INTO CODE:**
---
Phase C go. Oura credentials — Client ID: [PASTE], Client Secret: [PASTE]. Secret goes in .env.local and I'll add it to Vercel env vars when you tell me (tell me the exact key names). Build the OAuth flow per the implementation plan: authorization-code flow, tokens via Admin SDK into the client-locked ouraTokens entity, per-metric consent screen (all toggles DEFAULT OFF, user flips them personally). ACCEPTANCE CRITERION — design everything around this: a new user completes consent on a laptop and within ~30 seconds their real scores appear on the leaderboard on an ALREADY-OPEN screen with NO refresh, replacing their sandbox row, with a LIVE badge. Test the full round-trip on localhost yourself first, then push. Work autonomously; stop only for credentials, my browser clicks, or hard blocks. Hard deadline: working in production by 10:30 AM; if we're slipping at 10:00, tell me immediately so we fall back cleanly.
---

## 8:00 AM — Fallback if Lawrence has no Oura account: Tracy registers (4 min)
Text her: "Quick favor before your sign-in: go to cloud.ouraring.com → log in → find Applications / Developer / API section → New Application → name: CentreCourt Wellness POC → redirect URIs (add both): https://oura-poc-dashboard.vercel.app/api/auth/oura/callback and http://localhost:3000/api/auth/oura/callback → save → send me the Client ID and Client Secret." (App registration only — touches none of her personal data.)

## 8:30 AM — Tracy reminders
- Open Oura app on waking (syncs ring → cloud; no sync = no scores)
- Book her 10-min sign-in slot ~9:30–10:00

## 9:30–10:15 AM — TRACY DRESS REHEARSAL (this is the demo, rehearsed)
1. Open the live URL on Lawrence's laptop, leave it visible
2. Tracy (her phone or the laptop): Sign in with Oura → Oura's official login → consent screen → SHE flips her sharing toggles
3. Watch the open leaderboard: her sandbox row is replaced by real scores + LIVE badge, no refresh, within ~30s
4. Cross-check her numbers vs her Oura app — they should match
5. Any failure → paste the error to Claude (Home tab) immediately
6. Vercel env vars for OAuth get added when Sonnet says so (Settings → Environment Variables, same flow as Wednesday)

## 10:00 AM — Nadia prep (don't spoil the surprise)
- Casual: "IT hygiene check — can you log into cloud.ouraring.com in a browser?" (verifies she remembers credentials)
- Confirm she'll have her phone + Oura app at lunch

## 10:30 AM — HARD FREEZE
- No pushes to master after this. Whatever works at 10:30 is the demo.
- **GO/NO-GO:** Phase C round-trip worked with Tracy → GO for live Nadia sign-in at lunch. Anything flaky → NO-GO: demo Tracy's already-live real data + show the consent screen without completing a new sign-in. (Bet: Tracy's real data flowing = pipeline proven.)

## 10:45 AM — Backups
- Screenshots of every view (leaderboard with Tracy LIVE, /story, consent screen) → laptop folder + phone
- Test laptop on phone hotspot; charge both
- Bookmark bar on laptop: dashboard URL + /story

## 12:00 PM — THE DEMO (restaurant, laptop, hotspot)
1. Laptop open on leaderboard: "Monday Danny made a mockup. This is now a live product on the internet — and Tracy's card is her REAL ring data from last night. Tracy, confirm?"
2. Skeptics welcome: "Let's onboard someone right now. Nadia—" → she signs in on the laptop via Oura's official page (say it: "the app never sees her password") → consent screen → SHE flips her own toggles ("nothing shared without her choosing it — HR-grade privacy, and we verified the locks")
3. Everyone watches the leaderboard re-rank itself. No refresh. Nadia checks the numbers against her Oura app on her phone. Receipts.
4. Laptop → /story page: "what actually got built since the mockup, in plain English" — land on the architect/foreman/inspector line
5. The ask: full-team pilot → "Danny, I believe you owe me and Kat some jewelry." 💍

## Post-demo cleanup list (Friday)
- Revoke GitHub CLI grant if desired (GitHub → Settings → Applications) — or keep for phase 2
- Vercel 2FA: DONE Wednesday ✅
- Recovery codes for Vercel 2FA saved to password manager (verify)
- Decide public repo → private (Settings → General → Danger Zone) once supervision channel no longer needed
- Rotate InstantDB admin token if it was ever pasted anywhere outside Code chat / .env.local
