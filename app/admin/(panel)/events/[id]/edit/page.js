import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateEvent } from "../../actions";
import EventForm from "../../EventForm";

export const metadata = { title: "Edit event" };

// Format a stored Date to the datetime-local value (UTC wall-clock).
function toDateTimeLocal(date) {
  return new Date(date).toISOString().slice(0, 16);
}

export default async function EditEventPage({ params }) {
  const { id } = await params;
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) notFound();

  const initial = {
    id: event.id,
    title: event.title,
    slug: event.slug,
    description: event.description,
    location: event.location,
    eventDate: toDateTimeLocal(event.eventDate),
  };

  return (
    <div className="p-6 sm:p-8">
      <Link href="/admin/events" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
        &larr; Events
      </Link>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">Edit event</h1>

      <div className="mt-6 max-w-2xl">
        <EventForm action={updateEvent} initial={initial} submitLabel="Save changes" />
      </div>
    </div>
  );
}
