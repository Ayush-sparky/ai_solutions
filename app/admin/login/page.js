import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import LoginForm from "./LoginForm";

export const metadata = { title: "Sign in" };

export default async function AdminLoginPage() {
  // Already signed in? Skip the form.
  const session = await getSession();
  if (session) redirect("/admin");

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-base font-bold text-white">
            AI
          </span>
          <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-900">
            AI-Solutions Admin
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Sign in to manage the site.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
