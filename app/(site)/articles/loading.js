import PageHero from "@/components/PageHero";
import { CardSkeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <>
      <PageHero
        eyebrow="Articles"
        title="Insights from the AI-Solutions team"
        subtitle="Case studies, practical guides, and our take on making AI work in the real world."
      />
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
