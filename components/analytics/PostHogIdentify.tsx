"use client";

import { useEffect } from "react";
import { usePostHog } from "posthog-js/react";

type Props = {
  distinctId: string | null;
  email: string | null;
};

export function PostHogIdentify({ distinctId, email }: Props) {
  const posthog = usePostHog();

  useEffect(() => {
    if (distinctId) {
      posthog.identify(distinctId, email ? { email } : undefined);
      return;
    }

    if (posthog.get_property("$user_id")) {
      posthog.reset();
    }
  }, [distinctId, email, posthog]);

  return null;
}
