import Link from "next/link";
import { createEvent } from "../actions";
import EventForm from "../EventForm";

export const metadata = { title: "New event" };

export default function NewEventPage() {
  return (
    <div className="p-6 sm:p-8">
      <Link href="/admin/events" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
        &larr; Events
      </Link>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">New event</h1>

      <div className="mt-6 max-w-2xl">
        <EventForm action={createEvent} submitLabel="Create event" />
      </div>
    </div>
  );
}
