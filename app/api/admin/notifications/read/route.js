import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { markNotificationsRead } from "@/lib/notifications";

// POST /api/admin/notifications/read
// Marks notifications read. Body is one of:
//   { all: true }      -> every unread
//   { id: "..." }      -> a single notification
//   { ids: ["...", ] } -> several
//   { type: "REVIEW" } -> all unread of a type (used when an admin opens a section)
// Responds with a fresh snapshot so the client can reconcile its counts.
export const dynamic = "force-dynamic";

export async function POST(request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body = {};
  try {
    body = await request.json();
  } catch {
    // Empty/invalid body -> treated as a no-op selector below.
  }

  const snapshot = await markNotificationsRead({
    all: body?.all === true,
    id: typeof body?.id === "string" ? body.id : undefined,
    ids: Array.isArray(body?.ids) ? body.ids : undefined,
    type: typeof body?.type === "string" ? body.type : undefined,
  });

  return NextResponse.json(snapshot, {
    headers: { "Cache-Control": "no-store" },
  });
}
