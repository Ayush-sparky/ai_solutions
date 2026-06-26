"use client";

// Sticky top bar for the admin panel. Holds the mobile menu button + brand (the
// desktop sidebar already shows the brand) on the left and the live notification
// bell on the right.

import NotificationBell from "./NotificationBell";

export default function AdminTopbar({ onMenu }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onMenu}
          aria-label="Open menu"
          className="rounded-md p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
        <div className="flex items-center gap-2 lg:hidden">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-bold text-white">
            AI
          </span>
          <span className="font-semibold text-slate-900">Admin</span>
        </div>
      </div>

      <NotificationBell />
    </header>
  );
}
