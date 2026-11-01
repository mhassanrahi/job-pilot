import { createAuthActions } from "@insforge/sdk/ssr";
import { type NextRequest, NextResponse } from "next/server";

const CODE_VERIFIER_COOKIE = "insforge_code_verifier";

function loginRedirect(request: NextRequest, error: string): NextResponse {
  const response = NextResponse.redirect(
    new URL(`/login?error=${encodeURIComponent(error)}`, request.url),
  );
  response.cookies.delete(CODE_VERIFIER_COOKIE);
  return response;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const code = request.nextUrl.searchParams.get("insforge_code");
  const oauthError = request.nextUrl.searchParams.get("error");

  if (oauthError || !code) {
    console.warn("[api/auth/callback] OAuth provider returned an error");
    return loginRedirect(request, "oauth_failed");
  }

  const codeVerifier = request.cookies.get(CODE_VERIFIER_COOKIE)?.value;

  if (!codeVerifier) {
    return loginRedirect(request, "missing_verifier");
  }

  try {
    const response = NextResponse.redirect(new URL("/dashboard", request.url));
    const auth = createAuthActions({
      requestCookies: request.cookies,
      responseCookies: response.cookies,
    });
    const { data, error } = await auth.exchangeOAuthCode(code, codeVerifier);

    if (error || !data?.user) {
      console.error("[api/auth/callback] OAuth code exchange failed", error);
      return loginRedirect(request, "exchange_failed");
    }

    response.cookies.delete(CODE_VERIFIER_COOKIE);
    return response;
  } catch (error) {
    console.error("[api/auth/callback] Unexpected callback failure", error);
    return loginRedirect(request, "exchange_failed");
  }
}
