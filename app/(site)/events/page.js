import { prisma } from "@/lib/prisma";
import PageHero from "@/components/PageHero";
import { formatDate, formatTime } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Events",
  description:
    "Upcoming AI-Solutions webinars, workshops, and conferences. Join us to see AI in practice.",
};

async function getUpcomingEvents() {
  try {
    return await prisma.event.findMany({
      where: { eventDate: { gte: new Date() } },
      orderBy: { eventDate: "asc" },
    });
  } catch (error) {
    console.error("Failed to load events:", error);
    return [];
  }
}

export default async function EventsPage() {
  const events = await getUpcomingEvents();

  return (
    <>
      <PageHero
        eyebrow="Events"
        title="Upcoming events"
        subtitle="Webinars, workshops, and conferences where you can see AI-Solutions in action."
      />

      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {events.length > 0 ? (
            <ul className="space-y-6">
              {events.map((event) => {
                const month = new Date(event.eventDate).toLocaleDateString(
                  "en-US",
                  { month: "short", timeZone: "UTC" }
                );
                const day = new Date(event.eventDate).toLocaleDateString(
                  "en-US",
                  { day: "numeric", timeZone: "UTC" }
                );

                return (
                  <li
                    key={event.id}
                    className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-lg sm:flex-row sm:items-start"
                  >
                    {/* Date badge */}
                    <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                      <span className="text-xs font-semibold uppercase tracking-wide">
                        {month}
                      </span>
                      <span className="text-2xl font-bold leading-none">
                        {day}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-slate-900">
                        {event.title}
                      </h2>
                      <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-slate-500">
                        <span className="inline-flex items-center gap-1.5">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                          </svg>
                          {formatDate(event.eventDate)} &middot; {formatTime(event.eventDate)}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                          </svg>
                          {event.location}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {event.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-center text-slate-500">
              No upcoming events right now. Check back soon.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
