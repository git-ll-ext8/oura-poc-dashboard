"use client";

import { usePathname, useRouter } from "next/navigation";
import { db } from "@/lib/instant";
import { buildLiveMembers } from "@/lib/live";

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
  const pathname = usePathname();
  const router = useRouter();
  const onDashboard = pathname === "/";
  const { data } = db.useQuery({ members: {}, dailyScores: {} });
  const ranked = data
    ? [...buildLiveMembers(data.members, data.dailyScores)].sort((a, b) => b.readiness - a.readiness)
    : [];

  function handleNavClick(view: NavView) {
    if (onDashboard) {
      onNavigate(view);
    } else {
      router.push("/");
    }
  }

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
            className={`nav-item${onDashboard && active === item.id ? " active" : ""}`}
            onClick={() => handleNavClick(item.id)}
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
                {m.shortId}
              </div>
              {m.name}
            </div>
          ))}
        </div>
      </div>

      <div className="nav-section" style={{ marginTop: "auto", paddingBottom: 4 }}>
        <div
          className={`nav-item nav-item-subtle${pathname === "/story" ? " active" : ""}`}
          onClick={() => router.push("/story")}
        >
          <span className="icon">📖</span> The Story
        </div>
      </div>

      <div className="sidebar-footer">
        <span className="sync-dot" />
        Synced today · 8:14 AM
      </div>
    </nav>
  );
}
