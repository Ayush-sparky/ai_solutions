import Link from "next/link";
import { prisma } from "@/lib/prisma";
import StarRating from "@/components/StarRating";
import { services } from "@/lib/services";

// Always render with fresh, live review data (and avoid a build-time DB call).
export const dynamic = "force-dynamic";

async function getLatestApprovedReviews() {
  try {
    return await prisma.review.findMany({
      where: { status: "APPROVED" },
      orderBy: { createdAt: "desc" },
      take: 3,
    });
  } catch (error) {
    // A database hiccup shouldn't take down the homepage.
    console.error("Failed to load reviews for homepage:", error);
    return [];
  }
}

export default async function Home() {
  const reviews = await getLatestApprovedReviews();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-900 text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-indigo-600/30 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-indigo-200">
              AI consulting &amp; automation
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Put AI to work for your business.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              AI-Solutions helps companies cut costs, automate the busywork, and
              build custom AI products — from first idea to production. No hype,
              just measurable results.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-7 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500"
              >
                Get started
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-7 py-3 text-base font-semibold text-white transition-colors hover:bg-white/10"
              >
                Explore services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services highlight */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              What we do
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Services built around your goals
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Whether you&apos;re exploring your first use case or scaling AI
              across the company, we meet you where you are.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.slug}
                className="group rounded-2xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-lg"
              >
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d={service.iconPath} />
                  </svg>
                </div>
                <h3 className="mt-5 text-lg font-semibold text-slate-900">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {service.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/services"
              className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-500"
            >
              View all services
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="bg-slate-50 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              Testimonials
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              What our clients say
            </h2>
          </div>

          {reviews.length > 0 ? (
            <>
              <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {reviews.map((review) => (
                  <figure
                    key={review.id}
                    className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <StarRating rating={review.rating} />
                    <blockquote className="mt-4 flex-1 text-slate-700">
                      &ldquo;{review.content}&rdquo;
                    </blockquote>
                    <figcaption className="mt-6 border-t border-slate-100 pt-4">
                      <div className="font-semibold text-slate-900">
                        {review.authorName}
                      </div>
                      <div className="text-sm text-slate-500">Verified client</div>
                    </figcaption>
                  </figure>
                ))}
              </div>
              <div className="mt-12 text-center">
                <Link
                  href="/reviews"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Read all reviews
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </>
          ) : (
            <p className="mt-12 text-center text-slate-500">
              Client reviews are coming soon.
            </p>
          )}
        </div>
      </section>

      {/* Call to action */}
      <section className="bg-indigo-600">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to put AI to work?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-indigo-100">
            Tell us about your goals and we&apos;ll show you what&apos;s possible.
            No commitment, no jargon.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3 text-base font-semibold text-indigo-700 shadow-sm transition-colors hover:bg-indigo-50"
            >
              Get in touch
            </Link>
            <Link
              href="/articles"
              className="inline-flex items-center justify-center rounded-full border border-white/40 px-7 py-3 text-base font-semibold text-white transition-colors hover:bg-white/10"
            >
              Read our articles
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
