"use client";

import Link from "next/link";
import { FreshnessLabel } from "./FreshnessLabel";
import { db } from "@/lib/instant";
import { buildLiveMembers, isRowVisible, type MetricKey } from "@/lib/live";

export function MemberDetailView({ shortId }: { shortId: string }) {
  const { isLoading, error, data } = db.useQuery({
    members: { $: { where: { shortId } } },
    dailyScores: { $: { where: { memberId: shortId } } },
    consents: { $: { where: { memberId: shortId } } },
  });

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

  const [member] = buildLiveMembers(data.members, data.dailyScores, data.consents);
  if (!member) {
    return (
      <div className="tab-page active">
        <div className="page-header">
          <div>
            <div className="page-title">Member not found</div>
            <div className="page-date">
              <Link href="/">← Back to Leaderboard</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isLiveNow = member.source === "oura";
  const rows = data.dailyScores.slice().sort((a, b) => b.day.localeCompare(a.day));

  const METRICS: { key: MetricKey; label: string; color: string }[] = [
    { key: "readiness", label: "Readiness", color: "#C9A84C" },
    { key: "sleep", label: "Sleep", color: "#8BADC8" },
    { key: "activity", label: "Activity", color: "#E06060" },
  ];

  return (
    <div className="tab-page active">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">
            <Link href="/" style={{ color: "var(--cc-gold)" }}>
              ← Back to Leaderboard
            </Link>
          </div>
          <div className="page-title">
            {member.name} <span style={{ color: "var(--text-dim)", fontWeight: 400 }}>· {member.role}</span>
          </div>
          <div className="page-date">Full historical record, day by day</div>
        </div>
      </div>

      <div className="chart-card" style={{ textAlign: "center", maxWidth: 260 }}>
        <div className="avatar" style={{ background: `${member.color}22`, color: member.color, margin: "0 auto 10px" }}>
          {member.shortId}
        </div>
        {isLiveNow ? (
          <div className="source-badge source-badge-live">● LIVE — real Oura Ring data</div>
        ) : (
          <div className="source-badge source-badge-demo">DEMO DATA</div>
        )}
        {isLiveNow && member.lastSyncedAt && <FreshnessLabel lastSyncedAt={member.lastSyncedAt} />}
        <a
          className={isLiveNow ? "manage-sharing-link" : "signin-oura-btn"}
          href={`/api/auth/oura/login?member=${member.shortId}`}
          style={{ marginTop: 12 }}
        >
          {isLiveNow ? "Manage my sharing →" : "Sign in with Oura"}
        </a>
      </div>

      <div className="section-eyebrow">History</div>
      <div className="section-title">
        {rows.length} day{rows.length === 1 ? "" : "s"} on record
      </div>
      <div className="chart-card">
        <div style={{ maxHeight: 480, overflowY: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                {METRICS.map((m) => (
                  <th key={m.key}>{m.label}</th>
                ))}
                <th>Steps</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>{row.day}</td>
                  {METRICS.map((m) => {
                    const visible = isRowVisible(row.source, member.consentedMetrics, m.key);
                    // Oura's Activity score is documented as an integer in [1, 100] or
                    // null -- a real score is never 0, so a stored 0 on a real Oura row
                    // means Oura never finished scoring that day (its Activity Day, or
                    // the sync that would've reported it, never closed out). Avoid
                    // "calculating" here -- this dashboard only checks Oura once a day,
                    // so for anything but the most recent day or two this isn't "about
                    // to resolve," it's just a gap. "No score" makes no promise either way.
                    const noScore = m.key === "activity" && row.source === "oura" && row.activity === 0;
                    return (
                      <td key={m.key}>
                        {!visible ? (
                          <span className="private-metric">Private</span>
                        ) : noScore ? (
                          <span className="metric-pending">No score</span>
                        ) : (
                          <span style={{ color: m.color }}>{row[m.key]}</span>
                        )}
                      </td>
                    );
                  })}
                  <td>
                    {isRowVisible(row.source, member.consentedMetrics, "activity")
                      ? row.steps.toLocaleString()
                      : "—"}
                  </td>
                  <td>
                    {row.source === "oura" ? (
                      <span className="pill pill-green">Real</span>
                    ) : (
                      <span className="pill pill-blue">Demo</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
