"use client";

import { useActionState, useState } from "react";
import { login } from "./actions";

const initialState = { errors: {} };

function inputClass(hasError) {
  return `block w-full rounded-lg border px-3.5 py-2.5 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 ${
    hasError ? "border-red-400" : "border-slate-300"
  }`;
}

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);
  const [values, setValues] = useState({ email: "", password: "" });
  const errors = state.errors ?? {};

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <form action={formAction} noValidate className="space-y-5">
      {errors.form ? (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {errors.form}
        </div>
      ) : null}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700">
          Username
        </label>
        <input
          id="email"
          name="email"
          type="text"
          value={values.email}
          onChange={handleChange}
          autoComplete="username"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={`mt-1.5 ${inputClass(Boolean(errors.email))}`}
        />
        {errors.email ? (
          <p id="email-error" className="mt-1.5 text-sm text-red-600">
            {errors.email}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-slate-700">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={values.password}
          onChange={handleChange}
          autoComplete="current-password"
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? "password-error" : undefined}
          className={`mt-1.5 ${inputClass(Boolean(errors.password))}`}
        />
        {errors.password ? (
          <p id="password-error" className="mt-1.5 text-sm text-red-600">
            {errors.password}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center rounded-full bg-indigo-600 px-7 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
