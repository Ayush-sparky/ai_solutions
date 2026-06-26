"use client";

import { useActionState, useState } from "react";
import { submitEventRegistration } from "../actions";

const EMPTY = { name: "", email: "", phone: "", company: "", message: "" };

const initialState = { success: false, errors: {} };

function inputClass(hasError) {
  return `block w-full rounded-lg border px-3.5 py-2.5 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 ${
    hasError ? "border-red-400" : "border-slate-300"
  }`;
}

function FieldError({ id, message }) {
  if (!message) return null;
  return (
    // role="alert" so the error (incl. "already registered for this event") is
    // announced to assistive tech the moment it appears, not only on refocus.
    <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm text-red-600">
      {message}
    </p>
  );
}

function TextField({ id, label, value, onChange, error, type = "text", optional, ...rest }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
        {optional ? <span className="ml-1 text-slate-400">(optional)</span> : null}
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

export default function EventRegistrationForm({ eventId, eventTitle }) {
  const [state, formAction, pending] = useActionState(
    submitEventRegistration,
    initialState
  );
  const [values, setValues] = useState(EMPTY);
  const [showSuccess, setShowSuccess] = useState(false);

  // Reconcile against a fresh action result during render (rather than in an
  // effect, which would trigger a cascading re-render): when a submission
  // succeeds, clear the fields and reveal the success panel. useActionState
  // returns a new object per submission, so the identity check fires each time.
  const [seenState, setSeenState] = useState(state);
  if (state !== seenState) {
    setSeenState(state);
    if (state.success) {
      setValues(EMPTY);
      setShowSuccess(true);
    }
  }

  const errors = state.errors ?? {};

  function handleChange(event) {
    if (showSuccess) setShowSuccess(false);
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  if (showSuccess) {
    return (
      <div
        role="status"
        className="rounded-xl border border-green-200 bg-green-50 p-6 text-sm text-green-800"
      >
        <p className="text-base font-semibold">You&apos;re registered!</p>
        <p className="mt-1.5">
          Thanks for signing up for <span className="font-medium">{eventTitle}</span>.
          We&apos;ve saved your spot and will email you the details.
        </p>
        <button
          type="button"
          onClick={() => setShowSuccess(false)}
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-green-700 hover:text-green-600"
        >
          Register someone else
        </button>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="space-y-5">
      <input type="hidden" name="eventId" value={eventId} />

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
          id="name"
          label="Full name"
          value={values.name}
          onChange={handleChange}
          error={errors.name}
          autoComplete="name"
          placeholder="Anjali Shrestha"
        />
        <TextField
          id="email"
          label="Email"
          type="email"
          value={values.email}
          onChange={handleChange}
          error={errors.email}
          autoComplete="email"
          placeholder="anjali@himalayatech.com.np"
        />
        <TextField
          id="phone"
          label="Phone"
          type="tel"
          optional
          value={values.phone}
          onChange={handleChange}
          error={errors.phone}
          autoComplete="tel"
          placeholder="+977 9801234567"
        />
        <TextField
          id="company"
          label="Company"
          optional
          value={values.company}
          onChange={handleChange}
          error={errors.company}
          autoComplete="organization"
          placeholder="Himalaya Tech Pvt. Ltd."
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-slate-700">
          Anything you&apos;d like us to know?
          <span className="ml-1 text-slate-400">(optional)</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          value={values.message}
          onChange={handleChange}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          placeholder="Questions, accessibility needs, topics you'd like covered…"
          className={`mt-1.5 ${inputClass(Boolean(errors.message))}`}
        />
        <FieldError id="message" message={errors.message} />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center rounded-full bg-indigo-600 px-7 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Registering…" : "Register for this event"}
      </button>
    </form>
  );
}
