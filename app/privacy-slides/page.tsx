"use client";

import { PrivacySlidesView } from "@/components/PrivacySlidesView";
import { Sidebar } from "@/components/Sidebar";

export default function PrivacySlidesPage() {
  return (
    <>
      <Sidebar active="leaderboard" onNavigate={() => {}} />
      <PrivacySlidesView />
    </>
  );
}
