"use client";

import { usePostHog } from "posthog-js/react";

export function SignOutButton() {
  const posthog = usePostHog();

  return (
    <button
      type="submit"
      onClick={() => posthog.reset()}
      className="rounded-md bg-overlay px-6 py-3 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
    >
      Sign out
    </button>
  );
}
