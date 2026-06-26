import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate, timeAgo } from "@/lib/format";
import { getParam, parsePage, paginate, PAGE_SIZE } from "@/lib/pagination";
import AdminSearch from "@/components/admin/AdminSearch";
import Pagination from "@/components/admin/Pagination";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import { deleteRegistration } from "./actions";

export const metadata = { title: "Event registrations" };

// Case-insensitive search across the registrant's name, email, and company.
function searchWhere(q) {
  if (!q) return {};
  const contains = { contains: q, mode: "insensitive" };
  return { OR: [{ name: contains }, { email: contains }, { company: contains }] };
}

export default async function EventRegistrationsPage({ searchParams }) {
  const sp = await searchParams;
  const eventId = getParam(sp?.eventId);
  const q = getParam(sp?.q);

  // Optionally scoped to a single event via ?eventId=, combined with search.
  const where = {
    AND: [eventId ? { eventId } : {}, searchWhere(q)],
  };

  let registrations = [];
  let total = 0;
  let scopedEvent = null;
  let pageInfo = paginate(1, 0, PAGE_SIZE);

  try {
    total = await prisma.eventRegistration.count({ where });
    pageInfo = paginate(parsePage(sp?.page), total, PAGE_SIZE);
    registrations = await prisma.eventRegistration.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: pageInfo.skip,
      take: pageInfo.take,
      include: { event: { select: { title: true, slug: true } } },
    });
    // Resolve the scoped event's title independently of the page/search so the
    // heading stays correct even on an empty page of results.
    if (eventId) {
      scopedEvent = await prisma.event.findUnique({
        where: { id: eventId },
        select: { title: true },
      });
    }
  } catch (error) {
    console.error("Failed to load event registrations:", error);
  }

  return (
    <div className="p-6 sm:p-8">
      <Link href="/admin/events" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
        &larr; Events
      </Link>

      <div className="mt-2 flex items-center gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Event registrations
        </h1>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-sm font-medium text-slate-600">
          {total}
        </span>
      </div>
      <p className="mt-1 text-sm text-slate-500">
        {eventId
          ? scopedEvent
            ? `Sign-ups for "${scopedEvent.title}".`
            : "Sign-ups for this event."
          : "Forms submitted by visitors for upcoming events, newest first."}
      </p>

      {eventId ? (
        <Link
          href="/admin/events/registrations"
          className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          <span aria-hidden="true">&times;</span> Clear filter — show all registrations
        </Link>
      ) : null}

      <div className="mt-6">
        <AdminSearch placeholder="Search name, email, company…" />
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {registrations.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500">
            {q ? `No registrations match “${q}”.` : "No registrations yet."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Name</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Email</th>
                  {eventId ? null : (
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Event</th>
                  )}
                  <th scope="col" className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Submitted</th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {registrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-slate-50/75">
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900">
                      {reg.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <a
                        href={`mailto:${reg.email}`}
                        className="text-indigo-600 hover:text-indigo-500"
                      >
                        {reg.email}
                      </a>
                    </td>
                    {eventId ? null : (
                      <td className="px-4 py-3 text-slate-700">{reg.event?.title ?? "—"}</td>
                    )}
                    <td className="whitespace-nowrap px-4 py-3 text-slate-500" title={formatDate(reg.createdAt)}>
                      {timeAgo(reg.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/events/registrations/${reg.id}`}
                          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
                        >
                          View
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                          </svg>
                        </Link>
                        <ConfirmDeleteButton action={deleteRegistration} id={reg.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Pagination
        basePath="/admin/events/registrations"
        params={{ q, eventId }}
        page={pageInfo.current}
        totalPages={pageInfo.totalPages}
        total={total}
        from={pageInfo.from}
        to={pageInfo.to}
        unit="registration"
      />
    </div>
  );
}
