import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { startOAuth } from "@/actions/auth";
import { OAuthButton } from "@/components/auth/OAuthButton";
import { createInsforgeServer } from "@/lib/insforge-server";
import type { OAuthProvider } from "@/types";

export const instant = false;

const ERROR_MESSAGES: Record<string, string> = {
  exchange_failed: "We couldn’t complete sign-in. Please try again.",
  invalid_provider: "That sign-in option isn’t available.",
  missing_verifier: "Your sign-in session expired. Please try again.",
  oauth_failed: "Sign-in was cancelled or declined by the provider.",
  oauth_start_failed: "We couldn’t start sign-in. Please try again.",
};

function isOAuthProvider(provider: string): provider is OAuthProvider {
  return provider === "google" || provider === "github";
}

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const params = await searchParams;
  const requestedError = typeof params.error === "string" ? params.error : null;
  const insforge = await createInsforgeServer();
  const [{ data: userData }, { data: authConfig, error: configError }] =
    await Promise.all([
      insforge.auth.getCurrentUser(),
      insforge.auth.getPublicAuthConfig(),
    ]);

  if (userData.user) {
    redirect("/dashboard");
  }

  if (configError) {
    console.error("[login] Failed to load OAuth providers", configError);
  }

  const configuredProviders = new Set(
    authConfig?.oAuthProviders.filter(isOAuthProvider) ?? [],
  );
  const providerOrder: OAuthProvider[] = ["google", "github"];
  const enabledProviders = providerOrder.filter(
    (provider) => configuredProviders.has(provider),
  );
  const errorMessage = requestedError
    ? ERROR_MESSAGES[requestedError] ?? "We couldn’t sign you in. Please try again."
    : null;

  return (
    <main className="soft-spectrum flex min-h-screen items-center justify-center px-5 py-12">
      <section className="w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-lg sm:p-8">
        <div className="text-center">
          <Link href="/" aria-label="JobPilot home" className="inline-flex">
            <Image src="/logo.png" alt="JobPilot" width={148} height={50} priority />
          </Link>
          <h1 className="mt-8 text-3xl font-semibold tracking-[-0.03em] text-text-primary">
            Welcome to JobPilot
          </h1>
          <p className="mt-3 text-sm leading-6 text-text-secondary">
            Sign in to discover stronger matches and prepare with confidence.
          </p>
        </div>

        {errorMessage ? (
          <p
            role="alert"
            className="mt-6 rounded-md border border-error/20 bg-error/5 px-4 py-3 text-sm text-error"
          >
            {errorMessage}
          </p>
        ) : null}

        <div className="mt-8 space-y-3">
          {enabledProviders.map((provider) => (
            <form action={startOAuth} key={provider}>
              <input type="hidden" name="provider" value={provider} />
              <OAuthButton provider={provider} />
            </form>
          ))}
        </div>

        {enabledProviders.length === 0 ? (
          <p className="mt-8 rounded-md border border-border bg-surface-secondary px-4 py-3 text-center text-sm text-text-secondary">
            Sign-in is temporarily unavailable. Please try again shortly.
          </p>
        ) : null}

        <p className="mt-8 text-center text-xs leading-5 text-text-muted">
          By continuing, you agree to our{" "}
          <Link href="/terms" className="text-text-dark hover:text-accent">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-text-dark hover:text-accent">
            Privacy Policy
          </Link>
          .
        </p>

        <div className="mt-6 border-t border-border pt-6 text-center">
          <Link href="/" className="text-sm font-medium text-text-dark hover:text-accent">
            Back to homepage
          </Link>
        </div>
      </section>
    </main>
  );
}
