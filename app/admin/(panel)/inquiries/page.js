import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import { getParam, parsePage, paginate, PAGE_SIZE } from "@/lib/pagination";
import AdminSearch from "@/components/admin/AdminSearch";
import Pagination from "@/components/admin/Pagination";
import InquiriesTable from "./InquiriesTable";
import { deleteInquiry } from "./actions";

export const metadata = { title: "Inquiries" };

// Case-insensitive search across the lead's most identifying text fields.
function buildWhere(q) {
  if (!q) return {};
  const contains = { contains: q, mode: "insensitive" };
  return {
    OR: [
      { name: contains },
      { email: contains },
      { company: contains },
      { country: contains },
      { jobTitle: contains },
    ],
  };
}

async function getInquiries(where, skip, take) {
  try {
    const [items, total] = await Promise.all([
      prisma.inquiry.findMany({ where, orderBy: { createdAt: "desc" }, skip, take }),
      prisma.inquiry.count({ where }),
    ]);
    return { items, total };
  } catch (error) {
    console.error("Failed to load inquiries:", error);
    return { items: [], total: 0 };
  }
}

export default async function InquiriesPage({ searchParams }) {
  const sp = await searchParams;
  const q = getParam(sp?.q);
  const where = buildWhere(q);

  // Count first so we can clamp an out-of-range ?page= before querying rows.
  const total = await prisma.inquiry.count({ where }).catch(() => 0);
  const { current, skip, take, from, to, totalPages } = paginate(
    parsePage(sp?.page),
    total,
    PAGE_SIZE
  );

  const { items } = await getInquiries(where, skip, take);

  // Only serializable fields cross to the client component.
  const rows = items.map((inquiry) => ({
    id: inquiry.id,
    name: inquiry.name,
    email: inquiry.email,
    company: inquiry.company,
    country: inquiry.country,
    jobTitle: inquiry.jobTitle,
    jobDetails: inquiry.jobDetails,
    dateLabel: formatDate(inquiry.createdAt),
  }));

  return (
    <div className="p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Inquiries</h1>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-sm font-medium text-slate-600">
          {total}
        </span>
      </div>
      <p className="mt-1 text-sm text-slate-500">
        Contact form submissions, newest first.
      </p>

      <div className="mt-6">
        <AdminSearch placeholder="Search name, email, company…" />
      </div>

      <div className="mt-6">
        <InquiriesTable rows={rows} deleteAction={deleteInquiry} query={q} />
      </div>

      <Pagination
        basePath="/admin/inquiries"
        params={{ q }}
        page={current}
        totalPages={totalPages}
        total={total}
        from={from}
        to={to}
        unit="inquiry"
        unitPlural="inquiries"
      />
    </div>
  );
}
