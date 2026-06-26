// Shared helpers for the admin list pages: URL <-> pagination/search/filter
// state. All admin tables drive their state through the URL query string so the
// views are server-rendered, shareable, and don't ship the full dataset to the
// client.

// Default rows per page for table-style lists.
export const PAGE_SIZE = 10;

// A query param may arrive as string | string[] | undefined. Normalise to the
// first string value (trimmed) or "".
export function getParam(value) {
  const v = Array.isArray(value) ? value[0] : value;
  return typeof v === "string" ? v.trim() : "";
}

// Parse a 1-based page number from a query value, clamping junk to 1.
export function parsePage(value) {
  const n = Number.parseInt(getParam(value), 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

// Build an href for `basePath`, keeping only the truthy params. Empty strings,
// null, and undefined are dropped so we never produce `?q=&page=`.
export function buildHref(basePath, params = {}) {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    qs.set(key, String(value));
  }
  const s = qs.toString();
  return s ? `${basePath}?${s}` : basePath;
}

// Given a requested page, page size, and total row count, work out the clamped
// current page and the Prisma `skip`/`take` plus the human "X–Y of Z" range.
export function paginate(page, total, pageSize = PAGE_SIZE) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(Math.max(1, page), totalPages);
  const skip = (current - 1) * pageSize;
  const from = total === 0 ? 0 : skip + 1;
  const to = Math.min(skip + pageSize, total);
  return { totalPages, current, skip, take: pageSize, from, to, total };
}
