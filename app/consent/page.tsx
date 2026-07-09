"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { db } from "@/lib/instant";

const METRICS: { key: "readiness" | "sleep" | "activity"; label: string; desc: string }[] = [
  { key: "readiness", label: "Readiness Score", desc: "Your daily recovery/readiness score (0-100)" },
  { key: "sleep", label: "Sleep Score", desc: "Your daily sleep score (0-100)" },
  { key: "activity", label: "Activity Score", desc: "Your daily activity score and step count" },
];

function ConsentPageInner() {
  const params = useSearchParams();
  const router = useRouter();
  const memberShortId = params.get("member") ?? "";
  const noData = params.get("nodata") === "1";
  const { data } = db.useQuery({ members: {} });
  const member = data?.members.find((m) => m.shortId === memberShortId);

  const [toggles, setToggles] = useState({ readiness: false, sleep: false, activity: false });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await fetch("/api/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toggles),
      });
      setSaved(true);
      setTimeout(() => router.push("/"), 900);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="tab-page active">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">CentreCourt · Wellness Challenge</div>
          <div className="page-title">Welcome, {member?.name ?? memberShortId}!</div>
          <div className="page-date">Choose what appears on the shared team leaderboard</div>
        </div>
      </div>

      {noData && (
        <div className="consent-nodata-banner">
          <strong>Heads up:</strong> we connected to your Oura account, but no ring data came back yet (no ring
          paired, or nothing synced today). You&apos;re signed in — once you sync your ring, your real scores will
          start appearing. You can still set your sharing preferences now.
        </div>
      )}

      <div className="consent-privacy-intro">
        Everything below is OFF by default. Only what you switch ON appears to your team — and you can switch it
        off or revoke entirely at any time.{" "}
        <Link href="/privacy">What can this app actually see? →</Link>
      </div>

      <div className="chart-card">
        <div className="section-eyebrow">Your Choice</div>
        <div className="section-title">Per-Metric Sharing — Default Is Private</div>
        {METRICS.map((m) => (
          <div className="consent-toggle-row" key={m.key}>
            <div>
              <div className="consent-toggle-label">{m.label}</div>
              <div className="consent-toggle-desc">{m.desc}</div>
            </div>
            <div
              className={`consent-toggle-switch${toggles[m.key] ? " on" : ""}`}
              onClick={() => setToggles((t) => ({ ...t, [m.key]: !t[m.key] }))}
              role="switch"
              aria-checked={toggles[m.key]}
            />
          </div>
        ))}
      </div>

      <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={handleSave} disabled={saving}>
        {saved ? "Saved! Redirecting..." : saving ? "Saving..." : "Save & View Leaderboard"}
      </button>

      <Link href="/privacy#how-to-stop" className="consent-revoke-link">
        How to revoke access completely →
      </Link>
    </div>
  );
}

export default function ConsentPage() {
  return (
    <Suspense fallback={null}>
      <ConsentPageInner />
    </Suspense>
  );
}
