"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { db } from "@/lib/instant";
import { buildLiveMembers, weekdayLabel, type DbDailyScore } from "@/lib/live";

const CHARTS: { key: keyof Pick<DbDailyScore, "sleep" | "activity" | "steps">; title: string }[] = [
  { key: "sleep", title: "Sleep Score — Past 7 Days" },
  { key: "activity", title: "Activity Score — Past 7 Days" },
  { key: "steps", title: "Daily Steps — Past 7 Days" },
];

export function TrendsView() {
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
  const dayLabels = (members[0]?.weekly ?? []).map((s) => weekdayLabel(s.day));

  return (
    <div className="tab-page active">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">CentreCourt · Weekly Deep-Dive</div>
          <div className="page-title">Weekly Trends</div>
          <div className="page-date">Last 7 days · All members · Live from InstantDB</div>
        </div>
      </div>

      {CHARTS.map((chart, idx) => {
        const chartData = dayLabels.map((day, i) => {
          const row: Record<string, string | number> = { day };
          for (const m of members) {
            row[m.name] = m.weekly[i]?.[chart.key] ?? 0;
          }
          return row;
        });

        return (
          <div className="chart-card" key={chart.key}>
            <div className="chart-header">
              <div className="chart-title">{chart.title}</div>
              {idx === 0 && (
                <div className="legend">
                  {members.map((m) => (
                    <div className="legend-item" key={m.id}>
                      <div className="legend-dot" style={{ background: m.color }} />
                      {m.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={chartData}>
                <CartesianGrid stroke="#1e3a56" />
                <XAxis dataKey="day" stroke="#7A9BB8" tick={{ fontSize: 11 }} />
                <YAxis stroke="#7A9BB8" tick={{ fontSize: 11 }} />
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
        );
      })}
    </div>
  );
}
