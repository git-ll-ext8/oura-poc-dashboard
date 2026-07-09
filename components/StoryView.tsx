import { SlideDeck } from "./SlideDeck";

const CONTRASTS: [string, string][] = [
  ["Numbers typed by hand", "Live database, updates with no refresh"],
  ["One fixed screen", "Real app: leaderboard, trends, member views"],
  ["No connection to anything", "Connected to Oura's official API"],
  ["No privacy concept", "Opt-in, per-metric, default OFF"],
  ["One laptop only", "Live on the internet, any device"],
];

export function StoryView() {
  const slides = [
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
            {CONTRASTS.map(([mockup]) => (
              <li key={mockup}>{mockup}</li>
            ))}
          </ul>
        </div>
        <div className="slide-compare-card product">
          <div className="slide-compare-heading">The Product</div>
          <ul className="slide-compare-list">
            {CONTRASTS.map(([, product]) => (
              <li key={product}>{product}</li>
            ))}
          </ul>
        </div>
      </div>
    </>,

    <>
      <div className="slide-eyebrow">By the Numbers</div>
      <div className="slide-title">What it took</div>
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
          <div className="slide-stat-label">Platforms Wired</div>
        </div>
        <div className="slide-stat">
          <div className="slide-stat-num">$0</div>
          <div className="slide-stat-label">Infrastructure Cost</div>
        </div>
      </div>
    </>,

    <>
      <div className="slide-shield">🛡️</div>
      <div className="slide-title small">Privacy, verified</div>
      <div className="slide-list">
        <div className="slide-list-item">
          <strong>Sign-in via Oura&apos;s own login</strong> — we never see passwords.
        </div>
        <div className="slide-list-item">
          <strong>Per-metric opt-in</strong> — default OFF. Nothing shows until they turn it on.
        </div>
        <div className="slide-list-item">
          <strong>Token vault</strong> — tested, not assumed. We planted a fake key and tried to steal it. Came back
          empty.
        </div>
      </div>
    </>,

    <div className="slide-quote-big" key="quote">
      &ldquo;The AI was the construction crew; Lawrence was the architect, foreman, and building inspector.&rdquo;
    </div>,

    <>
      <div className="slide-title">This is how software gets built in 2026.</div>
      <div className="slide-sub">oura-poc-dashboard.vercel.app</div>
    </>,
  ];

  return <SlideDeck slides={slides} />;
}
