"use client";

// The bell button in the admin top bar: shows the total unread count as a badge
// and opens a dropdown feed of recent notifications. Clicking an item marks it
// read and jumps to the relevant section.

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { timeAgo } from "@/lib/format";
import { useNotifications } from "./NotificationProvider";
import { metaFor } from "./notificationMeta";

function NotificationIcon({ type }) {
  const meta = metaFor(type);
  return (
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
  );
}

export default function NotificationBell() {
  const { items, counts, live, markRead, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const router = useRouter();

  const unread = counts.total ?? 0;
  const badgeLabel = unread > 99 ? "99+" : String(unread);

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return undefined;
    function onPointer(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    function onKey(event) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function openItem(notification) {
    markRead(notification.id);
    setOpen(false);
    router.push(metaFor(notification.type).href);
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={
          unread > 0 ? `Notifications, ${unread} unread` : "Notifications"
        }
        aria-haspopup="true"
        aria-expanded={open}
        className="relative grid h-10 w-10 place-items-center rounded-full text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.7}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
          />
        </svg>
        {unread > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 inline-flex min-w-[1.15rem] items-center justify-center rounded-full bg-red-500 px-1 text-[0.65rem] font-bold leading-5 text-white ring-2 ring-white">
            {badgeLabel}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-80 origin-top-right overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl sm:w-96">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-slate-900">
                Notifications
              </h2>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[0.65rem] font-medium ${
                  live
                    ? "bg-green-50 text-green-700"
                    : "bg-slate-100 text-slate-500"
                }`}
                title={live ? "Live updates connected" : "Reconnecting…"}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    live ? "bg-green-500" : "bg-slate-400"
                  }`}
                />
                {live ? "Live" : "Offline"}
              </span>
            </div>
            {unread > 0 ? (
              <button
                type="button"
                onClick={markAllRead}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-500"
              >
                Mark all read
              </button>
            ) : null}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {items.length === 0 ? (
              <p className="px-4 py-10 text-center text-sm text-slate-500">
                You&apos;re all caught up.
              </p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {items.map((item) => {
                  const isUnread = !item.readAt;
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => openItem(item)}
                        className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50 ${
                          isUnread ? "bg-indigo-50/40" : ""
                        }`}
                      >
                        <NotificationIcon type={item.type} />
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-2">
                            <span className="truncate text-sm font-semibold text-slate-900">
                              {item.title}
                            </span>
                            {isUnread ? (
                              <span className="h-2 w-2 shrink-0 rounded-full bg-indigo-500" />
                            ) : null}
                          </span>
                          <span className="mt-0.5 block truncate text-sm text-slate-600">
                            {item.body}
                          </span>
                          <span className="mt-1 block text-xs text-slate-400">
                            {timeAgo(item.createdAt)}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
