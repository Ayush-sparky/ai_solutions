// Reusable presentational form fields for admin forms (used by client forms).
export function inputClass(hasError) {
  return `block w-full rounded-lg border px-3.5 py-2.5 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 ${
    hasError ? "border-red-400" : "border-slate-300"
  }`;
}

export function FieldError({ id, message }) {
  if (!message) return null;
  return (
    <p id={`${id}-error`} className="mt-1.5 text-sm text-red-600">
      {message}
    </p>
  );
}

export function TextField({ id, label, error, hint, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={id}
        name={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`mt-1.5 ${inputClass(Boolean(error))}`}
        {...props}
      />
      {hint && !error ? (
        <p className="mt-1.5 text-xs text-slate-500">{hint}</p>
      ) : null}
      <FieldError id={id} message={error} />
    </div>
  );
}

export function TextArea({ id, label, error, hint, rows = 5, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <textarea
        id={id}
        name={id}
        rows={rows}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`mt-1.5 ${inputClass(Boolean(error))}`}
        {...props}
      />
      {hint && !error ? (
        <p className="mt-1.5 text-xs text-slate-500">{hint}</p>
      ) : null}
      <FieldError id={id} message={error} />
    </div>
  );
}

// Controlled toggle switch (renders a checkbox; checked value posts as "on").
export function ToggleField({ id, label, hint, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="inline-flex cursor-pointer items-center gap-3">
        <span className="relative inline-flex h-6 w-11 items-center">
          <input id={id} name={id} type="checkbox" className="peer sr-only" {...props} />
          <span className="absolute inset-0 rounded-full bg-slate-300 transition-colors peer-checked:bg-indigo-600" />
          <span className="absolute left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
        </span>
        <span className="text-sm font-medium text-slate-700">{label}</span>
      </label>
      {hint ? <p className="mt-1.5 text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}
