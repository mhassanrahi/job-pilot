"use client";

import { useFormStatus } from "react-dom";
import type { OAuthProvider } from "@/types";

type Props = {
  provider: OAuthProvider;
};

export function OAuthButton({ provider }: Props) {
  const { pending } = useFormStatus();
  const isGoogle = provider === "google";
  const label = isGoogle ? "Google" : "GitHub";

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center gap-3 rounded-md border border-border bg-surface px-4 py-3.5 text-sm font-medium text-text-primary transition-colors hover:bg-surface-secondary disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span
        aria-hidden="true"
        className="flex size-6 items-center justify-center rounded-full border border-border text-xs font-semibold text-text-dark"
      >
        {isGoogle ? "G" : "GH"}
      </span>
      {pending ? `Connecting to ${label}…` : `Continue with ${label}`}
    </button>
  );
}
