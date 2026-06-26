"use client";

import { Fragment, useState } from "react";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";

const COLUMNS = ["Name", "Email", "Area of interest", "Date"];

export default function FutureInterestTable({ rows, deleteAction, query }) {
  const [expanded, setExpanded] = useState(() => new Set());

  function toggle(id) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
        {query ? `No sign-ups match “${query}”.` : "No future-interest sign-ups yet."}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              {COLUMNS.map((col) => (
                <th
                  key={col}
                  scope="col"
                  className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  {col}
                </th>
              ))}
              <th scope="col" className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => {
              const isOpen = expanded.has(row.id);
              return (
                <Fragment key={row.id}>
                  <tr className="hover:bg-slate-50/75">
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900">
                      {row.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <a
                        href={`mailto:${row.email}`}
                        className="text-indigo-600 hover:text-indigo-500"
                      >
                        {row.email}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{row.areaOfInterest}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                      {row.dateLabel}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => toggle(row.id)}
                          aria-expanded={isOpen}
                          aria-controls={`fi-details-${row.id}`}
                          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
                        >
                          {isOpen ? "Hide" : "Message"}
                          <svg
                            className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                          </svg>
                        </button>
                        <ConfirmDeleteButton action={deleteAction} id={row.id} />
                      </div>
                    </td>
                  </tr>
                  {isOpen ? (
                    <tr id={`fi-details-${row.id}`} className="bg-slate-50">
                      <td colSpan={COLUMNS.length + 1} className="px-4 py-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Message
                        </p>
                        <p className="mt-2 max-w-3xl whitespace-pre-line text-sm leading-6 text-slate-700">
                          {row.message}
                        </p>
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
