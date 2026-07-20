"use client";

import { useEffect, useState } from "react";
import { formatAbsoluteTime, formatRelativeTime, isStaleSync } from "@/lib/live";

// Ticks every minute so the "(3 hours ago)" counter stays accurate without a page reload.
export function FreshnessLabel({ lastSyncedAt }: { lastSyncedAt: number }) {
  const [, forceTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => forceTick((n) => n + 1), 60_000);
    return () => clearInterval(t);
  }, []);

  const stale = isStaleSync(lastSyncedAt);

  return (
    <div className={`freshness-label${stale ? " stale" : ""}`}>
      Last updated: {formatAbsoluteTime(lastSyncedAt)} ({formatRelativeTime(lastSyncedAt)})
    </div>
  );
}
