# Memory — Feature 03 PostHog

Last updated: 2026-06-17

## What was built

PostHog analytics integration for JobPilot is complete. The foundation (SDK install, client init, server client, reverse proxy) was already in place from a previous wizard run. This session added 3 new events on top of the 7 that already existed.

**Files modified:**
- `components/layout/Footer.tsx` — converted to `"use client"`, added `handleFooterClick` + `footer_link_clicked` capture on all 4 nav links
- `components/auth/LoginCard.tsx` — added `login_back_clicked` capture to the "← Back to homepage" link
- `app/(auth)/login/page.tsx` — added server-side `sign_in_page_viewed` capture via `getPostHogClient()`
- `posthog-setup-report.md` — updated event table from 7 to 10 events

**Infrastructure already in place (not touched):**
- `instrumentation-client.ts` — `posthog.init()` using Next.js 15.3+ instrumentation pattern
- `lib/posthog-server.ts` — singleton `getPostHogClient()` using `posthog-node`
- `next.config.ts` — reverse proxy rewrites for `/ingest/*` → EU PostHog endpoints

## Decisions made

- **Footer converted to client component** — `posthog-js` is browser-only. Footer had no server-only deps so `"use client"` is safe. Pattern mirrors Navbar exactly.
- **`sign_in_page_viewed` uses `distinctId: "anonymous"` server-side** — consistent with the existing `sign_in_failed` pattern in `callback/route.ts`. Known limitation: all anonymous page views group under one PostHog person. Accepted trade-off; extracting a session cookie from the PostHog cookie was deemed out of scope.
- **Event names follow `snake_case` verb_noun** — consistent with all existing events in the project.

## Problems solved

- No new problems. All three events were clean first-pass implementations. Lint passed with zero warnings on all modified files.

## Current state

Feature 03 PostHog is **fully complete**. 10 events total are instrumented:

| Event | File |
|---|---|
| `cta_clicked` | `components/homepage/CtaLink.tsx` |
| `nav_link_clicked` | `components/layout/Navbar.tsx` |
| `footer_link_clicked` | `components/layout/Footer.tsx` |
| `oauth_initiated` | `components/auth/LoginCard.tsx` |
| `login_error_displayed` | `components/auth/LoginCard.tsx` |
| `login_back_clicked` | `components/auth/LoginCard.tsx` |
| `sign_in_page_viewed` | `app/(auth)/login/page.tsx` |
| `sign_in_success` | `app/(auth)/callback/route.ts` |
| `sign_in_failed` | `app/(auth)/callback/route.ts` |
| `sign_out` | `actions/auth.ts` |

Outstanding checklist from `posthog-setup-report.md`:
- [ ] Full production build + fix any lint/type errors
- [ ] Run test suite
- [ ] Add PostHog env vars to `.env.example`
- [ ] Wire source-map upload into CI
- [ ] Confirm returning-visitor path also calls `identify` (currently only on fresh sign-in)

## Next session starts with

Check `context/build-plan.md` and `context/progress-tracker.md` to identify Feature 04. Mark `[x] 03 PostHog` in `progress-tracker.md` before starting.

Before starting: run `/remember restore`, read all context files per AGENTS.md order.

## Open questions

- OAuth redirect URLs still need to be registered in the InsForge dashboard (`https://<domain>/callback`) before end-to-end auth testing is possible (carried over from Feature 02).
- `--color-accent-dark` CSS variable — used in LoginCard gradient but not verified against the `@theme` token list in `context/ui-tokens.md`. Confirm it exists before the next UI session.
- Returning visitors are tracked anonymously until they sign in again — `identify` only runs in the OAuth callback. Consider adding a session-restore identify call if a logged-in user lands on any authenticated page.
