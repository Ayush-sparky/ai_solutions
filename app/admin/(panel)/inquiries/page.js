import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import InquiriesTable from "./InquiriesTable";

export const metadata = { title: "Inquiries" };

async function getInquiries() {
  try {
    return await prisma.inquiry.findMany({ orderBy: { createdAt: "desc" } });
  } catch (error) {
    console.error("Failed to load inquiries:", error);
    return [];
  }
}

export default async function InquiriesPage() {
  const inquiries = await getInquiries();

  // Only serializable fields cross to the client component.
  const rows = inquiries.map((inquiry) => ({
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
          {rows.length}
        </span>
      </div>
      <p className="mt-1 text-sm text-slate-500">
        Contact form submissions, newest first.
      </p>

      <div className="mt-8">
        <InquiriesTable rows={rows} />
      </div>
    </div>
  );
}
