import PageHero from "@/components/PageHero";
import { Skeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="A look inside AI-Solutions"
        subtitle="Our team, our events, and the work we&rsquo;re proud of."
      />
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
