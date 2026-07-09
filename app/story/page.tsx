"use client";

import { Sidebar } from "@/components/Sidebar";
import { StoryView } from "@/components/StoryView";

export default function StoryPage() {
  return (
    <>
      <Sidebar active="leaderboard" onNavigate={() => {}} />
      <main className="main">
        <StoryView />
      </main>
    </>
  );
}
