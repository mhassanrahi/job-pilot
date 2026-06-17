"use server";

import { createAuthActions } from "@insforge/sdk/ssr";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { createInsforgeServer } from "@/lib/insforge-server";
import { getPostHogClient } from "@/lib/posthog-server";

export async function signInWithOAuth(
  provider: "google" | "github",
): Promise<{ error: string }> {
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

  const insforge = await createInsforgeServer();
  const { data: { user } } = await insforge.auth.getCurrentUser();

  const auth = createAuthActions({ cookies: cookieStore });
  const { error } = await auth.signOut();
  if (error) console.error("[signOut]", error);

  if (user) {
    const posthog = getPostHogClient();
    posthog.capture({
      distinctId: user.id,
      event: "sign_out",
      properties: { email: user.email },
    });
  }

  redirect("/login");
}
