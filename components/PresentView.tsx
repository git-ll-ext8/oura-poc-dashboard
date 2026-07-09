import Link from "next/link";
import { PresentDeck } from "./PresentDeck";

export function PresentView() {
  const slides = [
    <>
      <div className="slide-eyebrow">CentreCourt · Team Wellness</div>
      <div className="slide-title">From mockup to product in 2 days.</div>
    </>,

    <>
      <div className="slide-eyebrow">The Shift</div>
      <div className="slide-title small">
        Monday: a picture.
        <br />
        Today: a product.
      </div>
      <div className="slide-compare">
        <div className="slide-compare-card">
          <div className="slide-compare-heading">The Mockup</div>
          <ul className="slide-compare-list">
            <li>Numbers typed by hand</li>
            <li>One fixed screen</li>
            <li>No privacy concept</li>
          </ul>
        </div>
        <div className="slide-compare-card product">
          <div className="slide-compare-heading">The Product</div>
          <ul className="slide-compare-list">
            <li>Live database, updates instantly</li>
            <li>Real app, live on the internet</li>
            <li>Opt-in privacy, default OFF</li>
          </ul>
        </div>
      </div>
    </>,

    <>
      <div className="slide-eyebrow">By the Numbers</div>
      <div className="slide-stats">
        <div className="slide-stat">
          <div className="slide-stat-num">1</div>
          <div className="slide-stat-label">Evening</div>
        </div>
        <div className="slide-stat">
          <div className="slide-stat-num">1,500+</div>
          <div className="slide-stat-label">Lines of Code</div>
        </div>
        <div className="slide-stat">
          <div className="slide-stat-num">4</div>
          <div className="slide-stat-label">Platforms</div>
        </div>
        <div className="slide-stat">
          <div className="slide-stat-num">$0</div>
          <div className="slide-stat-label">Infrastructure</div>
        </div>
      </div>
    </>,

    <div className="slide-quote-big" key="quote">
      &ldquo;The AI was the construction crew; Lawrence was the architect, foreman, and building inspector.&rdquo;
    </div>,

    <>
      <div className="slide-eyebrow">Privacy</div>
      <div className="slide-title small">We can only see your scores — never your raw health data.</div>
      <div className="slide-compare">
        <div className="slide-compare-card product">
          <div className="slide-compare-heading">✓ We Can See</div>
          <ul className="slide-compare-list">
            <li>Sleep, Readiness, Activity (0–100)</li>
            <li>Step count</li>
          </ul>
        </div>
        <div className="slide-compare-card">
          <div className="slide-compare-heading" style={{ color: "var(--coral)" }}>
            ✕ We Cannot
          </div>
          <ul className="slide-compare-list">
            <li>✕ Heart rate, HRV, SpO2</li>
            <li>✕ Location, sleep detail</li>
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
      <div className="slide-sub">Nothing appears on the leaderboard until you personally turn it on.</div>
    </>,

    <>
      <div className="slide-eyebrow">No Lock-In</div>
      <div className="slide-title small">You can leave at any time.</div>
      <div className="privacy-leave-options">
        <div className="privacy-leave-option">
          <div className="privacy-leave-icon">↩︎</div>
          <div className="privacy-leave-label">Toggle off</div>
        </div>
        <div className="privacy-leave-option">
          <div className="privacy-leave-icon">⛔</div>
          <div className="privacy-leave-label">Revoke in Oura</div>
        </div>
        <div className="privacy-leave-option">
          <div className="privacy-leave-icon">🗑️</div>
          <div className="privacy-leave-label">Delete on request</div>
        </div>
      </div>
    </>,

    <>
      <div className="slide-eyebrow">The Thesis</div>
      <div className="slide-title small">Healthy teams perform better.</div>
      <div className="slide-timeline">
        <div className="slide-timeline-seg">
          <div className="slide-timeline-weeks">4 WEEKS</div>
          <div className="slide-timeline-desc">Baseline</div>
        </div>
        <div className="slide-timeline-seg active">
          <div className="slide-timeline-weeks">12 WEEKS</div>
          <div className="slide-timeline-desc">Challenge</div>
        </div>
        <div className="slide-timeline-seg">
          <div className="slide-timeline-weeks">THEN</div>
          <div className="slide-timeline-desc">Before/after report</div>
        </div>
      </div>
    </>,

    <>
      <div className="slide-eyebrow">The Ask</div>
      <div className="slide-title small">Rings + memberships for the full Ops team.</div>
    </>,

    <>
      <div className="slide-title">Now: the POC Demo</div>
      <div className="slide-sub">
        POC = Proof of Concept — not a mockup, the real working product, live on the internet right now.
      </div>
      <Link href="/" className="present-cta-btn">
        Open the Live Dashboard →
      </Link>
    </>,
  ];

  return <PresentDeck slides={slides} />;
}
