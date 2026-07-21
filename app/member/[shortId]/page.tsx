"use client";

import { use } from "react";
import { MemberDetailView } from "@/components/MemberDetailView";
import { Sidebar } from "@/components/Sidebar";

export default function MemberPage({ params }: { params: Promise<{ shortId: string }> }) {
  const { shortId } = use(params);
  return (
    <>
      <Sidebar active="leaderboard" onNavigate={() => {}} />
      <main className="main">
        <MemberDetailView shortId={shortId} />
      </main>
    </>
  );
}
