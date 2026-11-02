"use client";

import type { ReactNode } from "react";
import { PostHogProvider as ReactPostHogProvider } from "posthog-js/react";
import { posthogClient } from "@/lib/posthog-client";

type Props = {
  children: ReactNode;
};

export function PostHogProvider({ children }: Props) {
  return (
    <ReactPostHogProvider client={posthogClient}>
      {children}
    </ReactPostHogProvider>
  );
}
