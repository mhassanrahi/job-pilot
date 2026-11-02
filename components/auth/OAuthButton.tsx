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
        className="flex size-5 items-center justify-center text-text-dark"
      >
        {isGoogle ? (
          <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
            <path d="M21.35 11.1h-9.18v2.98h5.27c-.23 1.52-1.74 4.46-5.27 4.46-3.17 0-5.76-2.62-5.76-5.85s2.59-5.85 5.76-5.85c1.81 0 3.02.77 3.71 1.44l2.53-2.44C16.79 4.33 14.69 3.4 12.17 3.4c-5.15 0-9.33 4.17-9.33 9.29s4.18 9.29 9.33 9.29c5.39 0 8.96-3.79 8.96-9.13 0-.61-.07-1.07-.15-1.56z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
            <path d="M12 .7a11.5 11.5 0 0 0-3.64 22.41c.58.11.79-.25.79-.56v-2.23c-3.22.7-3.9-1.37-3.9-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.72 1.27 3.38.97.1-.75.41-1.27.74-1.56-2.57-.29-5.27-1.29-5.27-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.16 1.18a10.95 10.95 0 0 1 5.75 0c2.19-1.49 3.16-1.18 3.16-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.4-2.71 5.38-5.29 5.67.42.36.79 1.06.79 2.14v3.26c0 .31.21.68.8.56A11.5 11.5 0 0 0 12 .7Z" />
          </svg>
        )}
      </span>
      {pending ? `Connecting to ${label}…` : `Continue with ${label}`}
    </button>
  );
}
