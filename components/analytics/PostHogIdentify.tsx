"use client";

import { useEffect } from "react";
import { usePostHog } from "posthog-js/react";

type Props = {
  distinctId: string;
  email: string;
};

export function PostHogIdentify({ distinctId, email }: Props) {
  const posthog = usePostHog();

  useEffect(() => {
    posthog.identify(distinctId, { email });
  }, [distinctId, email, posthog]);

  return null;
}
