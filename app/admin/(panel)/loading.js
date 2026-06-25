import { Skeleton } from "@/components/Skeleton";

// Generic admin content skeleton. Rendered inside the panel layout, so the
// sidebar stays put while the page's data loads.
export default function Loading() {
  return (
    <div className="p-6 sm:p-8">
      <Skeleton className="h-7 w-40 rounded" />
      <Skeleton className="mt-2 h-4 w-64 rounded" />

      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-b border-slate-100 px-4 py-4 last:border-b-0">
            <Skeleton className="h-4 w-1/4 rounded" />
            <Skeleton className="h-4 w-1/3 rounded" />
            <Skeleton className="ml-auto h-4 w-16 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
