import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createInsforgeServer } from "@/lib/insforge-server";
import { LoginCard } from "@/components/auth/LoginCard";
import { getPostHogClient } from "@/lib/posthog-server";

export const metadata: Metadata = {
  title: "Sign In — JobPilot",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const insforge = await createInsforgeServer();
  const {
    data: { user },
  } = await insforge.auth.getCurrentUser();

  if (user) redirect("/dashboard");

  const { error } = await searchParams;

  const posthog = getPostHogClient();
  posthog.capture({
    distinctId: "anonymous",
    event: "sign_in_page_viewed",
    properties: { has_error: !!error, error_reason: error ?? null },
  });

  return <LoginCard oauthError={error} />;
}
