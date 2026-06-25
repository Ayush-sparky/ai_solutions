"use client";

import { useActionState, useEffect, useState } from "react";
import { submitReview } from "./actions";

const STAR_PATH =
  "M9.05 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.367 2.446a1 1 0 00-.364 1.118l1.287 3.957c.3.922-.755 1.688-1.539 1.118l-3.367-2.446a1 1 0 00-1.175 0l-3.367 2.446c-.783.57-1.838-.196-1.538-1.118l1.286-3.957a1 1 0 00-.363-1.118L2.354 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z";

const EMPTY = { authorName: "", email: "", content: "" };
const initialState = { success: false, errors: {} };

function inputClass(hasError) {
  return `block w-full rounded-lg border px-3.5 py-2.5 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 ${
    hasError ? "border-red-400" : "border-slate-300"
  }`;
}

function FieldError({ id, message }) {
  if (!message) return null;
  return (
    <p id={`${id}-error`} className="mt-1.5 text-sm text-red-600">
      {message}
    </p>
  );
}

function TextField({ id, label, value, onChange, error, type = "text", ...rest }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`mt-1.5 ${inputClass(Boolean(error))}`}
        {...rest}
      />
      <FieldError id={id} message={error} />
    </div>
  );
}

function StarRatingInput({ value, onChange }) {
  const [hover, setHover] = useState(0);
  const active = hover || value;

  return (
    <div role="radiogroup" aria-label="Star rating" className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          className="rounded p-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
        >
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
            className={`h-8 w-8 transition-colors ${
              n <= active ? "text-amber-400" : "text-slate-300"
            }`}
          >
            <path d={STAR_PATH} />
          </svg>
        </button>
      ))}
      {value ? (
        <span className="ml-2 text-sm font-medium text-slate-600">{value}/5</span>
      ) : null}
    </div>
  );
}

export default function ReviewForm() {
  const [state, formAction, pending] = useActionState(submitReview, initialState);
  const [values, setValues] = useState(EMPTY);
  const [rating, setRating] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const errors = state.errors ?? {};

  // Clear the form and reveal the success banner after a successful submit.
  useEffect(() => {
    if (state.success) {
      setValues(EMPTY);
      setRating(0);
      setShowSuccess(true);
    }
  }, [state]);

  function handleChange(event) {
    if (showSuccess) setShowSuccess(false);
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function handleRatingChange(next) {
    if (showSuccess) setShowSuccess(false);
    setRating(next);
  }

  return (
    <form action={formAction} noValidate className="space-y-5">
      {showSuccess ? (
        <div
          role="status"
          className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800"
        >
          <p className="font-semibold">Thanks for your review!</p>
          <p className="mt-1">
            It&apos;s been submitted and will appear here once our team approves it.
          </p>
        </div>
      ) : null}

      {state.message ? (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {state.message}
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          id="authorName"
          label="Your name"
          value={values.authorName}
          onChange={handleChange}
          error={errors.authorName}
          autoComplete="name"
          placeholder="Jane Doe"
        />
        <TextField
          id="email"
          label="Email"
          type="email"
          value={values.email}
          onChange={handleChange}
          error={errors.email}
          autoComplete="email"
          placeholder="jane@company.com"
        />
      </div>

      <div>
        <span className="block text-sm font-medium text-slate-700">Rating</span>
        <div className="mt-1.5">
          {/* Carries the rating into the form submission. */}
          <input type="hidden" name="rating" value={rating} />
          <StarRatingInput value={rating} onChange={handleRatingChange} />
        </div>
        <FieldError id="rating" message={errors.rating} />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-slate-700">
          Your review
        </label>
        <textarea
          id="content"
          name="content"
          rows={4}
          value={values.content}
          onChange={handleChange}
          aria-invalid={Boolean(errors.content)}
          aria-describedby={errors.content ? "content-error" : undefined}
          placeholder="Tell others about your experience working with AI-Solutions."
          className={`mt-1.5 ${inputClass(Boolean(errors.content))}`}
        />
        <FieldError id="content" message={errors.content} />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center rounded-full bg-indigo-600 px-7 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Submitting…" : "Submit review"}
      </button>
    </form>
  );
}
