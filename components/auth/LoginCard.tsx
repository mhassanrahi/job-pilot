"use client";

import { useState, useTransition, useEffect } from "react";
import Link from "next/link";
import posthog from "posthog-js";
import { signInWithOAuth } from "@/actions/auth";

type Props = {
  oauthError?: string;
};

export function LoginCard({ oauthError }: Props) {
  const [isPending, startTransition] = useTransition();
  const [pendingProvider, setPendingProvider] = useState<
    "google" | "github" | null
  >(null);
  const [error, setError] = useState<string | null>(
    oauthError ? "Authentication failed. Please try again." : null,
  );

  useEffect(() => {
    if (oauthError) {
      posthog.capture("login_error_displayed", { reason: oauthError });
    }
  }, [oauthError]);

  const handleOAuth = (provider: "google" | "github") => {
    setError(null);
    setPendingProvider(provider);
    posthog.capture("oauth_initiated", { provider });
    startTransition(async () => {
      const result = await signInWithOAuth(provider);
      if (result?.error) {
        setError(result.error);
        setPendingProvider(null);
        posthog.captureException(new Error(result.error), {
          properties: { provider },
        });
      }
    });
  };

  const isLoading = isPending && pendingProvider !== null;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-2xl p-8 w-full max-w-sm shadow-[0px_1px_3px_rgba(0,0,0,0.1),_0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
        <div className="flex items-center gap-3 justify-center mb-6">
          <div
            className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0"
            style={{
              background:
                "linear-gradient(45deg, var(--color-accent) 0%, var(--color-accent-dark) 100%)",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M9 2L15 14H3L9 2Z"
                fill="var(--color-accent-foreground)"
              />
            </svg>
          </div>
          <span className="text-[19px] font-bold leading-7 text-text-darkest">
            JobPilot
          </span>
        </div>

        <h1 className="text-base font-semibold text-text-primary text-center mb-1">
          Sign in to your account
        </h1>
        <p className="text-xs text-text-muted text-center mb-6">
          Find, match, and track jobs with AI
        </p>

        {error && (
          <p className="text-error text-sm text-center mb-4 bg-[color:var(--color-error)]/10 rounded-md py-2 px-3">
            {error}
          </p>
        )}

        <button
          onClick={() => handleOAuth("google")}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 bg-surface border border-border rounded-md px-4 py-2.5 text-sm font-medium text-text-primary hover:bg-surface-secondary transition-colors disabled:opacity-60 disabled:cursor-not-allowed mb-3 cursor-pointer"
        >
          {isPending && pendingProvider === "google" ? (
            <span className="w-4 h-4 border-2 border-border border-t-accent rounded-full animate-spin shrink-0" />
          ) : (
            <GoogleIcon />
          )}
          Continue with Google
        </button>

        <button
          onClick={() => handleOAuth("github")}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 bg-surface border border-border rounded-md px-4 py-2.5 text-sm font-medium text-text-primary hover:bg-surface-secondary transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {isPending && pendingProvider === "github" ? (
            <span className="w-4 h-4 border-2 border-border border-t-accent rounded-full animate-spin shrink-0" />
          ) : (
            <GitHubIcon />
          )}
          Continue with GitHub
        </button>

        <div className="mt-6 text-center">
          <Link
            href="/"
            onClick={() => posthog.capture("login_back_clicked")}
            className="text-xs text-text-muted hover:text-text-secondary transition-colors"
          >
            ← Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

function GitHubIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    // Google brand colors — exact values required by Google's brand guidelines
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M15.68 8.18c0-.57-.05-1.12-.14-1.64H8v3.1h4.3a3.68 3.68 0 0 1-1.6 2.42v2h2.58c1.51-1.39 2.4-3.44 2.4-5.88Z"
        fill="#4285F4"
      />
      <path
        d="M8 16c2.16 0 3.97-.71 5.3-1.94l-2.58-2a4.8 4.8 0 0 1-2.72.77 4.78 4.78 0 0 1-4.5-3.3H.84v2.07A8 8 0 0 0 8 16Z"
        fill="#34A853"
      />
      <path
        d="M3.5 9.53A4.77 4.77 0 0 1 3.25 8c0-.53.09-1.04.25-1.53V4.4H.84A8 8 0 0 0 0 8c0 1.29.31 2.51.84 3.6l2.66-2.07Z"
        fill="#FBBC04"
      />
      <path
        d="M8 3.2a4.33 4.33 0 0 1 3.07 1.2l2.3-2.3A7.7 7.7 0 0 0 8 0a8 8 0 0 0-7.16 4.4L3.5 6.47A4.78 4.78 0 0 1 8 3.2Z"
        fill="#EA4335"
      />
    </svg>
  );
}
