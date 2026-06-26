"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { TextField, TextArea } from "@/components/admin/fields";

const initialState = { errors: {} };

export default function EventForm({ action, initial = {}, submitLabel = "Save" }) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [values, setValues] = useState({
    title: initial.title ?? "",
    slug: initial.slug ?? "",
    description: initial.description ?? "",
    location: initial.location ?? "",
    eventDate: initial.eventDate ?? "",
  });
  const errors = state.errors ?? {};

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <form action={formAction} noValidate className="space-y-5">
      {initial.id ? <input type="hidden" name="id" value={initial.id} /> : null}

      {errors.form ? (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {errors.form}
        </div>
      ) : null}

      <TextField
        id="title"
        label="Title"
        value={values.title}
        onChange={handleChange}
        error={errors.title}
        placeholder="AI in Practice: Live Webinar"
      />
      <TextField
        id="slug"
        label="Slug"
        value={values.slug}
        onChange={handleChange}
        error={errors.slug}
        hint="Lowercase letters, numbers, and hyphens. Used in the public event URL (/events/<slug>)."
        placeholder="ai-in-practice-webinar"
      />
      <TextArea
        id="description"
        label="Description"
        rows={4}
        value={values.description}
        onChange={handleChange}
        error={errors.description}
      />
      <TextField
        id="location"
        label="Location"
        value={values.location}
        onChange={handleChange}
        error={errors.location}
        placeholder="Online · Bengaluru, India · ..."
      />
      <TextField
        id="eventDate"
        label="Date & time (UTC)"
        type="datetime-local"
        value={values.eventDate}
        onChange={handleChange}
        error={errors.eventDate}
        hint="Entered and shown in UTC, matching the public events page."
      />

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Saving…" : submitLabel}
        </button>
        <Link
          href="/admin/events"
          className="rounded-full px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
