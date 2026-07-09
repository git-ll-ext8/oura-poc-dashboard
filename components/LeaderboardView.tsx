"use client";

import { useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { RingArc } from "./RingArc";
import { db } from "@/lib/instant";
import { buildLiveMembers, weekdayLabel, type LiveMember } from "@/lib/live";

const SUB_TABS = ["Today", "This Week", "This Month"];

type CategoryKey = "sleep" | "readiness" | "activity" | "steps";

const CATEGORIES: { id: string; key: CategoryKey; icon: string; label: string; max: number; color: string }[] = [
  { id: "sleep", key: "sleep", icon: "😴", label: "Best Sleep Score", max: 100, color: "#8BADC8" },
  { id: "ready", key: "readiness", icon: "⚡", label: "Best Readiness", max: 100, color: "#C9A84C" },
  { id: "activity", key: "activity", icon: "💓", label: "Best Activity", max: 100, color: "#E06060" },
  { id: "steps", key: "steps", icon: "🏃", label: "Most Steps", max: 15000, color: "#4CAF8A" },
];

function formatVal(key: CategoryKey, value: number) {
  return key === "steps" ? value.toLocaleString() : String(value);
}

export function LeaderboardView() {
  const [subTab, setSubTab] = useState(0);
  const { isLoading, error, data } = db.useQuery({ members: {}, dailyScores: {} });

  if (isLoading) {
    return (
      <div className="tab-page active">
        <div className="page-date">Loading live data from InstantDB...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="tab-page active">
        <div className="page-date">Error loading data: {error.message}</div>
      </div>
    );
  }

  const members = buildLiveMembers(data.members, data.dailyScores);
  const ranked = [...members].sort((a, b) => b.readiness - a.readiness);
  const dayLabels = (ranked[0]?.weekly ?? []).map((s) => weekdayLabel(s.day));
  const chartData = dayLabels.map((day, i) => {
    const row: Record<string, string | number> = { day };
    for (const m of members) {
      const s = m.weekly[i];
      row[m.name] = s ? Math.round(s.readiness * 0.4 + s.sleep * 0.3 + s.activity * 0.3) : 0;
    }
    return row;
  });

  return (
    <div className="tab-page active">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">CentreCourt · Wellness Challenge</div>
          <div className="page-title">Team Leaderboard</div>
          <div className="page-date">Live from InstantDB · sandbox-sourced</div>
        </div>
        <div className="header-actions">
          <button className="btn btn-ghost">⬇ Export</button>
          <button className="btn btn-primary">+ Invite</button>
        </div>
      </div>

      <div className="tabs">
        {SUB_TABS.map((t, i) => (
          <button
            key={t}
            className={`tab${subTab === i ? " active" : ""}`}
            onClick={() => setSubTab(i)}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="leaderboard-grid">
        {ranked.map((m, i) => (
          <MemberCard key={m.id} member={m} rank={i + 1} />
        ))}
      </div>

      <div className="section-eyebrow">Category</div>
      <div className="section-title">Today&apos;s Category Leaders</div>
      <div className="metrics-row">
        {CATEGORIES.map((cat) => {
          const sorted = [...members].sort((a, b) => b[cat.key] - a[cat.key]);
          return (
            <div className="metric-card" key={cat.id}>
              <div className="m-icon">{cat.icon}</div>
              <div className="m-label">{cat.label}</div>
              <div className="m-winner">{sorted[0]?.name ?? "—"}</div>
              <div>
                {sorted.map((m) => {
                  const pct = Math.round((m[cat.key] / cat.max) * 100);
                  return (
                    <div className="mini-bar-row" key={m.id}>
                      <div className="mini-bar-label">
                        <span>{m.shortId}</span>
                        <span style={{ color: cat.color }}>{formatVal(cat.key, m[cat.key])}</span>
                      </div>
                      <div className="bar-track">
                        <div className="bar-fill" style={{ width: `${pct}%`, background: cat.color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="chart-card">
        <div className="chart-header">
          <div className="chart-title">Weekly Point Standings</div>
          <div className="legend">
            <div className="legend-item">
              <div className="legend-dot" style={{ background: "#C9A84C" }} />
              Readiness 40%
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{ background: "#8BADC8" }} />
              Sleep 30%
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{ background: "#4CAF8A" }} />
              Activity 30%
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData}>
            <CartesianGrid stroke="#1e3a56" />
            <XAxis dataKey="day" stroke="#7A9BB8" tick={{ fontSize: 11 }} />
            <YAxis domain={[50, 100]} stroke="#7A9BB8" tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ background: "#162d45", border: "1px solid #1e3a56", borderRadius: 6 }} />
            {members.map((m) => (
              <Line
                key={m.id}
                type="monotone"
                dataKey={m.name}
                stroke={m.color}
                strokeWidth={2}
                dot={{ r: 3, fill: m.color }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function MemberCard({ member, rank }: { member: LiveMember; rank: number }) {
  return (
    <div className={`member-card rank-${rank}`}>
      <div className="rank-badge">{rank}</div>
      <div className="avatar" style={{ background: `${member.color}22`, color: member.color }}>
        {member.shortId}
      </div>
      <div className="member-name">{member.name}</div>
      <div className="member-role">{member.role}</div>
      <div className="ring-container">
        <RingArc score={member.readiness} color={member.color} />
        <div className="ring-score" style={{ color: member.color }}>
          {member.readiness}
        </div>
      </div>
      <div className="score-label">Readiness</div>
      <div className="mini-metrics">
        <div className="mini-metric">
          <div className="val" style={{ color: "#8BADC8" }}>
            {member.sleep}
          </div>
          <div className="lbl">Sleep</div>
        </div>
        <div className="mini-metric">
          <div className="val" style={{ color: "#E06060" }}>
            {member.activity}
          </div>
          <div className="lbl">Activity</div>
        </div>
        <div className="mini-metric">
          <div className="val" style={{ color: "#4CAF8A" }}>
            {(member.steps / 1000).toFixed(1)}k
          </div>
          <div className="lbl">Steps</div>
        </div>
      </div>
    </div>
  );
}
