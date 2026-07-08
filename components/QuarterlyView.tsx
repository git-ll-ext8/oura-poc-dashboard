"use client";

import { useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  QUARTERS,
  QUARTER_LABELS,
  memberById,
  members,
  mostImproved,
  quarterlyImprovement,
  quarterlyTrend,
} from "@/lib/data";

const CARDS: { key: keyof typeof quarterlyImprovement; icon: string; title: string; sub: string }[] = [
  { key: "sleep", icon: "😴", title: "Sleep Score Improvement", sub: "Q4 2025 → Q1 2026 average" },
  { key: "readiness", icon: "⚡", title: "Readiness Score Improvement", sub: "Q4 2025 → Q1 2026 average" },
  { key: "hrv", icon: "💓", title: "HRV Improvement", sub: "Q4 2025 → Q1 2026 average (ms)" },
  { key: "steps", icon: "🏃", title: "Daily Steps Improvement", sub: "Q4 2025 → Q1 2026 average" },
];

const trendChartData = QUARTER_LABELS.map((label, i) => {
  const row: Record<string, string | number> = { quarter: label };
  for (const m of members) {
    row[m.name] = quarterlyTrend(m)[i];
  }
  return row;
});

export function QuarterlyView() {
  const [activeQ, setActiveQ] = useState<(typeof QUARTERS)[number]>("Q1");
  const improvedMember = memberById(mostImproved.memberId);

  return (
    <div className="tab-page active">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">CentreCourt · Continuous Improvement</div>
          <div className="page-title">Quarterly Growth</div>
          <div className="page-date">Tracking improvement deltas across all health metrics</div>
        </div>
      </div>

      <div className="q-selector">
        {QUARTERS.map((q) => (
          <button
            key={q}
            className={`q-btn${activeQ === q ? " active" : ""}`}
            onClick={() => setActiveQ(q)}
          >
            {q} 2026
          </button>
        ))}
      </div>

      <div className="most-improved-banner">
        <div className="mib-trophy">🏆</div>
        <div>
          <div className="mib-eyebrow">Most Improved · {activeQ} 2026</div>
          <div className="mib-name">{improvedMember.name}</div>
          <div className="mib-desc">
            +{mostImproved.deltaOverall} pts overall · Biggest gains in Sleep (+{mostImproved.sleepDelta}) and
            Readiness (+{mostImproved.readinessDelta}) · {mostImproved.prsBroken} personal records broken
          </div>
        </div>
      </div>

      <div className="quarterly-grid">
        {CARDS.map((card) => (
          <div className="improvement-card" key={card.key}>
            <div className="ic-header">
              <div className="ic-icon">{card.icon}</div>
              <div>
                <div className="ic-title">{card.title}</div>
                <div className="ic-sub">{card.sub}</div>
              </div>
            </div>
            <div>
              {quarterlyImprovement[card.key].map((row) => {
                const member = memberById(row.memberId);
                const isSteps = card.key === "steps";
                const deltaStr = isSteps ? `+${row.delta.toLocaleString()}` : `+${row.delta}`;
                const fromStr = isSteps
                  ? `${row.prev.toLocaleString()} → ${row.curr.toLocaleString()}`
                  : `${row.prev} → ${row.curr}`;
                return (
                  <div className="improvement-row" key={row.memberId}>
                    <div className="ir-person">
                      <div className="ir-avatar" style={{ background: `${member.color}22`, color: member.color }}>
                        {member.id}
                      </div>
                      <div className="ir-name">{member.name}</div>
                    </div>
                    <div>
                      <div className="ir-delta delta-pos">{deltaStr}</div>
                      <div className="ir-from">{fromStr}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="chart-card">
        <div className="chart-header">
          <div className="chart-title">Readiness Score · 5-Quarter Trend</div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={trendChartData}>
            <CartesianGrid stroke="#1e3a56" />
            <XAxis dataKey="quarter" stroke="#7A9BB8" tick={{ fontSize: 11 }} />
            <YAxis domain={[60, 100]} stroke="#7A9BB8" tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ background: "#162d45", border: "1px solid #1e3a56", borderRadius: 6 }} />
            <Legend wrapperStyle={{ fontSize: 11, color: "#7A9BB8" }} />
            {members.map((m) => (
              <Line
                key={m.id}
                type="monotone"
                dataKey={m.name}
                stroke={m.color}
                strokeWidth={2}
                dot={{ r: 5, fill: m.color }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
