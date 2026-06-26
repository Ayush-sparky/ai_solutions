import { getSession } from "@/lib/auth";
import { onNotification } from "@/lib/events";

// GET /api/admin/notifications/stream
// A Server-Sent Events endpoint. While an admin tab is open it holds this
// connection and receives a `notification` event the instant a new inquiry or
// review is submitted — driving live toasts and badge updates with no polling.
//
// EventSource sends the session cookie automatically (same-origin), so the
// normal admin auth check applies. Needs the Node.js runtime for the long-lived
// stream + the in-process event bus.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Comment ping cadence — keeps proxies/load balancers from idling the stream out.
const KEEPALIVE_MS = 25000;

export async function GET(request) {
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      let closed = false;
      const safeEnqueue = (chunk) => {
        if (closed) return;
        try {
          controller.enqueue(encoder.encode(chunk));
        } catch {
          // Controller already closed (client gone mid-write) — ignore.
        }
      };

      const sendEvent = (event, data) =>
        safeEnqueue(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);

      // Tell the client we're live; it reconciles its state via the REST snapshot
      // on this signal, covering anything missed while disconnected.
      sendEvent("ready", { ok: true });

      const unsubscribe = onNotification((payload) =>
        sendEvent("notification", payload)
      );

      const keepAlive = setInterval(() => safeEnqueue(`: ping\n\n`), KEEPALIVE_MS);

      const cleanup = () => {
        if (closed) return;
        closed = true;
        clearInterval(keepAlive);
        unsubscribe();
        try {
          controller.close();
        } catch {
          // Already closed.
        }
      };

      // Client navigated away / closed the tab.
      request.signal.addEventListener("abort", cleanup);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      // Disable proxy buffering (e.g. nginx) so events flush immediately.
      "X-Accel-Buffering": "no",
    },
  });
}
