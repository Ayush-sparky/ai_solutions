import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate, formatTime } from "@/lib/format";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import { deleteEvent } from "./actions";

export const metadata = { title: "Events" };

async function getEvents() {
  try {
    return await prisma.event.findMany({ orderBy: { eventDate: "asc" } });
  } catch (error) {
    console.error("Failed to load events:", error);
    return [];
  }
}

export default async function AdminEventsPage() {
  const events = await getEvents();

  return (
    <div className="p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Events</h1>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-sm font-medium text-slate-600">
            {events.length}
          </span>
        </div>
        <Link
          href="/admin/events/new"
          className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          <span aria-hidden="true">+</span> New event
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {events.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500">
            No events yet. Create your first one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Title</th>
                  <th scope="col" className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Date (UTC)</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Location</th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-slate-50/75">
                    <td className="px-4 py-3 font-medium text-slate-900">{event.title}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                      {formatDate(event.eventDate)} · {formatTime(event.eventDate)}
                    </td>
                    <td className="px-4 py-3 text-slate-700">{event.location}</td>
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
