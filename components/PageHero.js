// Shared hero band for interior public pages (Articles, Gallery, Events).
export default function PageHero({ eyebrow, title, subtitle }) {
  return (
    <section className="relative overflow-hidden bg-slate-900 text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-indigo-600/30 blur-3xl"
      />
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        {eyebrow ? (
          <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-indigo-200">
            {eyebrow}
          </span>
        ) : null}
        <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            {subtitle}
          </p>
        ) : null}
      </div>
    </section>
  );
}
