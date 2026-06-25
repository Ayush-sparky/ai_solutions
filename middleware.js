import { NextResponse } from "next/server";
import { SESSION_COOKIE, verifyToken } from "@/lib/session";

// Protects every /admin route. The login page is the only exception.
export async function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifyToken(token);

  if (!session) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
