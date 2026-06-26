import Link from "next/link";
import { buildHref } from "@/lib/pagination";

// Windowed list of page numbers around the current page, with "…" gaps:
// e.g. current 5 of 10 -> [1, "…", 4, 5, 6, "…", 10].
function pageItems(current, totalPages) {
  const items = [];
  for (
    let i = Math.max(1, current - 1);
    i <= Math.min(totalPages, current + 1);
    i++
  ) {
    items.push(i);
  }
  if (items[0] > 1) {
    if (items[0] > 2) items.unshift("…");
    items.unshift(1);
  }
  if (items[items.length - 1] < totalPages) {
    if (items[items.length - 1] < totalPages - 1) items.push("…");
    items.push(totalPages);
  }
  return items;
}

// Server component. Renders the "Showing X–Y of Z" summary plus prev/next and
// numbered page links. `params` holds the other query params (search/filter) to
// preserve as the user pages. Pass `unit`/`unitPlural` to label the summary.
export default function Pagination({
  basePath,
  params = {},
  page,
  totalPages,
  total,
  from,
  to,
  unit = "result",
  unitPlural,
}) {
  const plural = unitPlural ?? `${unit}s`;

  const summary =
    total === 0 ? (
      `No ${plural}`
    ) : (
      <>
        Showing <span className="font-medium text-slate-700">{from}</span>–
        <span className="font-medium text-slate-700">{to}</span> of{" "}
        <span className="font-medium text-slate-700">{total}</span>{" "}
        {total === 1 ? unit : plural}
      </>
    );

  return (
    <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
      <p className="text-sm text-slate-500">{summary}</p>

      {totalPages > 1 ? (
        <nav className="flex items-center gap-1" aria-label="Pagination">
          <Link
            href={buildHref(basePath, { ...params, page: page > 2 ? page - 1 : undefined })}
            aria-disabled={page <= 1}
            tabIndex={page <= 1 ? -1 : undefined}
            className={`inline-flex h-9 items-center gap-1 rounded-lg border px-3 text-sm font-medium ${
              page <= 1
                ? "pointer-events-none border-slate-100 text-slate-300"
                : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            Prev
          </Link>

          {pageItems(page, totalPages).map((item, i) =>
            item === "…" ? (
              <span key={`gap-${i}`} className="px-1.5 text-sm text-slate-400">
                …
              </span>
            ) : (
              <Link
                key={item}
                href={buildHref(basePath, { ...params, page: item === 1 ? undefined : item })}
                aria-current={item === page ? "page" : undefined}
                className={`inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-3 text-sm font-medium ${
                  item === page
                    ? "border-indigo-600 bg-indigo-600 text-white"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {item}
              </Link>
            )
          )}

          <Link
            href={buildHref(basePath, { ...params, page: page + 1 })}
            aria-disabled={page >= totalPages}
            tabIndex={page >= totalPages ? -1 : undefined}
            className={`inline-flex h-9 items-center gap-1 rounded-lg border px-3 text-sm font-medium ${
              page >= totalPages
                ? "pointer-events-none border-slate-100 text-slate-300"
                : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            Next
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
        </nav>
      ) : null}
    </div>
  );
}
