import PageHero from "@/components/PageHero";
import { Skeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <>
      <PageHero
        eyebrow="Events"
        title="Upcoming events"
        subtitle="Webinars, workshops, and conferences where you can see AI-Solutions in action."
      />
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <ul className="space-y-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <li
                key={i}
                className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 sm:flex-row sm:items-start"
              >
                <Skeleton className="h-16 w-16 shrink-0 rounded-xl" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-6 w-2/3 rounded" />
                  <Skeleton className="h-4 w-1/2 rounded" />
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-4 w-4/5 rounded" />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
