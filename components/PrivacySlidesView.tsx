import { SlideDeck } from "./SlideDeck";

export function PrivacySlidesView() {
  const slides = [
    <>
      <div className="slide-eyebrow">Before You Sign In</div>
      <div className="slide-title small">
        We can only see your scores — never your raw health data.
      </div>
      <div className="slide-compare">
        <div className="slide-compare-card product">
          <div className="slide-compare-heading">✓ We Can See</div>
          <ul className="slide-compare-list">
            <li>Daily Sleep, Readiness &amp; Activity scores (0–100)</li>
            <li>Step count</li>
            <li>Your email, to match your card</li>
          </ul>
        </div>
        <div className="slide-compare-card">
          <div className="slide-compare-heading" style={{ color: "var(--coral)" }}>
            ✕ We Cannot
          </div>
          <ul className="slide-compare-list">
            <li>✕ Heart rate, HRV, SpO2</li>
            <li>✕ Location, workouts</li>
            <li>✕ Sleep-stage detail</li>
          </ul>
        </div>
      </div>
    </>,

    <>
      <div className="slide-eyebrow">Your Choice</div>
      <div className="slide-title small">
        You choose, metric by metric.
        <br />
        Everything starts OFF.
      </div>
      <div className="slide-sub">Nothing appears on the shared leaderboard until you personally turn it on.</div>
    </>,

    <>
      <div className="slide-eyebrow">No Lock-In</div>
      <div className="slide-title small">You can leave at any time.</div>
      <div className="privacy-leave-options">
        <div className="privacy-leave-option">
          <div className="privacy-leave-icon">↩︎</div>
          <div className="privacy-leave-label">Toggle off</div>
          <div className="privacy-leave-desc">Gone from the leaderboard immediately</div>
        </div>
        <div className="privacy-leave-option">
          <div className="privacy-leave-icon">⛔</div>
          <div className="privacy-leave-label">Revoke in Oura</div>
          <div className="privacy-leave-desc">Access dies instantly, card returns to DEMO DATA</div>
        </div>
        <div className="privacy-leave-option">
          <div className="privacy-leave-icon">🗑️</div>
          <div className="privacy-leave-label">Delete on request</div>
          <div className="privacy-leave-desc">All stored rows removed</div>
        </div>
      </div>
    </>,

    <>
      <div className="slide-shield">🛡️</div>
      <div className="slide-title small">Verified, not promised.</div>
      <div className="slide-list">
        <div className="slide-list-item">
          <strong>Locked vault, tested</strong> — a fake key was planted and an attempt made to steal it. Came
          back empty.
        </div>
        <div className="slide-list-item">
          <strong>Minimal permissions requested</strong> — the app physically cannot read what it never asked for.
        </div>
        <div className="slide-list-item">
          <strong>Opt-in by design</strong> — default OFF, every metric, every person.
        </div>
      </div>
    </>,
  ];

  return <SlideDeck slides={slides} />;
}
