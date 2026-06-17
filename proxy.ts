import { getAccessTokenCookieName } from "@insforge/sdk/ssr/middleware";
import { NextRequest, NextResponse } from "next/server";

const PROTECTED = ["/dashboard", "/profile", "/find-jobs"];
const AUTH_ONLY = ["/login"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const tokenCookieName = getAccessTokenCookieName();
  const isAuthenticated =
    request.cookies.get(tokenCookieName)?.value != null;

  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
  const isAuthRoute = AUTH_ONLY.some((p) => pathname.startsWith(p));

  if (!isAuthenticated && isProtected) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next({ request });
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/find-jobs/:path*",
    "/login",
  ],
};
