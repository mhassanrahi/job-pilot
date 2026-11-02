"use server";

import { createAuthActions } from "@insforge/sdk/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { OAuthProvider } from "@/types";

function isOAuthProvider(value: FormDataEntryValue | null): value is OAuthProvider {
  return value === "google" || value === "github";
}

function getAppUrl(): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!appUrl) {
    throw new Error("NEXT_PUBLIC_APP_URL is required for OAuth redirects");
  }

  return appUrl;
}

export async function startOAuth(formData: FormData): Promise<void> {
  const provider = formData.get("provider");

  if (!isOAuthProvider(provider)) {
    redirect("/login?error=invalid_provider");
  }

  let oauthUrl: string | null = null;

  try {
    const cookieStore = await cookies();
    const auth = createAuthActions({ cookies: cookieStore });
    const redirectTo = new URL("/api/auth/callback", getAppUrl()).toString();
    const { data, error } = await auth.signInWithOAuth(provider, {
      redirectTo,
      skipBrowserRedirect: true,
    });

    if (error || !data?.url || !data.codeVerifier) {
      console.error("[actions/auth:startOAuth] OAuth initiation failed", error);
    } else {
      cookieStore.set("insforge_code_verifier", data.codeVerifier, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 600,
      });
      oauthUrl = data.url;
    }
  } catch (error) {
    console.error("[actions/auth:startOAuth] OAuth initiation failed", error);
  }

  redirect(oauthUrl ?? "/login?error=oauth_start_failed");
}

export async function signOut(): Promise<void> {
  try {
    const auth = createAuthActions({ cookies: await cookies() });
    const { error } = await auth.signOut();

    if (error) {
      console.error("[actions/auth:signOut] Sign out request failed", error);
    }
  } catch (error) {
    console.error("[actions/auth:signOut] Sign out request failed", error);
  }

  redirect("/login");
}
