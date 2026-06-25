import PageHero from "@/components/PageHero";
import ContactForm from "./ContactForm";

export const metadata = {
  title: "Contact",
  description:
    "Tell AI-Solutions about your project. Share your goals and we'll get back to you with next steps.",
};

const nextSteps = [
  "We review your message and goals.",
  "We reach out to schedule a short intro call.",
  "We propose a focused, no-obligation plan.",
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's talk about your project"
        subtitle="Tell us a bit about what you're trying to achieve and we'll get back to you with next steps."
      />

      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-5">
            {/* Info column */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                Get in touch
              </h2>
              <p className="mt-3 text-base leading-7 text-slate-600">
                Prefer email or phone? Reach us directly — or fill out the form
                and we&apos;ll take it from there.
              </p>

              <dl className="mt-8 space-y-4 text-sm">
                <div>
                  <dt className="font-semibold text-slate-900">Email</dt>
                  <dd className="mt-1">
                    <a
                      href="mailto:hello@ai-solutions.test"
                      className="text-indigo-600 hover:text-indigo-500"
                    >
                      hello@ai-solutions.test
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-900">Phone</dt>
                  <dd className="mt-1">
                    <a
                      href="tel:+10000000000"
                      className="text-indigo-600 hover:text-indigo-500"
                    >
                      +1 (000) 000-0000
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-900">Location</dt>
                  <dd className="mt-1 text-slate-600">Remote-first · Worldwide</dd>
                </div>
              </dl>

              <div className="mt-10 rounded-2xl bg-slate-50 p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
                  What happens next
                </h3>
                <ol className="mt-4 space-y-3">
                  {nextSteps.map((step, i) => (
                    <li key={i} className="flex gap-3 text-sm text-slate-600">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Form column */}
            <div className="lg:col-span-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
