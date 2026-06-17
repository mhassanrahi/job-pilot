import { createAuthActions } from "@insforge/sdk/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("insforge_code");
  const errorParam = searchParams.get("error");

  if (errorParam || !code) {
    const msg = encodeURIComponent(errorParam ?? "missing_code");
    return NextResponse.redirect(new URL(`/login?error=${msg}`, origin));
  }

  const cookieStore = await cookies();
  const codeVerifier =
    cookieStore.get("insforge_code_verifier")?.value ?? undefined;

  const auth = createAuthActions({ cookies: cookieStore });

  let exchangeError: unknown;
  try {
    const { error } = await auth.exchangeOAuthCode(code, codeVerifier);
    exchangeError = error;
  } catch (err) {
    exchangeError = err;
  }

  if (codeVerifier) {
    cookieStore.delete("insforge_code_verifier");
  }

  if (exchangeError) {
    return NextResponse.redirect(new URL("/login?error=exchange_failed", origin));
  }

  return NextResponse.redirect(new URL("/dashboard", origin));
}
