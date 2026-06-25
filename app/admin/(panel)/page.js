import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Dashboard" };

async function getStats() {
  try {
    const [inquiries, reviews, pendingReviews, futureInterest] = await Promise.all([
      prisma.inquiry.count(),
      prisma.review.count(),
      prisma.review.count({ where: { status: "PENDING" } }),
      prisma.futureInterest.count(),
    ]);
    return { inquiries, reviews, pendingReviews, futureInterest };
  } catch (error) {
    console.error("Failed to load admin stats:", error);
    return null;
  }
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  const cards = [
    {
      label: "Total inquiries",
      value: stats?.inquiries,
      href: "/admin/inquiries",
      iconPath:
        "M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75",
    },
    {
      label: "Total reviews",
      value: stats?.reviews,
      href: "/admin/reviews",
      iconPath:
        "M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z",
    },
    {
      label: "Pending reviews",
      value: stats?.pendingReviews,
      href: "/admin/reviews",
      accent: true,
      iconPath: "M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
    },
    {
      label: "Future interest",
      value: stats?.futureInterest,
      href: "/admin/future-interest",
      iconPath:
        "M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0",
    },
  ];

  return (
    <div className="p-6 sm:p-8">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500">
        Overview of activity across the site.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const needsAttention = card.accent && (card.value ?? 0) > 0;
          return (
            <Link
              key={card.label}
              href={card.href}
              className={`group rounded-2xl border bg-white p-6 transition-shadow hover:shadow-md ${
                needsAttention ? "border-amber-300" : "border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">{card.label}</span>
                <span
                  className={`grid h-9 w-9 place-items-center rounded-lg ${
                    card.accent
                      ? "bg-amber-50 text-amber-600"
                      : "bg-indigo-50 text-indigo-600"
                  }`}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d={card.iconPath} />
                  </svg>
                </span>
              </div>
              <div className="mt-4 text-3xl font-bold text-slate-900">
                {card.value ?? "—"}
              </div>
              {needsAttention ? (
                <span className="mt-2 inline-block text-xs font-medium text-amber-600">
                  Awaiting moderation
                </span>
              ) : null}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
