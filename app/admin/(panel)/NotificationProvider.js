"use client";

// Client-side brain of the admin notification system.
//
// Responsibilities:
//   - Hold the live feed + unread counts (hydrated from the server snapshot).
//   - Keep a Server-Sent Events connection open for instant push; on every
//     (re)connect, reconcile against the REST snapshot so nothing is missed.
//   - Surface new arrivals as stacking toasts.
//   - Mark notifications read (individually, all, or a whole section when the
//     admin navigates to it) and keep counts in sync.
//
// Consumed via the useNotifications() hook by the bell, toast stack, and sidebar.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import { NOTIFICATION_META } from "./notificationMeta";

const NotificationContext = createContext(null);

const EMPTY_COUNTS = { inquiry: 0, review: 0, eventRegistration: 0, total: 0 };
const FEED_CAP = 50; // most items we keep client-side
const TOAST_CAP = 5; // most toasts visible at once
const SAFETY_REFETCH_MS = 30000; // reconcile periodically even if SSE is quiet

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return ctx;
}

export default function NotificationProvider({ initial, children }) {
  const [items, setItems] = useState(() => initial?.items ?? []);
  const [counts, setCounts] = useState(() => initial?.counts ?? EMPTY_COUNTS);
  const [toasts, setToasts] = useState([]);
  const [live, setLive] = useState(false);

  // Ids we've already incorporated — dedupes SSE pushes against snapshot reloads.
  const seenIds = useRef(new Set((initial?.items ?? []).map((i) => i.id)));
  // Latest counts readable inside effects without retriggering them.
  const countsRef = useRef(counts);
  useEffect(() => {
    countsRef.current = counts;
  }, [counts]);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const pushToast = useCallback((notification) => {
    setToasts((prev) => {
      if (prev.some((t) => t.id === notification.id)) return prev;
      return [...prev, notification].slice(-TOAST_CAP);
    });
  }, []);

  // Replace local state with an authoritative server snapshot.
  const applySnapshot = useCallback((snapshot) => {
    if (!snapshot) return;
    setItems(snapshot.items ?? []);
    setCounts(snapshot.counts ?? EMPTY_COUNTS);
    for (const item of snapshot.items ?? []) seenIds.current.add(item.id);
  }, []);

  const refetch = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/notifications", { cache: "no-store" });
      if (res.ok) applySnapshot(await res.json());
    } catch {
      // Offline / transient — the next tick or SSE reconnect will retry.
    }
  }, [applySnapshot]);

  // Incorporate a single freshly-pushed notification (from SSE).
  const ingest = useCallback(
    (notification) => {
      if (!notification?.id || seenIds.current.has(notification.id)) return;
      seenIds.current.add(notification.id);
      setItems((prev) => [notification, ...prev].slice(0, FEED_CAP));
      if (!notification.readAt) {
        setCounts((prev) => bumpCounts(prev, notification.type, 1));
        pushToast(notification);
      }
    },
    [pushToast]
  );

  // --- Live connection (Server-Sent Events) -------------------------------
  useEffect(() => {
    if (typeof window === "undefined" || typeof EventSource === "undefined") {
      return undefined;
    }
    const source = new EventSource("/api/admin/notifications/stream");

    source.addEventListener("ready", () => {
      setLive(true);
      // Catch up on anything that happened while we were disconnected.
      refetch();
    });
    source.addEventListener("notification", (event) => {
      try {
        ingest(JSON.parse(event.data));
      } catch {
        // Malformed payload — ignore.
      }
    });
    source.onerror = () => {
      // EventSource auto-reconnects; reflect the gap in the UI meanwhile.
      setLive(false);
    };

    return () => source.close();
  }, [ingest, refetch]);

  // --- Safety net: periodic + on-focus reconciliation ---------------------
  useEffect(() => {
    const interval = setInterval(refetch, SAFETY_REFETCH_MS);
    const onFocus = () => {
      if (document.visibilityState === "visible") refetch();
    };
    document.addEventListener("visibilitychange", onFocus);
    window.addEventListener("focus", onFocus);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onFocus);
      window.removeEventListener("focus", onFocus);
    };
  }, [refetch]);

  // --- Mark read ----------------------------------------------------------
  const postRead = useCallback(
    async (selector) => {
      try {
        const res = await fetch("/api/admin/notifications/read", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(selector),
        });
        if (res.ok) applySnapshot(await res.json());
      } catch {
        // Best-effort; counts will be corrected on the next reconcile.
      }
    },
    [applySnapshot]
  );

  const nowIso = () => new Date().toISOString();

  const markRead = useCallback(
    (id) => {
      // Optimistic: flip the row and drop it from the unread tally immediately.
      let affected = null;
      setItems((prev) =>
        prev.map((i) => {
          if (i.id === id && !i.readAt) {
            affected = i;
            return { ...i, readAt: nowIso() };
          }
          return i;
        })
      );
      if (affected) setCounts((prev) => bumpCounts(prev, affected.type, -1));
      postRead({ id });
    },
    [postRead]
  );

  const markAllRead = useCallback(() => {
    setItems((prev) => prev.map((i) => (i.readAt ? i : { ...i, readAt: nowIso() })));
    setCounts(EMPTY_COUNTS);
    setToasts([]);
    postRead({ all: true });
  }, [postRead]);

  const markTypeRead = useCallback(
    (type) => {
      setItems((prev) =>
        prev.map((i) =>
          i.type === type && !i.readAt ? { ...i, readAt: nowIso() } : i
        )
      );
      setCounts((prev) => clearType(prev, type));
      postRead({ type });
    },
    [postRead]
  );

  // Auto-clear a section's badge when the admin opens that section.
  const pathname = usePathname();
  useEffect(() => {
    const entry = Object.entries(NOTIFICATION_META).find(
      ([, meta]) => pathname === meta.href || pathname.startsWith(`${meta.href}/`)
    );
    if (!entry) return;
    const [type, meta] = entry;
    if ((countsRef.current?.[meta.countKey] ?? 0) > 0) markTypeRead(type);
  }, [pathname, markTypeRead]);

  const value = {
    items,
    counts,
    toasts,
    live,
    dismissToast,
    markRead,
    markAllRead,
    markTypeRead,
    refetch,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

// --- pure helpers ---------------------------------------------------------

function typeKey(type) {
  if (type === "INQUIRY") return "inquiry";
  if (type === "REVIEW") return "review";
  if (type === "EVENT_REGISTRATION") return "eventRegistration";
  return null;
}

function sumTotal(counts) {
  return (counts.inquiry ?? 0) + (counts.review ?? 0) + (counts.eventRegistration ?? 0);
}

function bumpCounts(counts, type, delta) {
  const key = typeKey(type);
  if (!key) return counts;
  const next = { ...counts, [key]: Math.max(0, (counts[key] ?? 0) + delta) };
  next.total = sumTotal(next);
  return next;
}

function clearType(counts, type) {
  const key = typeKey(type);
  if (!key) return counts;
  const next = { ...counts, [key]: 0 };
  next.total = sumTotal(next);
  return next;
}
