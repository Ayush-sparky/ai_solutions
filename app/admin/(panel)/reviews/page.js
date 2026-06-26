import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import { getParam, parsePage, paginate, PAGE_SIZE } from "@/lib/pagination";
import StarRating from "@/components/StarRating";
import AdminSearch from "@/components/admin/AdminSearch";
import FilterChips from "@/components/admin/FilterChips";
import Pagination from "@/components/admin/Pagination";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import { setReviewStatus, deleteReview } from "./actions";

export const metadata = { title: "Reviews" };

const STATUSES = ["PENDING", "APPROVED", "REJECTED"];

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

// Case-insensitive search across the author, email, and review body.
function searchWhere(q) {
  if (!q) return {};
  const contains = { contains: q, mode: "insensitive" };
  return { OR: [{ authorName: contains }, { email: contains }, { content: contains }] };
}

export default async function AdminReviewsPage({ searchParams }) {
  const sp = await searchParams;
  const requested = getParam(sp?.status).toUpperCase();
  const filter = STATUSES.includes(requested) ? requested : "ALL";
  const q = getParam(sp?.q);

  const base = searchWhere(q);
  const where = filter === "ALL" ? base : { AND: [base, { status: filter }] };

  let reviews = [];
  let total = 0;
  let counts = { ALL: 0, PENDING: 0, APPROVED: 0, REJECTED: 0 };
  let pageInfo = paginate(1, 0, PAGE_SIZE);

  try {
    // Counts reflect the active search so the chips match what's shown.
    const [all, pending, approved, rejected] = await Promise.all([
      prisma.review.count({ where: base }),
      prisma.review.count({ where: { AND: [base, { status: "PENDING" }] } }),
      prisma.review.count({ where: { AND: [base, { status: "APPROVED" }] } }),
      prisma.review.count({ where: { AND: [base, { status: "REJECTED" }] } }),
    ]);
    counts = { ALL: all, PENDING: pending, APPROVED: approved, REJECTED: rejected };
    total = counts[filter] ?? all;

    pageInfo = paginate(parsePage(sp?.page), total, PAGE_SIZE);
    reviews = await prisma.review.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: pageInfo.skip,
      take: pageInfo.take,
    });
  } catch (error) {
    console.error("Failed to load reviews:", error);
  }

  const filterOptions = [
    { label: "All", value: "ALL", count: counts.ALL },
    { label: "Pending", value: "PENDING", count: counts.PENDING },
    { label: "Approved", value: "APPROVED", count: counts.APPROVED },
    { label: "Rejected", value: "REJECTED", count: counts.REJECTED },
  ];

  return (
    <div className="p-6 sm:p-8">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Reviews</h1>
      <p className="mt-1 text-sm text-slate-500">
        Moderate customer reviews. Approved reviews appear on the public reviews page.
      </p>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <FilterChips
          basePath="/admin/reviews"
          paramKey="status"
          active={filter}
          defaultValue="ALL"
          options={filterOptions}
          params={{ q }}
        />
        <AdminSearch placeholder="Search author, email, content…" />
      </div>

      <div className="mt-6 space-y-4">
        {reviews.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
            {q ? `No reviews match “${q}”.` : "No reviews in this view."}
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

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {review.status === "PENDING" ? (
                  <>
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
                  </>
                ) : null}
                <div className="ml-auto">
                  <ConfirmDeleteButton action={deleteReview} id={review.id} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Pagination
        basePath="/admin/reviews"
        params={{ q, status: filter === "ALL" ? undefined : filter }}
        page={pageInfo.current}
        totalPages={pageInfo.totalPages}
        total={total}
        from={pageInfo.from}
        to={pageInfo.to}
        unit="review"
      />
    </div>
  );
}
