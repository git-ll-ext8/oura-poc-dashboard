const COMPARISON_ROWS: [string, string][] = [
  [
    "Numbers were typed in by hand and never change",
    "Scores come from a database and update live on screen, without refreshing",
  ],
  ["One fixed screen", "A real application: leaderboard, trends, member views"],
  [
    "No connection to anything",
    "Connected to Oura's official health-data platform (the same API used by commercial apps)",
  ],
  [
    "No concept of privacy",
    "Each person signs in themselves and chooses exactly which stats to share — nothing is shared without consent",
  ],
  [
    "Can't be shown outside one laptop",
    "Live on the internet, viewable on any device, updated automatically within ~2 minutes of any change",
  ],
];

const BUILD_ITEMS: { title: string; body: string; sub?: string[] }[] = [
  {
    title: "A real application",
    body: "(~1,500+ lines of code across dozens of files) that recreates the mockup's design exactly, but as living software.",
  },
  {
    title: "A database",
    body: "that stores each member's daily scores and personal sharing choices.",
  },
  {
    title: "A security system",
    body: "— health data is sensitive, so it was treated like it:",
    sub: [
      'Sign-in keys are stored in a "locked drawer" that web browsers physically cannot read.',
      "This wasn't assumed — it was <strong>tested</strong>: a fake key was planted, an attempt was made to steal it the way an attacker would, and the attempt came back empty. Verified, then the test was removed.",
      "Each member controls, stat by stat, what appears on the shared leaderboard. Default is private.",
    ],
  },
  {
    title: "A connection to Oura's official API",
    body: '— the same authorization system used when you "Sign in with Google": each ring owner grants access themselves; nobody\'s password is ever seen or stored.',
  },
  {
    title: "A professional delivery pipeline",
    body: "— the kind real software teams use:",
    sub: [
      "Every change is version-controlled (full history, nothing can be silently lost)",
      "Every update deploys to the live site automatically within ~2 minutes",
      "Any bad change can be rolled back to a previous version in one click",
    ],
  },
  {
    title: "Accounts, credentials, and infrastructure",
    body: "across four platforms (GitHub, Vercel, InstantDB, Oura) — wired together with scoped, least-privilege access and two-factor authentication.",
  },
];

const WHY_ITEMS = [
  {
    lead: "Speed:",
    body: "concept → secured, live product in one working day, at effectively zero infrastructure cost (all free tiers).",
  },
  {
    lead: "The privacy model is proven,",
    body: "which is the hard part of any employee-wellness idea. Opt-in, per-stat, verified — ready to show HR with a straight face.",
  },
  {
    lead: "The foundation is reusable:",
    body: "the same backend will power the future mobile app (iOS/Android) with most of the work already done.",
  },
  {
    lead: "The thesis experiment can now actually run:",
    body: "with the full team wearing rings, the before/after data collection described in the project thesis becomes possible.",
  },
];

function renderInline(text: string) {
  const parts = text.split(/(<strong>.*?<\/strong>)/g);
  return parts.map((part, i) => {
    const match = part.match(/^<strong>(.*?)<\/strong>$/);
    if (match) {
      return <strong key={i}>{match[1]}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

export function StoryView() {
  return (
    <div className="tab-page active">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">CentreCourt · Product Story</div>
          <div className="page-title">From Mockup to Working Product</div>
          <div className="story-byline">
            What was actually built · Lawrence Liao · built overnight, July 8–9, 2026
          </div>
        </div>
      </div>

      <div className="chart-card">
        <div className="section-eyebrow">The Short Version</div>
        <p className="story-lede">
          Danny&apos;s HTML mockup was a <strong>picture of a dashboard</strong>. What exists today is a{" "}
          <strong>working software product</strong>: a live web application on the internet, connected to a real
          database, pulling real Oura Ring data through Oura&apos;s official API, with per-person privacy controls
          and verified security. A picture became a machine.
        </p>
        <div className="story-analogy">
          An analogy: the mockup was an architect&apos;s sketch of a house. What was delivered is the built house —
          plumbing, wiring, locks on the doors, and an occupant already living in it.
        </div>
      </div>

      <div className="section-eyebrow">Comparison</div>
      <div className="section-title">What the Live Product Does That the Mockup Could Not</div>
      <div className="chart-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>The mockup (a static picture)</th>
              <th>The product (live at oura-poc-dashboard.vercel.app)</th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON_ROWS.map(([mockup, product], i) => (
              <tr key={i}>
                <td style={{ color: "var(--text-muted)", fontWeight: 400 }}>{mockup}</td>
                <td>{product}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="section-eyebrow">Under the Hood</div>
      <div className="section-title">What Had to Be Built to Get There (in Plain Terms)</div>
      <div className="story-build-list">
        {BUILD_ITEMS.map((item, i) => (
          <div className="story-build-item" key={item.title}>
            <div className="story-build-number">{i + 1}</div>
            <div className="story-build-body">
              <p>
                <strong>{item.title}</strong> {renderInline(item.body)}
              </p>
              {item.sub && (
                <ul className="story-build-sublist">
                  {item.sub.map((line, j) => (
                    <li key={j}>{renderInline(line)}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="section-eyebrow">The Honest Version</div>
      <div className="section-title">How It Was Built</div>
      <div className="chart-card">
        <p className="story-lede">
          The heavy code-writing was done by an AI developer (Claude), working under a detailed written
          specification. That&apos;s the point of the POC: <strong>this is how modern software gets built in
          2026</strong>, and CentreCourt now has firsthand experience with it.
        </p>
        <p className="story-lede">
          The human work — the part that could not be delegated — was: defining the requirements and privacy rules,
          architecting the phased plan, provisioning and securing every account and credential, making the judgment
          calls (what to build, what to skip, when to stop), reviewing and approving every consequential action,
          deploying to production, and verifying the result end-to-end. Roughly six hours of hands-on work, most of
          it done for the first time.
        </p>
      </div>

      <div className="story-quote-banner">
        <p>
          A fair summary: <strong>the AI was the construction crew; Lawrence was the architect, foreman, and
          building inspector.</strong> Neither delivers a house alone.
        </p>
      </div>

      <div className="section-eyebrow">The Bigger Picture</div>
      <div className="section-title">Why This Matters Beyond the Demo</div>
      <div className="chart-card">
        <div className="story-why-list">
          {WHY_ITEMS.map((item) => (
            <div className="story-why-item" key={item.lead}>
              <strong>{item.lead}</strong> {item.body}
            </div>
          ))}
        </div>
      </div>

      <div className="story-footer">
        <a href="https://oura-poc-dashboard.vercel.app" target="_blank" rel="noopener noreferrer">
          Live site: oura-poc-dashboard.vercel.app
        </a>
        <a href="https://github.com/git-ll-ext8/oura-poc-dashboard" target="_blank" rel="noopener noreferrer">
          Full code history: github.com/git-ll-ext8/oura-poc-dashboard
        </a>
      </div>
    </div>
  );
}
