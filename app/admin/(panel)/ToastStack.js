"use client";

// Bottom-right stack of toasts for notifications that arrive while the admin is
// using the dashboard. Multiple toasts stack and each auto-dismisses; hovering
// pauses its timer so it can be read. Clicking opens the relevant section.

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useNotifications } from "./NotificationProvider";
import { metaFor } from "./notificationMeta";

const AUTO_DISMISS_MS = 6500;

function Toast({ notification, onDismiss, onOpen }) {
  const meta = metaFor(notification.type);
  const [leaving, setLeaving] = useState(false);
  const timerRef = useRef(null);

  // Animate out, then remove from the stack.
  function close() {
    setLeaving(true);
    setTimeout(() => onDismiss(notification.id), 180);
  }

  function startTimer() {
    stopTimer();
    timerRef.current = setTimeout(close, AUTO_DISMISS_MS);
  }
  function stopTimer() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  useEffect(() => {
    startTimer();
    return stopTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      onMouseEnter={stopTimer}
      onMouseLeave={startTimer}
      className={`pointer-events-auto w-80 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg ring-1 ring-black/5 transition-all duration-200 ${
        leaving
          ? "translate-x-2 opacity-0"
          : "translate-x-0 opacity-100 motion-safe:animate-[toastIn_0.2s_ease-out]"
      }`}
    >
      <button
        type="button"
        onClick={() => onOpen(notification)}
        className="flex w-full items-start gap-3 p-3.5 text-left"
      >
        <span
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${meta.iconWrap}`}
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.7}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d={meta.iconPath} />
          </svg>
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-slate-900">
            {notification.title}
          </span>
          <span className="mt-0.5 block text-sm text-slate-600">
            {notification.body}
          </span>
        </span>
      </button>
      <button
        type="button"
        onClick={close}
        aria-label="Dismiss notification"
        className="absolute right-2 top-2 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export default function ToastStack() {
  const { toasts, dismissToast, markRead } = useNotifications();
  const router = useRouter();

  function openToast(notification) {
    markRead(notification.id);
    dismissToast(notification.id);
    router.push(metaFor(notification.type).href);
  }

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex flex-col gap-3">
      {toasts.map((toast) => (
        <div key={toast.id} className="relative">
          <Toast notification={toast} onDismiss={dismissToast} onOpen={openToast} />
        </div>
      ))}
    </div>
  );
}
