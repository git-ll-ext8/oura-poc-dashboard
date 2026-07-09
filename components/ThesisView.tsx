import { SlideDeck } from "./SlideDeck";

export function ThesisView() {
  const slides = [
    <>
      <div className="slide-eyebrow">The Thesis</div>
      <div className="slide-title">Healthy employees are higher-functioning employees.</div>
      <div className="slide-sub">Let&apos;s prove it — with data.</div>
    </>,

    <>
      <div className="slide-eyebrow">What the POC Proves</div>
      <div className="slide-title small">It works, end to end</div>
      <div className="slide-list">
        <div className="slide-list-item">
          <strong>Live pipeline</strong> — ring → Oura → dashboard, no manual steps.
        </div>
        <div className="slide-list-item">
          <strong>Opt-in privacy</strong> — per-metric, default off, tested not assumed.
        </div>
        <div className="slide-list-item">
          <strong>Built in 2 days, $0 infrastructure</strong> — the hard part is already done.
        </div>
      </div>
    </>,

    <>
      <div className="slide-eyebrow">The Experiment</div>
      <div className="slide-title small">A 17-week pilot</div>
      <div className="slide-timeline">
        <div className="slide-timeline-seg">
          <div className="slide-timeline-weeks">WEEKS 1–4</div>
          <div className="slide-timeline-desc">
            Baseline. Rings on, leaderboard hidden, weekly 1-minute pulse survey.
          </div>
        </div>
        <div className="slide-timeline-seg active">
          <div className="slide-timeline-weeks">WEEKS 5–16</div>
          <div className="slide-timeline-desc">Leaderboard live + team challenges.</div>
        </div>
        <div className="slide-timeline-seg">
          <div className="slide-timeline-weeks">WEEK 17</div>
          <div className="slide-timeline-desc">Before/after report to management.</div>
        </div>
      </div>
    </>,

    <>
      <div className="slide-eyebrow">Honest Limits</div>
      <div className="slide-title small">This is a pilot, not a paper</div>
      <div className="slide-list">
        <div className="slide-list-item">
          <strong>n = 5</strong> — a feasibility pilot, not a statistical study.
        </div>
        <div className="slide-list-item">
          <strong>Self-comparison, not causation</strong> — each person is their own baseline.
        </div>
        <div className="slide-list-item">
          That&apos;s the reason to <strong>expand the pilot</strong> — not a reason to skip it.
        </div>
      </div>
    </>,

    <>
      <div className="slide-eyebrow">The Ask</div>
      <div className="slide-title small">Rings + memberships for the full Ops team</div>
      <div className="slide-sub">A ~16-week pilot. Results reported to senior management.</div>
    </>,
  ];

  return <SlideDeck slides={slides} />;
}
