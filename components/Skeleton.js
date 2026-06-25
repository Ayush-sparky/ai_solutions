// Lightweight skeleton placeholders shared by loading.js files. Decorative, so
// it's hidden from assistive tech — the route's loading state is conveyed by the
// page transition itself.
export function Skeleton({ className = "" }) {
  return <div className={`animate-pulse bg-slate-200 ${className}`} aria-hidden="true" />;
}

// Card placeholder matching the article/gallery card footprint (image + text).
export function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <Skeleton className="aspect-[16/9]" />
      <div className="space-y-3 p-6">
        <Skeleton className="h-3 w-24 rounded" />
        <Skeleton className="h-5 w-3/4 rounded" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-5/6 rounded" />
      </div>
    </div>
  );
}
