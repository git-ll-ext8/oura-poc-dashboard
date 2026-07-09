"use client";

import { ScriptView } from "@/components/ScriptView";
import { Sidebar } from "@/components/Sidebar";

export default function ScriptPage() {
  return (
    <>
      <Sidebar active="leaderboard" onNavigate={() => {}} />
      <ScriptView />
    </>
  );
}
