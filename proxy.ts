import {
  DEFAULT_ACCESS_TOKEN_COOKIE,
  DEFAULT_REFRESH_TOKEN_COOKIE,
  updateSession,
} from "@insforge/sdk/ssr/middleware";
import { type NextRequest, NextResponse } from "next/server";

const PROTECTED_ROUTES = ["/dashboard", "/profile", "/find-jobs"];

type RefreshError = {
  statusCode: number;
};

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

function copyResponseCookies(source: NextResponse, target: NextResponse): void {
  source.cookies.getAll().forEach((cookie) => target.cookies.set(cookie));
}

function isTransientRefreshError(error: RefreshError | null): boolean {
  return Boolean(
    error &&
      (error.statusCode === 408 || error.statusCode === 429 || error.statusCode >= 500),
  );
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const originalAccessToken = request.cookies.get(DEFAULT_ACCESS_TOKEN_COOKIE)?.value;
  const originalRefreshToken = request.cookies.get(DEFAULT_REFRESH_TOKEN_COOKIE)?.value;
  let response = NextResponse.next({ request });
  const session = await updateSession({
    requestCookies: request.cookies,
    responseCookies: response.cookies,
  });

  if (isTransientRefreshError(session.error)) {
    if (originalAccessToken) {
      request.cookies.set(DEFAULT_ACCESS_TOKEN_COOKIE, originalAccessToken);
    }

    if (originalRefreshToken) {
      request.cookies.set(DEFAULT_REFRESH_TOKEN_COOKIE, originalRefreshToken);
    }

    response = NextResponse.next({ request });
  }

  if (isProtectedPath(request.nextUrl.pathname) && !session.accessToken) {
    const redirectResponse = NextResponse.redirect(new URL("/login", request.url));
    copyResponseCookies(response, redirectResponse);
    return redirectResponse;
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
