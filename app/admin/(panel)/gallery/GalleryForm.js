"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { TextField } from "@/components/admin/fields";
import ImageUploadField from "@/components/admin/ImageUploadField";

const initialState = { errors: {} };

export default function GalleryForm({ action, initial = {}, submitLabel = "Save" }) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [values, setValues] = useState({
    title: initial.title ?? "",
    caption: initial.caption ?? "",
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
        placeholder="Our team at work"
      />
      <ImageUploadField
        name="imageUrl"
        label="Image"
        initialUrl={initial.imageUrl ?? ""}
        aspect="square"
        error={errors.imageUrl}
        hint="JPG, PNG, WebP, or GIF — up to 5 MB."
      />
      <TextField
        id="caption"
        label="Caption (optional)"
        value={values.caption}
        onChange={handleChange}
        error={errors.caption}
        placeholder="A short description"
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
          href="/admin/gallery"
          className="rounded-full px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
