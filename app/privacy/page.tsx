"use client";

import { PrivacyView } from "@/components/PrivacyView";
import { Sidebar } from "@/components/Sidebar";

export default function PrivacyPage() {
  return (
    <>
      <Sidebar active="leaderboard" onNavigate={() => {}} />
      <main className="main">
        <PrivacyView />
      </main>
    </>
  );
}
