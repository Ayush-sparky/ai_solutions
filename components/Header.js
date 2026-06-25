"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navLinks } from "@/lib/nav";

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="AI-Solutions home">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white">
        AI
      </span>
      <span className="text-lg font-bold tracking-tight text-slate-900">
        AI-Solutions
      </span>
    </Link>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const linkClasses = (href, base) =>
    `${base} ${
      isActive(href)
        ? "text-indigo-600"
        : "text-slate-700 hover:text-indigo-600"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75">
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8"
      >
        <Logo />

        {/* Desktop navigation */}
        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={linkClasses(
                  link.href,
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-slate-50"
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop call-to-action */}
        <Link
          href="/contact"
          className="hidden rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 lg:inline-flex"
        >
          Get in touch
        </Link>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label="Toggle navigation menu"
          className="inline-flex items-center justify-center rounded-md p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
        >
          {open ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile navigation panel */}
      {open && (
        <div id="mobile-menu" className="border-t border-slate-200 bg-white lg:hidden">
          <ul className="space-y-1 px-4 py-3 sm:px-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={linkClasses(
                    link.href,
                    "block rounded-md px-3 py-2 text-base font-medium hover:bg-slate-50"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="block rounded-full bg-indigo-600 px-5 py-2.5 text-center text-base font-semibold text-white hover:bg-indigo-500"
              >
                Get in touch
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
