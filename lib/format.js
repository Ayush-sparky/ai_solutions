// Small formatting helpers. Dates are formatted in UTC so the displayed value
// matches what was stored, regardless of server timezone.
export function formatDate(value, opts = {}) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
    ...opts,
  });
}

export function formatTime(value, opts = {}) {
  return new Date(value).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
    ...opts,
  });
}

// Compact relative time ("just now", "5m ago", "3h ago") for the notification
// feed. Falls back to an absolute date once it's more than a week old.
export function timeAgo(value) {
  const then = new Date(value).getTime();
  if (Number.isNaN(then)) return "";
  const diffSec = Math.max(0, Math.round((Date.now() - then) / 1000));
  if (diffSec < 45) return "just now";
  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.round(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return formatDate(value);
}

// True when the given date/time is now or in the future. Used to split events
// into "upcoming" vs "past". Lives here (a plain module, not a component) so the
// Date.now() call stays out of any component's render path.
export function isUpcoming(value) {
  return new Date(value).getTime() >= Date.now();
}

export function excerpt(text, max = 140) {
  if (!text) return "";
  const clean = text.trim();
  return clean.length > max ? `${clean.slice(0, max).trimEnd()}…` : clean;
}
