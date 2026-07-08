import { members } from "@/lib/data";

const BADGE_LIBRARY: { icon: string; label: string; earned: boolean }[] = [
  { icon: "🌙", label: "Sleep Streak ×7", earned: true },
  { icon: "🔥", label: "10K Steps ×5", earned: true },
  { icon: "💎", label: "90+ Readiness", earned: true },
  { icon: "🧘", label: "HRV Elite (80ms+)", earned: false },
  { icon: "🌅", label: "Early Riser ×14", earned: false },
  { icon: "⚡", label: "30-Day Streak", earned: false },
  { icon: "🏆", label: "Monthly Champion", earned: false },
  { icon: "📈", label: "Most Improved Q", earned: false },
  { icon: "💪", label: "Activity Leader", earned: false },
  { icon: "🧬", label: "Recovery Master", earned: false },
];

export function AchievementsView() {
  const sorted = [...members].sort((a, b) => b.streak - a.streak);

  return (
    <div className="tab-page active">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">CentreCourt · Milestones</div>
          <div className="page-title">Achievements</div>
          <div className="page-date">Earned badges · Active streaks · Personal records</div>
        </div>
      </div>

      <div className="chart-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Member</th>
              <th>Active Streak</th>
              <th>Badges</th>
              <th>Personal Records</th>
              <th>Top Achievement</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((m) => (
              <tr key={m.id}>
                <td>
                  <span style={{ color: m.color }}>{m.name}</span>
                </td>
                <td>
                  <span className="pill pill-green">{m.streak} days 🔥</span>
                </td>
                <td>{m.badges} earned</td>
                <td>{m.prs} PRs</td>
                <td>
                  <span className="pill pill-gold">{m.topBadge}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="section-eyebrow">Available</div>
      <div className="section-title">Badge Library</div>
      <div className="badges-row">
        {BADGE_LIBRARY.map((b) => (
          <div className={`badge${b.earned ? " earned" : ""}`} key={b.label}>
            <span className="b-icon">{b.icon}</span>
            {b.label}
          </div>
        ))}
      </div>
    </div>
  );
}
