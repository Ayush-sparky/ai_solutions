"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// Static, rule-based Q&A. No external API — clicking a question appends its
// canned answer. Edit/add entries here to change what the assistant can answer.
const PRESETS = [
  {
    q: "What services do you offer?",
    a: "We cover the full journey: AI strategy & consulting, process automation, custom AI solutions, data & analytics, conversational AI, and integration & deployment.",
    href: "/services",
    hrefLabel: "View all services",
  },
  {
    q: "How do I get in touch?",
    a: "The fastest way is our contact form — share a few details about your project and we'll reply with next steps. You can also email hello@ai-solutions.test.",
    href: "/contact",
    hrefLabel: "Open contact form",
  },
  {
    q: "How much does a project cost?",
    a: "It depends on scope. We usually start with a free consultation and a small, focused pilot, then scope from there. Reach out and we'll give you a ballpark.",
    href: "/contact",
    hrefLabel: "Get a quote",
  },
  {
    q: "Do you work with small businesses?",
    a: "Absolutely — from startups and SMEs to large enterprises. We start with the use case that delivers the most value, fastest.",
    href: "/about",
    hrefLabel: "About us",
  },
  {
    q: "Where can I read reviews?",
    a: "Our Reviews page has feedback from teams we've worked with — and you can submit your own.",
    href: "/reviews",
    hrefLabel: "Read reviews",
  },
];

const WELCOME =
  "Hi! I'm the AI-Solutions assistant. Pick a question below and I'll point you in the right direction.";

function ChatIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 12h.008v.008H8.25V12Zm3.75 0h.008v.008H12V12Zm3.75 0h.008v.008h-.008V12Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 0 1-2.555-.337A5.97 5.97 0 0 1 5.41 20.97a5.97 5.97 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
    </svg>
  );
}

function ChevronDownIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

function Bubble({ message }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
          isUser
            ? "rounded-tr-sm bg-indigo-600 text-white"
            : "rounded-tl-sm bg-slate-100 text-slate-700"
        }`}
      >
        <p>{message.text}</p>
        {message.href ? (
          <Link
            href={message.href}
            className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-500"
          >
            {message.hrefLabel}
            <span aria-hidden="true">&rarr;</span>
          </Link>
        ) : null}
      </div>
    </div>
  );
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: "bot", text: WELCOME }]);
  const scrollRef = useRef(null);

  // Keep the conversation scrolled to the latest message.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, open]);

  // Close on Escape while open.
  useEffect(() => {
    if (!open) return undefined;
    function onKey(event) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function ask(preset) {
    setMessages((prev) => [
      ...prev,
      { role: "user", text: preset.q },
      { role: "bot", text: preset.a, href: preset.href, hrefLabel: preset.hrefLabel },
    ]);
  }

  return (
    <>
      {open ? (
        <div
          role="dialog"
          aria-label="AI-Solutions assistant"
          className="fixed bottom-24 right-4 z-50 flex w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:right-6"
        >
          <div className="flex items-center justify-between bg-slate-900 px-4 py-3 text-white">
            <div>
              <p className="text-sm font-semibold">AI-Solutions Assistant</p>
              <p className="text-xs text-slate-300">Quick answers · no waiting</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="rounded-md p-1 text-slate-300 hover:bg-white/10 hover:text-white"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div ref={scrollRef} className="flex max-h-80 flex-col gap-3 overflow-y-auto p-4">
            {messages.map((message, i) => (
              <Bubble key={i} message={message} />
            ))}
          </div>

          <div className="border-t border-slate-200 bg-slate-50 p-3">
            <p className="px-1 pb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
              Suggested questions
            </p>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((preset) => (
                <button
                  key={preset.q}
                  type="button"
                  onClick={() => ask(preset)}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-left text-xs font-medium text-slate-700 transition-colors hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  {preset.q}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Minimize chat" : "Open chat"}
        className="fixed bottom-6 right-4 z-50 grid h-14 w-14 place-items-center rounded-full bg-indigo-600 text-white shadow-lg transition-colors hover:bg-indigo-500 sm:right-6"
      >
        {open ? <ChevronDownIcon className="h-6 w-6" /> : <ChatIcon className="h-7 w-7" />}
      </button>
    </>
  );
}
