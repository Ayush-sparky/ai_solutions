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

export function excerpt(text, max = 140) {
  if (!text) return "";
  const clean = text.trim();
  return clean.length > max ? `${clean.slice(0, max).trimEnd()}…` : clean;
}
