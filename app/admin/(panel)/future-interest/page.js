import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import FutureInterestTable from "./FutureInterestTable";

export const metadata = { title: "Future interest" };

async function getEntries() {
  try {
    return await prisma.futureInterest.findMany({ orderBy: { createdAt: "desc" } });
  } catch (error) {
    console.error("Failed to load future-interest entries:", error);
    return [];
  }
}

export default async function FutureInterestPage() {
  const entries = await getEntries();

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
          {rows.length}
        </span>
      </div>
      <p className="mt-1 text-sm text-slate-500">
        People who asked to hear about future offerings, newest first.
      </p>

      <div className="mt-8">
        <FutureInterestTable rows={rows} />
      </div>
    </div>
  );
}
