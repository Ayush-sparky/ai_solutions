import { Skeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <article>
      <header className="bg-slate-900 text-white">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <Skeleton className="h-4 w-24 rounded bg-white/20" />
          <Skeleton className="mt-8 h-4 w-32 rounded bg-white/10" />
          <Skeleton className="mt-3 h-9 w-full rounded bg-white/20" />
          <Skeleton className="mt-2 h-9 w-2/3 rounded bg-white/20" />
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton
              key={i}
              className={`h-5 rounded ${i % 4 === 3 ? "w-2/3" : "w-full"}`}
            />
          ))}
        </div>
      </div>
    </article>
  );
}
