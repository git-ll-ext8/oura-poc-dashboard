"use client";

import { ranked } from "@/lib/data";

export type NavView = "leaderboard" | "quarterly" | "trends" | "badges";

const NAV_ITEMS: { id: NavView; icon: string; label: string }[] = [
  { id: "leaderboard", icon: "🏆", label: "Leaderboard" },
  { id: "quarterly", icon: "📈", label: "Quarterly Growth" },
  { id: "trends", icon: "📊", label: "Weekly Trends" },
  { id: "badges", icon: "🎖️", label: "Achievements" },
];

export function Sidebar({
  active,
  onNavigate,
}: {
  active: NavView;
  onNavigate: (view: NavView) => void;
}) {
  return (
    <nav className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-wordmark">
          CENTRE<span>COURT</span>
        </div>
        <div className="logo-sub">Team Wellness</div>
      </div>

      <div className="nav-section">
        <div className="nav-label">Views</div>
        {NAV_ITEMS.map((item) => (
          <div
            key={item.id}
            className={`nav-item${active === item.id ? " active" : ""}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="icon">{item.icon}</span> {item.label}
          </div>
        ))}
      </div>

      <div className="sidebar-team nav-section" style={{ marginTop: 12 }}>
        <div className="nav-label">Team</div>
        <div>
          {ranked.map((m) => (
            <div className="team-member-nav" key={m.id}>
              <div className="tav" style={{ background: `${m.color}28`, color: m.color }}>
                {m.id}
              </div>
              {m.name}
            </div>
          ))}
        </div>
      </div>

      <div className="sidebar-footer">
        <span className="sync-dot" />
        Synced today · 8:14 AM
      </div>
    </nav>
  );
}
