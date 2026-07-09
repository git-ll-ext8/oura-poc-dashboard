# From Mockup to Working Product: What Was Actually Built
**CentreCourt Team Wellness Dashboard — POC delivery summary**
**Lawrence Liao · built overnight, July 8–9, 2026**

---

## The short version

Danny's HTML mockup was a **picture of a dashboard**. What exists today is a **working software product**: a live web application on the internet, connected to a real database, pulling real Oura Ring data through Oura's official API, with per-person privacy controls and verified security. A picture became a machine.

An analogy: the mockup was an architect's sketch of a house. What was delivered is the built house — plumbing, wiring, locks on the doors, and an occupant already living in it.

## What the live product does that the mockup could not

| The mockup (a static picture) | The product (live at oura-poc-dashboard.vercel.app) |
|---|---|
| Numbers were typed in by hand and never change | Scores come from a database and update live on screen, without refreshing |
| One fixed screen | A real application: leaderboard, trends, member views |
| No connection to anything | Connected to Oura's official health-data platform (the same API used by commercial apps) |
| No concept of privacy | Each person signs in themselves and chooses exactly which stats to share — nothing is shared without consent |
| Can't be shown outside one laptop | Live on the internet, viewable on any device, updated automatically within ~2 minutes of any change |

## What had to be built to get there (in plain terms)

1. **A real application** (~1,500+ lines of code across dozens of files) that recreates the mockup's design exactly, but as living software.
2. **A database** that stores each member's daily scores and personal sharing choices.
3. **A security system** — health data is sensitive, so it was treated like it:
   - Sign-in keys are stored in a "locked drawer" that web browsers physically cannot read.
   - This wasn't assumed — it was **tested**: a fake key was planted, an attempt was made to steal it the way an attacker would, and the attempt came back empty. Verified, then the test was removed.
   - Each member controls, stat by stat, what appears on the shared leaderboard. Default is private.
4. **A connection to Oura's official API** — the same authorization system used when you "Sign in with Google": each ring owner grants access themselves; nobody's password is ever seen or stored.
5. **A professional delivery pipeline** — the kind real software teams use:
   - Every change is version-controlled (full history, nothing can be silently lost)
   - Every update deploys to the live site automatically within ~2 minutes
   - Any bad change can be rolled back to a previous version in one click
6. **Accounts, credentials, and infrastructure** across four platforms (GitHub, Vercel, InstantDB, Oura) — wired together with scoped, least-privilege access and two-factor authentication.

## How it was built — the honest version

The heavy code-writing was done by an AI developer (Claude), working under a detailed written specification. That's the point of the POC: **this is how modern software gets built in 2026**, and CentreCourt now has firsthand experience with it.

The human work — the part that could not be delegated — was: defining the requirements and privacy rules, architecting the phased plan, provisioning and securing every account and credential, making the judgment calls (what to build, what to skip, when to stop), reviewing and approving every consequential action, deploying to production, and verifying the result end-to-end. Roughly six hours of hands-on work, most of it done for the first time.

A fair summary: **the AI was the construction crew; Lawrence was the architect, foreman, and building inspector.** Neither delivers a house alone.

## Why this matters beyond the demo

- **Speed:** concept → secured, live product in one working day, at effectively zero infrastructure cost (all free tiers).
- **The privacy model is proven**, which is the hard part of any employee-wellness idea. Opt-in, per-stat, verified — ready to show HR with a straight face.
- **The foundation is reusable:** the same backend will power the future mobile app (iOS/Android) with most of the work already done.
- **The thesis experiment can now actually run:** with the full team wearing rings, the before/after data collection described in the project thesis becomes possible.

*Live site: https://oura-poc-dashboard.vercel.app · Full code history: github.com/git-ll-ext8/oura-poc-dashboard*
