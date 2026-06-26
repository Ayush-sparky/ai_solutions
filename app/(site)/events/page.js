import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PageHero from "@/components/PageHero";
import { formatDate, formatTime, excerpt } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Events",
  description:
    "Upcoming AI-Solutions webinars, workshops, and conferences — register to join — plus a look back at past events.",
};

// Split all events into upcoming (eventDate in the future) and past, each
// ordered for its section: upcoming soonest-first, past most-recent-first.
async function getEvents() {
  try {
    const events = await prisma.event.findMany({ orderBy: { eventDate: "asc" } });
    const now = Date.now();
    const upcoming = [];
    const past = [];
    for (const event of events) {
      if (new Date(event.eventDate).getTime() >= now) upcoming.push(event);
      else past.push(event);
    }
    past.reverse(); // most recent past event first
    return { upcoming, past };
  } catch (error) {
    console.error("Failed to load events:", error);
    return { upcoming: [], past: [] };
  }
}

function ClockIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </svg>
  );
}

function EventCard({ event, variant }) {
  const isUpcoming = variant === "upcoming";
  const month = new Date(event.eventDate).toLocaleDateString("en-US", {
    month: "short",
    timeZone: "UTC",
  });
  const day = new Date(event.eventDate).toLocaleDateString("en-US", {
    day: "numeric",
    timeZone: "UTC",
  });

  return (
    <li
      className={`flex flex-col gap-5 rounded-2xl border bg-white p-6 transition-shadow hover:shadow-lg sm:flex-row sm:items-start ${
        isUpcoming ? "border-slate-200" : "border-slate-200/70"
      }`}
    >
      {/* Date badge */}
      <div
        className={`flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl ${
          isUpcoming ? "bg-indigo-50 text-indigo-700" : "bg-slate-100 text-slate-500"
        }`}
      >
        <span className="text-xs font-semibold uppercase tracking-wide">{month}</span>
        <span className="text-2xl font-bold leading-none">{day}</span>
      </div>

      {/* Details */}
      <div className="flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className={`text-xl font-semibold ${isUpcoming ? "text-slate-900" : "text-slate-700"}`}>
            <Link href={`/events/${event.slug}`} className="hover:text-indigo-600">
              {event.title}
            </Link>
          </h3>
          {!isUpcoming ? (
            <span className="mt-1 shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
              Ended
            </span>
          ) : null}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <ClockIcon />
            {formatDate(event.eventDate)} &middot; {formatTime(event.eventDate)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <PinIcon />
            {event.location}
          </span>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-600">{excerpt(event.description, 180)}</p>

        <div className="mt-4">
          {isUpcoming ? (
            <Link
              href={`/events/${event.slug}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
            >
              Register
              <span aria-hidden="true">&rarr;</span>
            </Link>
          ) : (
            <Link
              href={`/events/${event.slug}`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-500"
            >
              View details
              <span aria-hidden="true">&rarr;</span>
            </Link>
          )}
        </div>
      </div>
    </li>
  );
}

export default async function EventsPage() {
  const { upcoming, past } = await getEvents();

  return (
    <>
      <PageHero
        eyebrow="Events"
        title="Events"
        subtitle="Webinars, workshops, and conferences where you can see AI-Solutions in action. Register for what's coming up, or revisit what you missed."
      />

      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Upcoming */}
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Upcoming events</h2>
            {upcoming.length > 0 ? (
              <ul className="mt-6 space-y-6">
                {upcoming.map((event) => (
                  <EventCard key={event.id} event={event} variant="upcoming" />
                ))}
              </ul>
            ) : (
              <p className="mt-6 rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-500">
                No upcoming events right now. Check back soon.
              </p>
            )}
          </div>

          {/* Past */}
          {past.length > 0 ? (
            <div className="mt-16">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">Past events</h2>
              <ul className="mt-6 space-y-6">
                {past.map((event) => (
                  <EventCard key={event.id} event={event} variant="past" />
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
