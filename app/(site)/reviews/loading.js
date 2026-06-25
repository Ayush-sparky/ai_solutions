import PageHero from "@/components/PageHero";
import { Skeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <>
      <PageHero
        eyebrow="Reviews"
        title="What our clients say"
        subtitle="Real feedback from the teams we've worked with — and a place to share yours."
      />
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-5 w-48 rounded" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <Skeleton className="h-4 w-24 rounded" />
                <div className="mt-4 space-y-2">
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-4 w-2/3 rounded" />
                </div>
                <div className="mt-6 border-t border-slate-100 pt-4">
                  <Skeleton className="h-4 w-32 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
