"use client";

import { useActionState, useEffect, useState } from "react";
import { submitInquiry } from "./actions";
import { COUNTRIES } from "@/lib/countries";

const EMPTY = {
  name: "",
  email: "",
  phone: "",
  company: "",
  country: "",
  jobTitle: "",
  jobDetails: "",
};

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

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(submitInquiry, initialState);
  const [values, setValues] = useState(EMPTY);
  const [showSuccess, setShowSuccess] = useState(false);

  const errors = state.errors ?? {};

  // Clear the form and reveal the success banner after a successful submit.
  useEffect(() => {
    if (state.success) {
      setValues(EMPTY);
      setShowSuccess(true);
    }
  }, [state]);

  function handleChange(event) {
    if (showSuccess) setShowSuccess(false);
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <form action={formAction} noValidate className="space-y-5">
      {showSuccess ? (
        <div
          role="status"
          className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800"
        >
          <p className="font-semibold">Thanks for reaching out!</p>
          <p className="mt-1">
            We&apos;ve received your message and will get back to you shortly.
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
          id="name"
          label="Full name"
          value={values.name}
          onChange={handleChange}
          error={errors.name}
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
        <TextField
          id="phone"
          label="Phone"
          type="tel"
          value={values.phone}
          onChange={handleChange}
          error={errors.phone}
          autoComplete="tel"
          placeholder="+1 555 000 0000"
        />
        <TextField
          id="company"
          label="Company"
          value={values.company}
          onChange={handleChange}
          error={errors.company}
          autoComplete="organization"
          placeholder="Acme Inc."
        />

        <div>
          <label htmlFor="country" className="block text-sm font-medium text-slate-700">
            Country
          </label>
          <select
            id="country"
            name="country"
            value={values.country}
            onChange={handleChange}
            aria-invalid={Boolean(errors.country)}
            aria-describedby={errors.country ? "country-error" : undefined}
            className={`mt-1.5 ${inputClass(Boolean(errors.country))}`}
          >
            <option value="">Select country…</option>
            {COUNTRIES.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
          <FieldError id="country" message={errors.country} />
        </div>

        <TextField
          id="jobTitle"
          label="Job title"
          value={values.jobTitle}
          onChange={handleChange}
          error={errors.jobTitle}
          autoComplete="organization-title"
          placeholder="Head of Operations"
        />
      </div>

      <div>
        <label htmlFor="jobDetails" className="block text-sm font-medium text-slate-700">
          Project / job details
        </label>
        <textarea
          id="jobDetails"
          name="jobDetails"
          rows={5}
          value={values.jobDetails}
          onChange={handleChange}
          aria-invalid={Boolean(errors.jobDetails)}
          aria-describedby={errors.jobDetails ? "jobDetails-error" : undefined}
          placeholder="Tell us about your goals, timeline, and any context that helps."
          className={`mt-1.5 ${inputClass(Boolean(errors.jobDetails))}`}
        />
        <FieldError id="jobDetails" message={errors.jobDetails} />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center rounded-full bg-indigo-600 px-7 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
