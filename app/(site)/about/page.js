import Link from "next/link";

// ---------------------------------------------------------------------------
// Editable placeholder marketing copy. Replace freely.
// ---------------------------------------------------------------------------
const hero = {
  eyebrow: "About us",
  title: "We make AI practical for real businesses.",
  subtitle:
    "AI-Solutions is a team of engineers, data scientists, and strategists who help companies turn AI from a buzzword into measurable results.",
};

const story = {
  eyebrow: "Our story",
  title: "From a simple idea to a trusted AI partner",
  lead: "We started AI-Solutions because we saw too many businesses excited about AI but unsure where to begin — or burned by projects that never shipped.",
  paragraphs: [
    "Our approach is different. We start with your goals, not the technology. We find the use cases where AI actually moves the needle, prove value quickly with a focused pilot, and then scale what works.",
    "Over the years we have partnered with startups and established enterprises alike, delivering automation, custom models, and data platforms that are still running in production today.",
    "We believe great AI work is honest, measurable, and built to last. No hype, no black boxes — just software that earns its keep.",
  ],
};

const stats = [
  { value: "150+", label: "Projects delivered" },
  { value: "40%", label: "Avg. cost reduction" },
  { value: "12", label: "Countries served" },
  { value: "98%", label: "Client satisfaction" },
];

const values = [
  {
    title: "Outcomes over hype",
    description:
      "We measure success by your business results, not by how impressive the demo looks.",
    iconPath: "m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z",
  },
  {
    title: "Trust & transparency",
    description:
      "Clear scope, clear pricing, and clear communication — you always know where things stand.",
    iconPath:
      "M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z",
  },
  {
    title: "True partnership",
    description:
      "We work alongside your team, sharing knowledge so you are never dependent on a black box.",
    iconPath:
      "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z",
  },
  {
    title: "Pragmatism first",
    description:
      "The simplest solution that solves the problem wins. We avoid complexity for its own sake.",
    iconPath:
      "M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z",
  },
  {
    title: "Security & privacy",
    description:
      "Your data is handled with care, with security and compliance built in from day one.",
    iconPath:
      "M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z",
  },
  {
    title: "Always improving",
    description:
      "AI moves fast. We keep learning so your solutions stay current and keep getting better.",
    iconPath:
      "M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  },
];

export const metadata = {
  title: "About Us",
  description:
    "Meet AI-Solutions — a team of engineers and strategists making AI practical, measurable, and built to last for real businesses.",
};

export default function AboutPage() {
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
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
                {story.eyebrow}
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {story.title}
              </h2>
              <p className="mt-6 text-lg leading-8 text-slate-700">{story.lead}</p>
            </div>
            <div className="mt-8 space-y-5 text-base leading-7 text-slate-600 lg:mt-0">
              {story.paragraphs.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <dl className="grid grid-cols-2 gap-8 text-center sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <dt className="order-2 mt-1 text-sm font-medium text-slate-400">
                  {stat.label}
                </dt>
                <dd className="order-1 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Values */}
      <section className="bg-slate-50 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              What we value
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Principles that guide our work
            </h2>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-2xl border border-slate-200 bg-white p-6"
              >
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d={value.iconPath} />
                  </svg>
                </div>
                <h3 className="mt-5 text-lg font-semibold text-slate-900">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {value.description}
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
            Let&apos;s build something together.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-indigo-100">
            Tell us about your goals and we&apos;ll help you find the fastest path
            to real results.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3 text-base font-semibold text-indigo-700 shadow-sm transition-colors hover:bg-indigo-50"
            >
              Get in touch
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center rounded-full border border-white/40 px-7 py-3 text-base font-semibold text-white transition-colors hover:bg-white/10"
            >
              Explore services
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
