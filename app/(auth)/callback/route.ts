import { createAuthActions } from "@insforge/sdk/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createInsforgeServer } from "@/lib/insforge-server";
import { getPostHogClient } from "@/lib/posthog-server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("insforge_code");
  const errorParam = searchParams.get("error");

  if (errorParam || !code) {
    const reason = errorParam ?? "missing_code";
    const posthog = getPostHogClient();
    posthog.capture({
      distinctId: "anonymous",
      event: "sign_in_failed",
      properties: { reason },
    });
    const msg = encodeURIComponent(reason);
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
    const posthog = getPostHogClient();
    posthog.capture({
      distinctId: "anonymous",
      event: "sign_in_failed",
      properties: { reason: "exchange_failed" },
    });
    return NextResponse.redirect(new URL("/login?error=exchange_failed", origin));
  }

  const insforge = await createInsforgeServer();
  const { data: { user } } = await insforge.auth.getCurrentUser();
  if (user) {
    const posthog = getPostHogClient();
    posthog.identify({
      distinctId: user.id,
      properties: { email: user.email },
    });
    posthog.capture({
      distinctId: user.id,
      event: "sign_in_success",
      properties: { email: user.email },
    });
  }

  return NextResponse.redirect(new URL("/dashboard", origin));
}
