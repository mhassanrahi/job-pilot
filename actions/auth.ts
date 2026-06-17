"use server";

import { createAuthActions } from "@insforge/sdk/ssr";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export async function signInWithOAuth(
  provider: "google" | "github",
): Promise<{ error: string } | never> {
  const cookieStore = await cookies();
  const auth = createAuthActions({ cookies: cookieStore });

  const headerStore = await headers();
  const host = headerStore.get("host") ?? "localhost:3000";
  const proto = host.includes("localhost") ? "http" : "https";
  const origin = `${proto}://${host}`;

  const { data, error } = await auth.signInWithOAuth(provider, {
    redirectTo: `${origin}/callback`,
    skipBrowserRedirect: true,
  });

  if (error || !data?.url) {
    return { error: "Failed to start sign-in. Please try again." };
  }

  if (data.codeVerifier) {
    cookieStore.set("insforge_code_verifier", data.codeVerifier, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 10,
      path: "/",
    });
  }

  redirect(data.url);
}

export async function signOut(): Promise<void> {
  const cookieStore = await cookies();
  const auth = createAuthActions({ cookies: cookieStore });
  await auth.signOut();
  redirect("/login");
}
