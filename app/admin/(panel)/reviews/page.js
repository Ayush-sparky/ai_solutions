import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import StarRating from "@/components/StarRating";
import { setReviewStatus } from "./actions";

export const metadata = { title: "Reviews" };

const FILTERS = [
  { label: "All", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
];

const BADGE = {
  PENDING: "bg-amber-50 text-amber-700 ring-amber-600/20",
  APPROVED: "bg-green-50 text-green-700 ring-green-600/20",
  REJECTED: "bg-red-50 text-red-700 ring-red-600/20",
};
const BADGE_LABEL = { PENDING: "Pending", APPROVED: "Approved", REJECTED: "Rejected" };

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${BADGE[status]}`}
    >
      {BADGE_LABEL[status]}
    </span>
  );
}

export default async function AdminReviewsPage({ searchParams }) {
  const sp = await searchParams;
  const requested = typeof sp?.status === "string" ? sp.status : "ALL";
  const filter = FILTERS.some((f) => f.value === requested) ? requested : "ALL";
  const where = filter === "ALL" ? {} : { status: filter };

  let reviews = [];
  let counts = { ALL: 0, PENDING: 0, APPROVED: 0, REJECTED: 0 };
  try {
    const [list, all, pending, approved, rejected] = await Promise.all([
      prisma.review.findMany({ where, orderBy: { createdAt: "desc" } }),
      prisma.review.count(),
      prisma.review.count({ where: { status: "PENDING" } }),
      prisma.review.count({ where: { status: "APPROVED" } }),
      prisma.review.count({ where: { status: "REJECTED" } }),
    ]);
    reviews = list;
    counts = { ALL: all, PENDING: pending, APPROVED: approved, REJECTED: rejected };
  } catch (error) {
    console.error("Failed to load reviews:", error);
  }

  return (
    <div className="p-6 sm:p-8">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Reviews</h1>
      <p className="mt-1 text-sm text-slate-500">
        Moderate customer reviews. Approved reviews appear on the public reviews page.
      </p>

      {/* Status filter */}
      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const active = filter === f.value;
          const href = f.value === "ALL" ? "/admin/reviews" : `/admin/reviews?status=${f.value}`;
          return (
            <Link
              key={f.value}
              href={href}
              className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-medium ${
                active
                  ? "bg-indigo-600 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {f.label}
              <span
                className={`rounded-full px-1.5 text-xs ${
                  active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                }`}
              >
                {counts[f.value]}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Reviews */}
      <div className="mt-6 space-y-4">
        {reviews.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
            No reviews in this view.
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">
                      {review.authorName}
                    </span>
                    <StatusBadge status={review.status} />
                  </div>
                  <div className="mt-0.5 text-sm text-slate-500">
                    <a
                      href={`mailto:${review.email}`}
                      className="text-indigo-600 hover:text-indigo-500"
                    >
                      {review.email}
                    </a>{" "}
                    · {formatDate(review.createdAt)}
                  </div>
                </div>
                <StarRating rating={review.rating} />
              </div>

              <p className="mt-3 whitespace-pre-line text-slate-700">
                {review.content}
              </p>

              {review.status === "PENDING" ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  <form action={setReviewStatus}>
                    <input type="hidden" name="id" value={review.id} />
                    <input type="hidden" name="status" value="APPROVED" />
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-green-500"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                      Approve
                    </button>
                  </form>
                  <form action={setReviewStatus}>
                    <input type="hidden" name="id" value={review.id} />
                    <input type="hidden" name="status" value="REJECTED" />
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                      Reject
                    </button>
                  </form>
                </div>
              ) : null}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
