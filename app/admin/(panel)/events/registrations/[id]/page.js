import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDate, formatTime, isUpcoming } from "@/lib/format";

export const metadata = { title: "Registration" };

async function getRegistration(id) {
  try {
    return await prisma.eventRegistration.findUnique({
      where: { id },
      include: {
        event: { select: { id: true, title: true, slug: true, eventDate: true, location: true } },
      },
    });
  } catch (error) {
    console.error("Failed to load registration:", error);
    return null;
  }
}

function Detail({ label, children }) {
  return (
    <div className="px-5 py-4">
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm text-slate-900">{children}</dd>
    </div>
  );
}

export default async function RegistrationDetailPage({ params }) {
  const { id } = await params;
  const reg = await getRegistration(id);

  if (!reg) notFound();

  const event = reg.event;
  const upcoming = event ? isUpcoming(event.eventDate) : false;

  return (
    <div className="p-6 sm:p-8">
      <Link
        href="/admin/events/registrations"
        className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
      >
        &larr; All registrations
      </Link>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{reg.name}</h1>
        <span className="text-sm text-slate-500">
          Submitted {formatDate(reg.createdAt)} · {formatTime(reg.createdAt)}
        </span>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Registrant details */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="border-b border-slate-100 px-5 py-3">
              <h2 className="text-sm font-semibold text-slate-900">Registrant</h2>
            </div>
            <dl className="divide-y divide-slate-100">
              <Detail label="Full name">{reg.name}</Detail>
              <Detail label="Email">
                <a href={`mailto:${reg.email}`} className="text-indigo-600 hover:text-indigo-500">
                  {reg.email}
                </a>
              </Detail>
              <Detail label="Phone">
                {reg.phone ? (
                  <a href={`tel:${reg.phone}`} className="text-indigo-600 hover:text-indigo-500">
                    {reg.phone}
                  </a>
                ) : (
                  <span className="text-slate-400">Not provided</span>
                )}
              </Detail>
              <Detail label="Company">
                {reg.company || <span className="text-slate-400">Not provided</span>}
              </Detail>
              <Detail label="Note">
                {reg.message ? (
                  <p className="max-w-2xl whitespace-pre-line leading-6 text-slate-700">
                    {reg.message}
                  </p>
                ) : (
                  <span className="text-slate-400">No message</span>
                )}
              </Detail>
            </dl>
          </div>
        </div>

        {/* Event context */}
        <div>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="border-b border-slate-100 px-5 py-3">
              <h2 className="text-sm font-semibold text-slate-900">Event</h2>
            </div>
            {event ? (
              <div className="px-5 py-4">
                <p className="text-sm font-semibold text-slate-900">{event.title}</p>
                <span
                  className={`mt-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    upcoming ? "bg-indigo-50 text-indigo-700" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {upcoming ? "Upcoming" : "Past"}
                </span>
                <dl className="mt-4 space-y-3 text-sm">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">When</dt>
                    <dd className="mt-0.5 text-slate-700">
                      {formatDate(event.eventDate)} · {formatTime(event.eventDate)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Where</dt>
                    <dd className="mt-0.5 text-slate-700">{event.location}</dd>
                  </div>
                </dl>
                <div className="mt-5 flex flex-col gap-2">
                  <Link
                    href={`/admin/events/registrations?eventId=${event.id}`}
                    className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    All sign-ups for this event
                  </Link>
                  <Link
                    href={`/events/${event.slug}`}
                    className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View public event page ↗
                  </Link>
                </div>
              </div>
            ) : (
              <div className="px-5 py-4 text-sm text-slate-500">
                The associated event has been deleted.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
