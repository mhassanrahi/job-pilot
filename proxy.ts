import { updateSession } from "@insforge/sdk/ssr/middleware";
import { type NextRequest, NextResponse } from "next/server";

const PROTECTED_ROUTES = ["/dashboard", "/profile", "/find-jobs"];

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

function copyResponseCookies(source: NextResponse, target: NextResponse): void {
  source.cookies.getAll().forEach((cookie) => target.cookies.set(cookie));
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const response = NextResponse.next({ request });
  const session = await updateSession({
    requestCookies: request.cookies,
    responseCookies: response.cookies,
  });

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
