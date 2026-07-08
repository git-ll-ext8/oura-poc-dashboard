"use client";

import { useState } from "react";
import { AchievementsView } from "@/components/AchievementsView";
import { LeaderboardView } from "@/components/LeaderboardView";
import { QuarterlyView } from "@/components/QuarterlyView";
import { Sidebar, type NavView } from "@/components/Sidebar";
import { TrendsView } from "@/components/TrendsView";

export default function Home() {
  const [view, setView] = useState<NavView>("leaderboard");

  return (
    <>
      <Sidebar active={view} onNavigate={setView} />
      <main className="main">
        {view === "leaderboard" && <LeaderboardView />}
        {view === "quarterly" && <QuarterlyView />}
        {view === "trends" && <TrendsView />}
        {view === "badges" && <AchievementsView />}
      </main>
    </>
  );
}
