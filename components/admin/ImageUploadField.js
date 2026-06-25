"use client";

import { useRef, useState } from "react";
import { FieldError } from "@/components/admin/fields";

// Image picker for admin forms. Uploads the chosen file to /api/admin/upload as
// soon as it's selected, then stores the returned path in a hidden input so it
// posts with the rest of the form. Works for both create (no initial image) and
// edit (keeps the existing image unless the admin replaces or removes it).
export default function ImageUploadField({
  name,
  label,
  initialUrl = "",
  aspect = "video", // "video" (16/9) | "square"
  hint,
  error,
}) {
  const [url, setUrl] = useState(initialUrl);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const inputRef = useRef(null);

  const aspectClass =
    aspect === "square" ? "aspect-square max-w-xs" : "aspect-[16/9] max-w-sm";
  const shownError = uploadError || error;

  async function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError("");
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setUploadError(data.error || "Upload failed. Please try again.");
      } else {
        setUrl(data.url);
      }
    } catch {
      setUploadError("Upload failed. Check your connection and try again.");
    } finally {
      setUploading(false);
      // Reset so selecting the same file again still fires onChange.
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleRemove() {
    setUrl("");
    setUploadError("");
  }

  return (
    <div>
      <span className="block text-sm font-medium text-slate-700">{label}</span>

      {/* Carries the saved image path into the form submission. */}
      <input type="hidden" name={name} value={url} />

      {url ? (
        <div className="mt-1.5 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
          {/* Stored path or external URL -> plain img (no next/image config). */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="Preview" className={`w-full object-cover ${aspectClass}`} />
        </div>
      ) : (
        <div
          className={`mt-1.5 grid w-full place-items-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-400 ${aspectClass}`}
        >
          No image selected
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {uploading ? "Uploading…" : url ? "Replace image" : "Upload image"}
        </button>
        {url && !uploading ? (
          <button
            type="button"
            onClick={handleRemove}
            className="text-sm font-medium text-red-600 hover:text-red-500"
          >
            Remove
          </button>
        ) : null}
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          onChange={handleFile}
          aria-invalid={Boolean(shownError)}
          aria-describedby={shownError ? `${name}-error` : undefined}
          className="sr-only"
        />
      </div>

      {hint && !shownError ? (
        <p className="mt-1.5 text-xs text-slate-500">{hint}</p>
      ) : null}
      <FieldError id={name} message={shownError} />
    </div>
  );
}
