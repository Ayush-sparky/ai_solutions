import { cache } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDate, formatTime, excerpt, isUpcoming } from "@/lib/format";
import EventRegistrationForm from "./EventRegistrationForm";

export const dynamic = "force-dynamic";

// Wrapped in cache() so generateMetadata and the page share one query per request.
const getEvent = cache(async (slug) => {
  try {
    return await prisma.event.findUnique({ where: { slug } });
  } catch (error) {
    console.error(`Failed to load event "${slug}":`, error);
    return null;
  }
});

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) return { title: "Event not found" };
  return {
    title: event.title,
    description: excerpt(event.description, 155),
  };
}

export default async function EventDetailPage({ params }) {
  const { slug } = await params;
  const event = await getEvent(slug);

  if (!event) notFound();

  const upcoming = isUpcoming(event.eventDate);
  const paragraphs = event.description
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <article>
      <header className="bg-slate-900 text-white">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <Link
            href="/events"
            className="inline-flex items-center gap-1 text-sm font-medium text-indigo-300 hover:text-indigo-200"
          >
            <span aria-hidden="true">&larr;</span> All events
          </Link>

          <span
            className={`mt-8 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
              upcoming ? "bg-indigo-500/20 text-indigo-200" : "bg-white/10 text-slate-300"
            }`}
          >
            {upcoming ? "Upcoming" : "Past event"}
          </span>

          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {event.title}
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-300">
            <span className="inline-flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
              </svg>
              {formatDate(event.eventDate)} &middot; {formatTime(event.eventDate)}
            </span>
            <span className="inline-flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
              {event.location}
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="prose-slate">
          {paragraphs.map((paragraph, i) => (
            <p key={i} className="mt-6 text-lg leading-8 text-slate-700 first:mt-0">
              {paragraph}
            </p>
          ))}
        </div>

        {upcoming ? (
          <section
            id="register"
            className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8"
          >
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Register for this event
            </h2>
            <p className="mt-1.5 text-sm text-slate-600">
              Save your spot — we&apos;ll email you the joining details.
            </p>
            <div className="mt-6">
              <EventRegistrationForm eventId={event.id} eventTitle={event.title} />
            </div>
          </section>
        ) : (
          <div className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center sm:p-8">
            <p className="text-base font-semibold text-slate-900">This event has ended.</p>
            <p className="mt-1.5 text-sm text-slate-600">
              Registration is closed. Browse our{" "}
              <Link href="/events" className="font-medium text-indigo-600 hover:text-indigo-500">
                upcoming events
              </Link>{" "}
              or{" "}
              <Link href="/contact" className="font-medium text-indigo-600 hover:text-indigo-500">
                get in touch
              </Link>{" "}
              to learn more.
            </p>
          </div>
        )}
      </div>
    </article>
  );
}
