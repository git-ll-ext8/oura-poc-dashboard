"use client";

import { Sidebar } from "@/components/Sidebar";
import { ThesisView } from "@/components/ThesisView";

export default function ThesisPage() {
  return (
    <>
      <Sidebar active="leaderboard" onNavigate={() => {}} />
      <ThesisView />
    </>
  );
}
