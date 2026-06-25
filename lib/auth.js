// Server-side session cookie helpers (uses next/headers — server components and
// server actions only; NOT importable from middleware).
import { cache } from "react";
import { cookies } from "next/headers";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  createToken,
  verifyToken,
} from "@/lib/session";

export async function createSession(admin) {
  const token = await createToken({ sub: admin.id, email: admin.email });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true, // not readable by client-side JS
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

// Cached per request so the layout and page share a single verify.
export const getSession = cache(async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  return verifyToken(token);
});

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
