# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the JobPilot Next.js App Router project. Client-side tracking is initialized in `instrumentation-client.ts` (Next.js 15.3+ pattern), with a reverse proxy configured in `next.config.ts` to route PostHog requests through `/ingest`. A shared server-side client (`lib/posthog-server.ts`) handles all server-side event capture and user identification. Ten key events are tracked across the authentication flow, marketing homepage, and navigation.

| Event | Description | File |
|---|---|---|
| `cta_clicked` | User clicks a CTA button on the marketing homepage | `components/homepage/CtaLink.tsx` |
| `oauth_initiated` | User clicks Google or GitHub sign-in button | `components/auth/LoginCard.tsx` |
| `login_error_displayed` | Auth error message shown due to a failed OAuth callback | `components/auth/LoginCard.tsx` |
| `login_back_clicked` | User clicks the "← Back to homepage" link on the login page | `components/auth/LoginCard.tsx` |
| `sign_in_page_viewed` | User lands on the sign-in page (server-side, includes error context) | `app/(auth)/login/page.tsx` |
| `sign_in_success` | OAuth callback completes and user is redirected to dashboard | `app/(auth)/callback/route.ts` |
| `sign_in_failed` | OAuth callback fails (missing code, exchange error, or provider error) | `app/(auth)/callback/route.ts` |
| `sign_out` | User signs out of their account | `actions/auth.ts` |
| `nav_link_clicked` | User clicks a navigation link (Dashboard, Find Jobs, Profile) in the navbar | `components/layout/Navbar.tsx` |
| `footer_link_clicked` | User clicks a navigation link in the site footer | `components/layout/Footer.tsx` |

Users are identified server-side by their InsForge user ID immediately after a successful sign-in (`sign_in_success`). The `oauth_initiated` handler also captures exception details on client-side OAuth errors via `posthog.captureException`.

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://eu.posthog.com/project/204383/dashboard/756639)
- [Sign-in Conversion Funnel](https://eu.posthog.com/project/204383/insights/bSsBjHCA) — Conversion from CTA click → OAuth initiated → sign-in success
- [Authentication Events Over Time](https://eu.posthog.com/project/204383/insights/AcDCYv6v) — Daily trend of sign-in successes, failures, and sign-outs
- [CTA Clicks by Location](https://eu.posthog.com/project/204383/insights/qluA8wjk) — Homepage CTA clicks broken down by hero / bottom_cta / navbar
- [Sign-in Errors (Last 30 Days)](https://eu.posthog.com/project/204383/insights/utJGhZes) — Total failed sign-in attempts; spike = possible OAuth outage
- [Nav Link Clicks by Destination](https://eu.posthog.com/project/204383/insights/Fo5N31bH) — Which navbar links users click most

## Verify before merging

- [ ] Run a full production build (`npm run build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any onboarding/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — currently identification only runs in the OAuth callback. A user who has a valid session from a previous visit will be anonymous until they sign in again in a new browser.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
