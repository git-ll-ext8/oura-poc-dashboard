import { id } from "@instantdb/admin";
import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/instant-admin";
import { SESSION_COOKIE, isKnownMemberShortId } from "@/lib/oura";

export const runtime = "nodejs";

const METRICS = ["readiness", "sleep", "activity"] as const;
type Metric = (typeof METRICS)[number];

export async function POST(req: NextRequest) {
  const session = req.cookies.get(SESSION_COOKIE)?.value ?? "";
  if (!isKnownMemberShortId(session)) {
    console.error("[consent] rejected — no valid session cookie");
    return NextResponse.json({ error: "Not signed in via Oura" }, { status: 401 });
  }

  const body = (await req.json()) as Partial<Record<Metric, boolean>>;
  const consentedMetrics = METRICS.filter((m) => body[m] === true);
  console.log(`[consent] member=${session} consenting to:`, consentedMetrics);

  try {
    const existing = await adminDb.query({ consents: { $: { where: { memberId: session } } } });
    const deleteOld = existing.consents.map((c) => adminDb.tx.consents[c.id].delete());
    const createNew = consentedMetrics.map((metric) =>
      adminDb.tx.consents[id()].update({ memberId: session, metric, shareOnLeaderboard: true })
    );
    await adminDb.transact([...deleteOld, ...createNew]);
    console.log(`[consent] saved for member=${session}: ${consentedMetrics.join(", ") || "(none)"}`);
    return NextResponse.json({ ok: true, consented: consentedMetrics });
  } catch (err) {
    console.error("[consent] FAILED:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
