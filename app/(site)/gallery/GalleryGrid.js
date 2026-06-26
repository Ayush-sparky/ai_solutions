"use client";

// Public gallery grid with an up-close lightbox/carousel. Clicking a tile opens
// a full-screen view of that image; arrow keys / on-screen controls move through
// the whole gallery (wrapping at the ends). Esc or a backdrop click closes it.

import { useCallback, useEffect, useState } from "react";

export default function GalleryGrid({ items }) {
  // Index of the open item, or null when the lightbox is closed.
  const [openIndex, setOpenIndex] = useState(null);
  const isOpen = openIndex !== null;

  const close = useCallback(() => setOpenIndex(null), []);
  const next = useCallback(
    () => setOpenIndex((i) => (i === null ? i : (i + 1) % items.length)),
    [items.length]
  );
  const prev = useCallback(
    () =>
      setOpenIndex((i) =>
        i === null ? i : (i - 1 + items.length) % items.length
      ),
    [items.length]
  );

  // Keyboard navigation + body scroll lock while the lightbox is open.
  useEffect(() => {
    if (!isOpen) return;

    function onKeyDown(e) {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    }

    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, close, next, prev]);

  const active = isOpen ? items[openIndex] : null;

  return (
    <>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item, index) => (
          <li
            key={item.id}
            className="group relative aspect-square overflow-hidden rounded-xl bg-slate-100"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(index)}
              aria-label={`View ${item.title} up close`}
              className="block h-full w-full cursor-zoom-in text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            >
              {/* Arbitrary admin-provided URLs -> plain img (no next/image domain config). */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.imageUrl}
                alt={item.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4">
                <p className="text-sm font-semibold text-white">{item.title}</p>
                {item.caption ? (
                  <p className="mt-0.5 line-clamp-2 text-xs text-slate-200">
                    {item.caption}
                  </p>
                ) : null}
              </div>
            </button>
          </li>
        ))}
      </ul>

      {active ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${active.title} — image ${openIndex + 1} of ${items.length}`}
          onClick={close}
          className="fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-sm motion-safe:animate-[fadeIn_0.15s_ease-out]"
        >
          {/* Top bar: counter + close. */}
          <div className="flex items-center justify-between p-4 text-white">
            <span className="text-sm font-medium tabular-nums text-white/80">
              {openIndex + 1} / {items.length}
            </span>
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Stage: image + caption, with carousel arrows on either side. */}
          <div className="flex flex-1 items-center justify-center gap-2 px-2 pb-6 sm:gap-4 sm:px-4">
            {items.length > 1 ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                aria-label="Previous image"
                className="shrink-0 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20 sm:p-3"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
              </button>
            ) : null}

            <figure
              onClick={(e) => e.stopPropagation()}
              className="flex min-w-0 max-w-5xl flex-1 flex-col items-center"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={active.id}
                src={active.imageUrl}
                alt={active.title}
                className="max-h-[72vh] w-auto max-w-full rounded-lg object-contain shadow-2xl motion-safe:animate-[fadeIn_0.2s_ease-out]"
              />
              <figcaption className="mt-4 max-w-2xl text-center">
                <p className="text-base font-semibold text-white">{active.title}</p>
                {active.caption ? (
                  <p className="mt-1 text-sm text-white/70">{active.caption}</p>
                ) : null}
              </figcaption>
            </figure>

            {items.length > 1 ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                aria-label="Next image"
                className="shrink-0 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20 sm:p-3"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
