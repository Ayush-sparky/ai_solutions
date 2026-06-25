import Link from "next/link";
import { services } from "@/lib/services";

// ---------------------------------------------------------------------------
// Editable placeholder marketing copy. Service details live in lib/services.js.
// ---------------------------------------------------------------------------
const hero = {
  eyebrow: "Our services",
  title: "End-to-end AI, from strategy to production.",
  subtitle:
    "We cover the whole journey — finding the right opportunities, building the solution, and running it in production. Pick a starting point or let us guide the way.",
};

const ourProcess = {
  eyebrow: "How we work",
  title: "A simple, proven process",
  steps: [
    {
      number: "01",
      title: "Discover",
      description:
        "We learn your goals, data, and constraints, then identify the highest-impact opportunities.",
    },
    {
      number: "02",
      title: "Design",
      description:
        "We scope a focused solution with clear success metrics, a timeline, and a transparent budget.",
    },
    {
      number: "03",
      title: "Build",
      description:
        "We develop, test, and iterate quickly — keeping you in the loop with working software throughout.",
    },
    {
      number: "04",
      title: "Scale",
      description:
        "We deploy to production and support you as you roll out, measure impact, and grow.",
    },
  ],
};

export const metadata = {
  title: "Services",
  description:
    "Explore AI-Solutions services: AI strategy, process automation, custom AI, data & analytics, conversational AI, and deployment.",
};

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-900 text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-indigo-600/30 blur-3xl"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-indigo-200">
              {hero.eyebrow}
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {hero.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              {hero.subtitle}
            </p>
            <div className="mt-10">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-7 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500"
              >
                Get a free consultation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services detail */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            {services.map((service) => (
              <div
                key={service.slug}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-8 transition-shadow hover:shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d={service.iconPath} />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    {service.title}
                  </h2>
                </div>
                <p className="mt-4 text-base leading-7 text-slate-600">
                  {service.description}
                </p>
                <ul className="mt-6 space-y-3 border-t border-slate-100 pt-6">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <svg
                        className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                      <span className="text-sm text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-slate-50 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              {ourProcess.eyebrow}
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {ourProcess.title}
            </h2>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ourProcess.steps.map((step) => (
              <div
                key={step.number}
                className="rounded-2xl border border-slate-200 bg-white p-6"
              >
                <div className="text-3xl font-bold text-indigo-600">
                  {step.number}
                </div>
                <h3 className="mt-3 text-lg font-semibold text-slate-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="bg-indigo-600">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Not sure where to start?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-indigo-100">
            Book a free consultation and we&apos;ll help you find the use case
            with the fastest path to value.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3 text-base font-semibold text-indigo-700 shadow-sm transition-colors hover:bg-indigo-50"
            >
              Get in touch
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center rounded-full border border-white/40 px-7 py-3 text-base font-semibold text-white transition-colors hover:bg-white/10"
            >
              Learn about us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
