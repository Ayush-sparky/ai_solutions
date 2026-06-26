// Per-type presentation for notifications, shared by the bell, the toasts, and
// the sidebar badges so a notification looks the same everywhere it appears.
// Tailwind class strings are written out in full (not interpolated) so the JIT
// compiler keeps them.

export const NOTIFICATION_META = {
  INQUIRY: {
    label: "Inquiry",
    href: "/admin/inquiries",
    countKey: "inquiry", // matches the keys in the snapshot `counts` object
    iconWrap: "bg-indigo-50 text-indigo-600",
    dot: "bg-indigo-500",
    iconPath:
      "M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75",
  },
  REVIEW: {
    label: "Review",
    href: "/admin/reviews",
    countKey: "review",
    iconWrap: "bg-amber-50 text-amber-600",
    dot: "bg-amber-500",
    iconPath:
      "M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z",
  },
  EVENT_REGISTRATION: {
    label: "Event registration",
    href: "/admin/events/registrations",
    countKey: "eventRegistration",
    iconWrap: "bg-emerald-50 text-emerald-600",
    dot: "bg-emerald-500",
    iconPath:
      "M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z",
  },
};

// Fallback used if an unknown type ever shows up, so the UI never crashes.
export const FALLBACK_META = {
  label: "Notification",
  href: "/admin",
  countKey: null,
  iconWrap: "bg-slate-100 text-slate-600",
  dot: "bg-slate-400",
  iconPath: "M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0",
};

export function metaFor(type) {
  return NOTIFICATION_META[type] ?? FALLBACK_META;
}
