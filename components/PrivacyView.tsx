import Link from "next/link";

const READABLE = [
  "Daily Sleep, Readiness & Activity scores (0–100)",
  "Daily step count",
  "Email — only to match you to your card",
  <>
    Oura&apos;s &ldquo;personal&rdquo; bundle (age/height/weight/sex) —{" "}
    <strong>this app does not display or use this anywhere</strong>
  </>,
];

const NOT_ACCESSIBLE = ["Heart rate", "HRV", "SpO2", "Body temperature", "Location", "Workouts", "Sleep-stage detail"];

const STOP_ITEMS: { title: string; body: React.ReactNode }[] = [
  {
    title: "Sign in again anytime",
    body: "Toggle any metric off → gone from the leaderboard immediately.",
  },
  {
    title: "Full revoke",
    body: (
      <>
        In your Oura account&apos;s connected/third-party apps, remove <strong>&ldquo;CentreCourt Wellness
        POC.&rdquo;</strong> Access dies on Oura&apos;s side instantly, and your card visibly returns to{" "}
        <strong>DEMO DATA</strong> on the dashboard.
      </>
    ),
  },
  {
    title: "Delete everything",
    body: "Ask, and all stored rows for you are deleted on request.",
  },
];

export function PrivacyView() {
  return (
    <div className="tab-page active">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">CentreCourt · Data &amp; Privacy</div>
          <div className="page-title">Your Data, Your Control</div>
          <div className="page-date">
            Plain-language answers · see also the{" "}
            <Link href="/privacy-slides" style={{ color: "var(--cc-gold)" }}>
              presentation version →
            </Link>
          </div>
        </div>
      </div>

      <div className="section-eyebrow">What This App Can Read</div>
      <div className="section-title">Via Oura&apos;s Own Permission System</div>
      <div className="slide-compare" style={{ margin: "0 0 26px", textAlign: "left" }}>
        <div className="slide-compare-card product">
          <div className="slide-compare-heading">✓ Requested &amp; Readable</div>
          <ul className="slide-compare-list">
            {READABLE.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="slide-compare-card">
          <div className="slide-compare-heading" style={{ color: "var(--coral)" }}>
            ✕ Not Accessible
          </div>
          <ul className="slide-compare-list">
            {NOT_ACCESSIBLE.map((item) => (
              <li key={item}>✕ {item}</li>
            ))}
          </ul>
          <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 14, fontStyle: "italic" }}>
            The app never requested these permissions, so Oura will not provide them.
          </div>
        </div>
      </div>

      <div className="chart-card">
        <div className="section-eyebrow">What Colleagues See</div>
        <p className="story-lede">
          <strong>Nothing, by default.</strong> Only the 0–100 scores you individually toggle ON ever reach the
          shared leaderboard. Never raw data. Never timestamps.
        </p>
      </div>

      <div id="how-to-stop" className="section-eyebrow" style={{ marginTop: 26 }}>
        How To Stop
      </div>
      <div className="section-title">Three Ways Out, Any Time</div>
      <div className="story-build-list">
        {STOP_ITEMS.map((item, i) => (
          <div className="story-build-item" key={item.title}>
            <div className="story-build-number">{i + 1}</div>
            <div className="story-build-body">
              <p>
                <strong>{item.title}</strong> {typeof item.body === "string" ? item.body : null}
              </p>
              {typeof item.body !== "string" && <p style={{ marginTop: 4 }}>{item.body}</p>}
            </div>
          </div>
        ))}
      </div>

      <div className="chart-card">
        <div className="section-eyebrow">Honest POC Notes</div>
        <div className="story-why-list">
          <div className="story-why-item">
            <strong>Voluntary, opt-in</strong> — nobody is required to connect a ring.
          </div>
          <div className="story-why-item">
            <strong>Data kept only for the POC</strong> — not a permanent production system.
          </div>
          <div className="story-why-item">
            <strong>Protections are architectural</strong> — unrequested permissions cannot be read, not just
            promised not to be used.
          </div>
          <div className="story-why-item">
            <strong>Credential vault is security-tested</strong> — a fake key was planted and an attempt made to
            steal it. Came back empty.
          </div>
        </div>
      </div>
    </div>
  );
}
