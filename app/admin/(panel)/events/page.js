import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate, formatTime, isUpcoming } from "@/lib/format";
import { getParam, parsePage, paginate, PAGE_SIZE } from "@/lib/pagination";
import AdminSearch from "@/components/admin/AdminSearch";
import FilterChips from "@/components/admin/FilterChips";
import Pagination from "@/components/admin/Pagination";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import { deleteEvent } from "./actions";

export const metadata = { title: "Events" };

// Case-insensitive search across title, location, and description.
function searchWhere(q) {
  if (!q) return {};
  const contains = { contains: q, mode: "insensitive" };
  return { OR: [{ title: contains }, { location: contains }, { description: contains }] };
}

export default async function AdminEventsPage({ searchParams }) {
  const sp = await searchParams;
  const q = getParam(sp?.q);
  const requested = getParam(sp?.status).toLowerCase();
  const filter = ["upcoming", "past"].includes(requested) ? requested : "all";

  // Single "now" boundary shared by the filter and the counts.
  const now = new Date();
  const base = searchWhere(q);
  const timeWhere =
    filter === "upcoming"
      ? { eventDate: { gte: now } }
      : filter === "past"
        ? { eventDate: { lt: now } }
        : {};
  const where = { AND: [base, timeWhere] };
  // Upcoming events read best soonest-first; past events most-recent-first.
  const orderBy = { eventDate: filter === "past" ? "desc" : "asc" };

  let events = [];
  let total = 0;
  let totalRegistrations = 0;
  let counts = { all: 0, upcoming: 0, past: 0 };
  let pageInfo = paginate(1, 0, PAGE_SIZE);

  try {
    const [all, upcoming, regAgg] = await Promise.all([
      prisma.event.count({ where: base }),
      prisma.event.count({ where: { AND: [base, { eventDate: { gte: now } }] } }),
      prisma.eventRegistration.count(),
    ]);
    counts = { all, upcoming, past: all - upcoming };
    totalRegistrations = regAgg;
    total = counts[filter] ?? all;

    pageInfo = paginate(parsePage(sp?.page), total, PAGE_SIZE);
    const rows = await prisma.event.findMany({
      where,
      orderBy,
      skip: pageInfo.skip,
      take: pageInfo.take,
      include: { _count: { select: { registrations: true } } },
    });
    events = rows.map((event) => ({
      ...event,
      isUpcoming: isUpcoming(event.eventDate),
      registrationCount: event._count.registrations,
    }));
  } catch (error) {
    console.error("Failed to load events:", error);
  }

  const filterOptions = [
    { label: "All", value: "all", count: counts.all },
    { label: "Upcoming", value: "upcoming", count: counts.upcoming },
    { label: "Past", value: "past", count: counts.past },
  ];

  return (
    <div className="p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Events</h1>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-sm font-medium text-slate-600">
            {counts.all}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/events/registrations"
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.7} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
            </svg>
            Registrations
            {totalRegistrations > 0 ? (
              <span className="rounded-full bg-slate-100 px-1.5 text-xs font-bold text-slate-600">
                {totalRegistrations}
              </span>
            ) : null}
          </Link>
          <Link
            href="/admin/events/new"
            className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            <span aria-hidden="true">+</span> New event
          </Link>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <FilterChips
          basePath="/admin/events"
          paramKey="status"
          active={filter}
          defaultValue="all"
          options={filterOptions}
          params={{ q }}
        />
        <AdminSearch placeholder="Search title or location…" />
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {events.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500">
            {q ? `No events match “${q}”.` : "No events in this view."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Title</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
                  <th scope="col" className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Date (UTC)</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Location</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Registrations</th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {events.map((event) => {
                  const count = event.registrationCount;
                  return (
                    <tr key={event.id} className="hover:bg-slate-50/75">
                      <td className="px-4 py-3 font-medium text-slate-900">{event.title}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            event.isUpcoming
                              ? "bg-indigo-50 text-indigo-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {event.isUpcoming ? "Upcoming" : "Past"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                        {formatDate(event.eventDate)} · {formatTime(event.eventDate)}
                      </td>
                      <td className="px-4 py-3 text-slate-700">{event.location}</td>
                      <td className="px-4 py-3">
                        {count > 0 ? (
                          <Link
                            href={`/admin/events/registrations?eventId=${event.id}`}
                            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
                          >
                            {count} {count === 1 ? "sign-up" : "sign-ups"}
                          </Link>
                        ) : (
                          <span className="text-sm text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/admin/events/${event.id}/edit`}
                            className="rounded-lg px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
                          >
                            Edit
                          </Link>
                          <ConfirmDeleteButton action={deleteEvent} id={event.id} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Pagination
        basePath="/admin/events"
        params={{ q, status: filter === "all" ? undefined : filter }}
        page={pageInfo.current}
        totalPages={pageInfo.totalPages}
        total={total}
        from={pageInfo.from}
        to={pageInfo.to}
        unit="event"
      />
    </div>
  );
}
