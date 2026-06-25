import { prisma } from "@/lib/prisma";
import PageHero from "@/components/PageHero";
import StarRating from "@/components/StarRating";
import { formatDate } from "@/lib/format";
import ReviewForm from "./ReviewForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Reviews",
  description:
    "Read what clients say about working with AI-Solutions, and share your own experience.",
};

async function getApprovedReviews() {
  try {
    return await prisma.review.findMany({
      where: { status: "APPROVED" },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to load reviews:", error);
    return [];
  }
}

export default async function ReviewsPage() {
  const reviews = await getApprovedReviews();
  const average =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <>
      <PageHero
        eyebrow="Reviews"
        title="What our clients say"
        subtitle="Real feedback from the teams we've worked with — and a place to share yours."
      />

      {/* Approved reviews */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {reviews.length > 0 ? (
            <>
              <div className="flex flex-wrap items-center gap-3">
                <StarRating rating={Math.round(average)} />
                <span className="text-sm text-slate-600">
                  {average.toFixed(1)} average ·{" "}
                  {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                </span>
              </div>

              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                      <div className="text-sm text-slate-500">
                        {formatDate(review.createdAt)}
                      </div>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </>
          ) : (
            <p className="text-center text-slate-500">
              No reviews yet — be the first to share your experience below.
            </p>
          )}
        </div>
      </section>

      {/* Submit a review */}
      <section className="bg-slate-50 py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Share your experience
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-slate-600">
              Worked with us? We&apos;d love to hear about it. Submitted reviews
              are published once our team has approved them.
            </p>
          </div>

          <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <ReviewForm />
          </div>
        </div>
      </section>
    </>
  );
}
