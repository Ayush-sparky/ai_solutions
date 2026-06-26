import Link from "next/link";
import { buildHref } from "@/lib/pagination";

// Server component. Renders a row of filter "chips" as links that set
// `?<paramKey>=<value>` (omitting the param entirely for `defaultValue`, e.g.
// "All"). Selecting a filter resets `page` and preserves the other params
// passed in `params` (typically the active search `q`).
//
// options: [{ label, value, count? }]
export default function FilterChips({
  basePath,
  paramKey,
  active,
  defaultValue,
  options,
  params = {},
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const isActive = active === opt.value;
        const href = buildHref(basePath, {
          ...params,
          page: undefined,
          [paramKey]: opt.value === defaultValue ? undefined : opt.value,
        });
        return (
          <Link
            key={opt.value}
            href={href}
            aria-current={isActive ? "true" : undefined}
            className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-medium ${
              isActive
                ? "bg-indigo-600 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {opt.label}
            {opt.count != null ? (
              <span
                className={`rounded-full px-1.5 text-xs ${
                  isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                }`}
              >
                {opt.count}
              </span>
            ) : null}
          </Link>
        );
      })}
    </div>
  );
}
