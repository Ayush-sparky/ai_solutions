import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import { getParam, parsePage, paginate, PAGE_SIZE } from "@/lib/pagination";
import AdminSearch from "@/components/admin/AdminSearch";
import Pagination from "@/components/admin/Pagination";
import FutureInterestTable from "./FutureInterestTable";
import { deleteFutureInterest } from "./actions";

export const metadata = { title: "Future interest" };

// Case-insensitive search across name, email, area of interest, and message.
function searchWhere(q) {
  if (!q) return {};
  const contains = { contains: q, mode: "insensitive" };
  return {
    OR: [
      { name: contains },
      { email: contains },
      { areaOfInterest: contains },
      { message: contains },
    ],
  };
}

export default async function FutureInterestPage({ searchParams }) {
  const sp = await searchParams;
  const q = getParam(sp?.q);
  const where = searchWhere(q);

  let entries = [];
  let total = 0;
  let pageInfo = paginate(1, 0, PAGE_SIZE);

  try {
    total = await prisma.futureInterest.count({ where });
    pageInfo = paginate(parsePage(sp?.page), total, PAGE_SIZE);
    entries = await prisma.futureInterest.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: pageInfo.skip,
      take: pageInfo.take,
    });
  } catch (error) {
    console.error("Failed to load future-interest entries:", error);
  }

  // Only serializable fields cross to the client component.
  const rows = entries.map((entry) => ({
    id: entry.id,
    name: entry.name,
    email: entry.email,
    areaOfInterest: entry.areaOfInterest,
    message: entry.message,
    dateLabel: formatDate(entry.createdAt),
  }));

  return (
    <div className="p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Future interest</h1>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-sm font-medium text-slate-600">
          {total}
        </span>
      </div>
      <p className="mt-1 text-sm text-slate-500">
        People who asked to hear about future offerings, newest first.
      </p>

      <div className="mt-6">
        <AdminSearch placeholder="Search name, email, interest…" />
      </div>

      <div className="mt-6">
        <FutureInterestTable rows={rows} deleteAction={deleteFutureInterest} query={q} />
      </div>

      <Pagination
        basePath="/admin/future-interest"
        params={{ q }}
        page={pageInfo.current}
        totalPages={pageInfo.totalPages}
        total={total}
        from={pageInfo.from}
        to={pageInfo.to}
        unit="entry"
        unitPlural="entries"
      />
    </div>
  );
}
