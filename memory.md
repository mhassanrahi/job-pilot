# Memory — Feature 02 Authentication Complete

Last updated: 2026-11-01 14:28 +01:00

## What was built

- Completed Google and GitHub OAuth with `@insforge/sdk/ssr`, including server-side PKCE initiation, callback exchange, session refresh, and sign-out.
- Added the login experience under `app/(auth)/`, authentication routes under `app/api/auth/`, protected-route handling in `proxy.ts`, and the shared InsForge clients in `lib/`.
- Added a temporary protected dashboard and made homepage CTAs authentication-aware behind Suspense boundaries.
- Added a tracked `.env.example` and updated the architecture, library, dependency, UI registry, and progress documentation.

## Decisions made

- OAuth initiation and code exchange remain server-side so the refresh token stays in an HTTP-only cookie.
- `/` remains public; authenticated homepage CTAs lead to `/dashboard`, and authenticated `/login` visits redirect there.
- `/login` intentionally uses request-time rendering with `connection()` and `instant = false`.
- `NEXT_PUBLIC_APP_URL` is required for OAuth redirects; production must never fall back to localhost.

## Problems solved

- Isolated homepage session reads behind Suspense boundaries for Next.js Cache Components.
- Prevented InsForge time-dependent initialization from running during prerendering and resolved the `/login` instant-navigation validation error.
- Added controlled OAuth callback failure handling without catching Next.js prerender interruption signals.
- Resolved review findings covering deployment-origin configuration, callback reliability, tracked environment documentation, and obsolete InsForge SDK guidance.

## Current state

- Feature 02 is complete and marked complete in `context/progress-tracker.md`.
- Lint and the Next.js 16.4.3 production build pass.
- The login page, protected routes, callback/refresh flow, sign-out path, and authentication-aware homepage are implemented.
- The latest InsForge SDK dependency tree still has an upstream high-severity Zod advisory with no compatible fix currently available.

## Next session starts with

Begin Feature 03 — PostHog Initialization, following `context/build-plan.md` and the existing project library rules.

## Open questions

- Add the production OAuth callback URL and production `NEXT_PUBLIC_APP_URL` when a deployment URL exists.
- Recheck the upstream InsForge/Zod advisory when a newer compatible SDK release is available.
- `/privacy` and `/terms` still point to unimplemented routes.
