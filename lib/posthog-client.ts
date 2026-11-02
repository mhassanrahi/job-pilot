import posthog from "posthog-js";

let initialized = false;
let configurationErrorReported = false;

export function initPostHog(): typeof posthog | null {
  if (initialized) {
    return posthog;
  }

  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (!posthogKey || !posthogHost) {
    if (!configurationErrorReported) {
      console.error(
        "[lib/posthog-client] NEXT_PUBLIC_POSTHOG_KEY and NEXT_PUBLIC_POSTHOG_HOST are required; browser analytics are disabled",
      );
      configurationErrorReported = true;
    }

    return null;
  }

  posthog.init(posthogKey, {
    api_host: posthogHost,
    autocapture: false,
    capture_pageview: false,
    defaults: "2025-05-24",
    debug: process.env.NODE_ENV === "development",
  });
  initialized = true;

  return posthog;
}

export { posthog as posthogClient };
