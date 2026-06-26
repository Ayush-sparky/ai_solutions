import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getNotificationSnapshot } from "@/lib/notifications";

// GET /api/admin/notifications
// Returns the recent notification feed + unread counts. The client hydrates from
// the server-rendered snapshot first, then calls this to reconcile after every
// SSE (re)connect and as a periodic safety net.
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const snapshot = await getNotificationSnapshot();
  return NextResponse.json(snapshot, {
    headers: { "Cache-Control": "no-store" },
  });
}
