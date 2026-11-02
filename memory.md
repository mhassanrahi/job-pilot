# Memory — Feature 03 PostHog Initialization Complete

Last updated: 2026-11-02 14:31 +01:00

## What was built

- Added the PostHog browser client in `lib/posthog-client.ts`, initialized before hydration through `instrumentation-client.ts`.
- Added the root analytics provider and authenticated-user identification components under `components/analytics/`.
- Added `components/auth/SignOutButton.tsx` so logout resets the PostHog browser identity before the existing server action runs.
- Added the `posthog-node` server client in `lib/posthog-server.ts` with immediate flushing for future server-side events.
- Added the documented PostHog environment placeholders and updated the progress tracker and UI registry.

## Decisions made

- Browser analytics initialization remains centralized in `lib/`, with Next.js client instrumentation starting it before hydration and the root layout provider exposing the singleton client.
- Authenticated users are identified by the stable InsForge user ID; email is only a person property.
- Server features must create a PostHog client per operation and await `shutdown()` before returning.
- Feature 03 introduces no custom events; future captures must use only the four event names approved in `context/code-standards.md`.

## Problems solved

- Replaced an out-of-scope OpenTelemetry log exporter with the planned `posthog-node` server client.
- Removed unapproved OAuth start and sign-out event names.
- Split analytics identification, provider, sign-out, and OAuth button responsibilities into one component per file.
- Added visible configuration errors instead of silently disabling browser analytics when PostHog configuration is missing.
- Resolved the Feature 03 review findings covering plan alignment, dependency policy, architecture boundaries, documentation, and component organization.

## Current state

- Feature 03 is complete and marked complete in `context/progress-tracker.md`.
- Lint and the Next.js 16.4.3 production build pass.
- Browser initialization, root provider wiring, authenticated identification, logout reset, and the future server-event client are implemented.
- Live event ingestion has not yet been exercised because the four approved product events belong to later features.
- The dependency audit reports 16 moderate advisories and the existing 3 high-severity Zod advisories; the Zod issue remains upstream through the InsForge SDK with no compatible fix currently available.

## Next session starts with

Begin Feature 04 — Database Schema, following `context/build-plan.md` and using the InsForge CLI skill before changing backend infrastructure.

## Open questions

- Confirm live PostHog ingestion when the first approved product event is implemented.
- Add production PostHog and OAuth configuration when a deployment URL exists.
- Recheck dependency advisories when compatible InsForge and PostHog releases are available.
- `/privacy` and `/terms` still point to unimplemented routes.
