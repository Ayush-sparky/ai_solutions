import Link from "next/link";
import { navLinks } from "@/lib/nav";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2 md:max-w-sm">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white">
                AI
              </span>
              <span className="text-lg font-bold tracking-tight text-white">
                AI-Solutions
              </span>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              We help businesses adopt AI with practical consulting, process
              automation, and custom solutions — from first idea to production.
            </p>
          </div>

          {/* Explore links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Explore
            </h3>
            <ul className="mt-4 grid grid-cols-2 gap-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Get in touch
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li>
                <a href="mailto:hello@ai-solutions.test" className="transition-colors hover:text-white">
                  hello@ai-solutions.test
                </a>
              </li>
              <li>
                <a href="tel:+10000000000" className="transition-colors hover:text-white">
                  +1 (000) 000-0000
                </a>
              </li>
              <li>Remote-first · Worldwide</li>
            </ul>
            <Link
              href="/contact"
              className="mt-4 inline-flex rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
            >
              Start a project
            </Link>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-slate-800 pt-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {year} AI-Solutions. All rights reserved.</p>
          <p>Built with Next.js &amp; Tailwind CSS.</p>
        </div>
      </div>
    </footer>
  );
}
