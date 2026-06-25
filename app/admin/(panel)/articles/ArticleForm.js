"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { TextField, TextArea, ToggleField } from "@/components/admin/fields";
import ImageUploadField from "@/components/admin/ImageUploadField";

const initialState = { errors: {} };

export default function ArticleForm({ action, initial = {}, submitLabel = "Save" }) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [values, setValues] = useState({
    title: initial.title ?? "",
    slug: initial.slug ?? "",
    content: initial.content ?? "",
    published: initial.published ?? false,
  });
  const errors = state.errors ?? {};

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setValues((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
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
        placeholder="How AI cut support costs by 40%"
      />
      <TextField
        id="slug"
        label="Slug"
        value={values.slug}
        onChange={handleChange}
        error={errors.slug}
        hint="Lowercase letters, numbers, and hyphens. Used in the article URL."
        placeholder="support-cost-reduction"
      />
      <TextArea
        id="content"
        label="Content"
        rows={10}
        value={values.content}
        onChange={handleChange}
        error={errors.content}
      />
      <ImageUploadField
        name="coverImageUrl"
        label="Cover image (optional)"
        initialUrl={initial.coverImageUrl ?? ""}
        aspect="video"
        error={errors.coverImageUrl}
        hint="JPG, PNG, WebP, or GIF — up to 5 MB."
      />
      <ToggleField
        id="published"
        label="Published"
        checked={values.published}
        onChange={handleChange}
        hint="When on, the article is visible on the public site."
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
          href="/admin/articles"
          className="rounded-full px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
