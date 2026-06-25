"use client";

import { useState } from "react";

// Two-step delete: first click reveals an inline Confirm/Cancel. Confirm posts
// the (server) `action` with the item id. `action` is passed in from a server
// component.
export default function ConfirmDeleteButton({ action, id, label = "Delete" }) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
      >
        {label}
      </button>
    );
  }

  return (
    <span className="inline-flex items-center gap-2">
      <span className="text-sm text-slate-600">Delete?</span>
      <form action={action}>
        <input type="hidden" name="id" value={id} />
        <button
          type="submit"
          className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-red-500"
        >
          Yes, delete
        </button>
      </form>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
      >
        Cancel
      </button>
    </span>
  );
}
