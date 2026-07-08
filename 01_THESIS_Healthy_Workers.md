# THESIS: Healthy Employees Are Higher-Functioning Employees
**Project:** CentreCourt Ops Wellness POC (Oura Ring)
**Owner:** Lawrence Liao (IT Manager) | **Sponsor:** Danny Chan (VP Ops)
**Date:** 2026-07-06 | **POC demo deadline:** Thu 2026-07-09 12:00 PM

---

## 1. Thesis Statement
> Employees with better recovery, sleep, and stress-resilience metrics perform at a measurably higher level. By making these metrics visible (opt-in) and gamified within a team, employees improve their health behaviors — and productivity follows.

Two claims to prove, in order:
1. **Engagement claim (easy, POC phase):** A shared, opt-in wellness leaderboard drives measurable behavior change (better sleep consistency, more activity, higher readiness scores).
2. **Productivity claim (hard, pilot phase):** Improved Oura metrics correlate with improved work performance.

## 2. Why "Before/After" Is the Design
Correlation needs two data streams over the same period:

| Stream | Source | Frequency |
|---|---|---|
| Health metrics | Oura API (readiness, sleep, activity scores) | Daily, automatic |
| Productivity metrics | Survey + workplace proxies | Weekly |

**Baseline ("before"):** 2–4 weeks of both streams collected BEFORE the leaderboard/gamification goes live to participants.
**Intervention ("after"):** 8–12 weeks with the leaderboard visible and weekly challenges active.
**Comparison:** per-person change vs. their own baseline (n=5 is too small for group statistics — self-comparison is the honest framing).

## 3. Productivity Measures (proposed — to be finalized with Danny)
Ranked by feasibility at CentreCourt:

1. **Weekly 1-minute pulse survey** (primary measure — start immediately, even before the app exists):
   - Energy level this week (1–10)
   - Ability to focus (1–10)
   - Output vs. a typical week (1–10)
   - Days you felt "off" or below par (0–5)
   - Free text: biggest blocker this week (optional)
   - Delivery: MS Forms → auto-collect via M365 (Lawrence already admin). One form, recurring Friday reminder via Power Automate.
2. **Absence/sick-day tracking** — HR data Nadia can pull; objective but slow-moving.
3. **Manager assessment** — Danny rates each direct report monthly on a simple 1–10 scale (bias-prone; use as secondary).
4. **Calendar/meeting load** (optional, Graph API) — objective activity proxy, not output.

## 4. Honest Limitations (put these ON the slide — credibility wins)
- n=5, no control group → this is a **feasibility POC**, not a study.
- Self-reported productivity is subjective; Hawthorne effect is expected (and is actually fine — behavior change is the goal).
- Correlation ≠ causation. Frame as: "directionally supportive evidence to justify a larger pilot (20–30 people, 6 months)."

## 5. Privacy & Consent Guardrails (non-negotiable)
- **Opt-in per metric.** Oura's OAuth consent lets each user grant/deny each data scope. The app adds a second layer: a "share on leaderboard" toggle per metric.
- **Leaderboard shows scores only** (0–100 composite scores) — never raw physiological data (no HRV, RHR, temperature, SpO2 on shared views). Raw data visible only to the individual on their own private view.
- **Laura Cortez is external** (not a CentreCourt employee). She participates as a friendly tester only; her data must not appear in any management reporting.
- Written consent note for employee participants (Nadia/HR to review) — participation is voluntary, non-participation has zero job consequences, data can be revoked anytime (OAuth token revocation).
- No health data stored longer than the POC requires; deletion on request.

## 6. Success Criteria for the POC Demo (Thu Jul 9, 12p)
- [ ] Live HTTPS URL loads the dashboard on the boardroom screen
- [ ] 5 Ops team members visible on leaderboard (sandbox data)
- [ ] Tracy signed in via real Oura OAuth, her real scores displayed
- [ ] Metric-sharing consent toggle demonstrated
- [ ] Thesis slide: baseline plan + pilot proposal
- **Bet payout:** Danny buys Oura Ring 5 + 1-yr subscription for Lawrence, Kat, and himself → full 5-person Ops team pilot becomes possible.

## 7. Pilot Roadmap (post-POC pitch to management)
1. **Weeks 1–2:** Rings arrive; pulse-survey baseline already running (started this week).
2. **Weeks 3–4:** All 5 wear rings, app collects data, leaderboard HIDDEN (health baseline).
3. **Weeks 5–16:** Leaderboard live + weekly team challenges (sleep consistency week, 8k-steps week, etc.).
4. **Week 17:** Before/after report → present expansion case to senior management.
