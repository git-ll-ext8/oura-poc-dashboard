# CLAUDE.md — Oura Team Wellness Dashboard POC

## Mission
Ship a live, deployed web dashboard by **Thursday 2026-07-09 12:00 PM ET**. It is now Wednesday evening. Lawrence (non-developer, IT Manager) demos it on a boardroom screen to win a bet. Speed with working checkpoints beats perfection.

## Working folder
`C:\AI.Dev\Misc\Oura.Ring.App\510.Claude.Code` — the Next.js app is created inside this folder.

## Design mockup
Danny's dashboard mockup is the HTML file inside `HTML.Dashboard.Mockup\` (whatever its filename is). Open it, study it, pixel-match its layout, colors, and vibe. It is the visual ground truth.

## Token conservation (tell Lawrence at each step)
- At session start, run `/model` and select **Sonnet** for Phases 0/A/B (scaffolding — Sonnet is plenty). Remind Lawrence you did this.
- Only suggest switching to a larger model if stuck on the same bug after 3 attempts; tell Lawrence explicitly: "switching to a bigger model, this burns more credits — OK?"
- If Lawrence's credits run out mid-build: commit + push everything, update 04_SESSION_LOG.md with exact state and next step, tell him to switch to the Codex bundle in `..\520.Codex`. The GitHub repo is the handoff.

## Dual-agent handoff protocol (CRITICAL)
A Codex fallback bundle exists at `..\520.Codex`. Both agents share ONE GitHub repo, ONE Vercel project, ONE InstantDB app.
- After EVERY milestone (phase complete, deploy succeeded, bug fixed): `git add -A && git commit && git push`, and update `04_SESSION_LOG.md` (inside the repo) with what shipped + deploy URL + exact next step.
- Copy all the MD docs from this folder INTO the repo on first commit, so project state travels with git.
- On startup: if a repo/app already exists in this folder or on GitHub, RESUME from 04_SESSION_LOG.md — never start over.

## Read these first, in order
1. `02_IMPLEMENTATION_PLAN.md` — the build spec. Follow its phases EXACTLY (0 → A → B → C-stretch → D). Each phase must end deployed and working before the next starts.
2. `03_TECH_STACK.md` — Next.js 15 + TypeScript + Tailwind + Recharts + InstantDB on Vercel.
3. `01_THESIS_Healthy_Workers.md` — context only.

## Hard rules
- **NEVER uninstall, delete, or modify software/files that already exist on this machine.** Install-if-missing only.
- **Oura tokens are radioactive:** the `ouraTokens` InstantDB entity must be client-locked in `instant.perms.ts` (view/create/update/delete = "false") BEFORE any real token is stored. Admin SDK (server-only) is the sole accessor. `INSTANT_ADMIN_TOKEN` and `OURA_CLIENT_SECRET` live only in Vercel env vars / `.env.local` (gitignored) — never in client code, never committed.
- Verify against live docs when uncertain: https://cloud.ouraring.com/v2/docs and https://www.instantdb.com/docs — do not rely on training memory for API shapes.
- All scripts you write must log verbosely to stdout so errors can be copy-pasted for analysis.
- Ask Lawrence before: creating accounts, deploying, or anything involving credentials. Do everything else autonomously.
- Design: if `/design/mockup.html` exists, pixel-match it. If not, build the polished dark-mode leaderboard described in Phase A — do not ask, do not wait.
- Scope discipline: anything in §5 "Out of Scope" of the implementation plan gets a "no" — including good ideas.

## Definition of done (minimum win)
Live Vercel URL showing a dark-mode leaderboard of 5 team members with readiness/sleep/activity scores and sparklines, data served from InstantDB (sandbox-sourced). Everything beyond that is bonus.

## End of every session
Update `04_SESSION_LOG.md` with: what shipped, current deploy URL, exact next step.

## Standing rules (added 2026-07-20 — apply to every session from now on)

1. **Communication rule.** Lawrence is a beginner, not a developer, and short on time. Every explanation, plan, or update to him must be plain language, max ~10 lines, no code snippets or file paths unless he asks. Structure: what you're doing (1 line) → what he needs to do (numbered, if anything) → what happens next (1 line). Technical detail goes in `STATUS.md`, not in chat. When a decision is needed, offer at most 2-3 options with one-line trade-offs.
2. **UI guidance rule.** Whenever Lawrence needs to click through any web UI (Vercel, GitHub, InstantDB, Oura), verify the current UI against live documentation first (fetch the docs — never rely on memory), then give exact click-by-click steps: where the button is, what the screen should look like, what to type. Assume he's never seen the screen before.
3. **Supervision rule.** After every completed milestone, update `STATUS.md` in plain language and commit + push to GitHub immediately — it's Lawrence's external supervision channel.
