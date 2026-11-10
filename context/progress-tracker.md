# Progress Tracker

Update this file after every completed feature. Any AI agent reading this should immediately know what is done, what is in progress, and what is next.

---

## Current Status

**Phase:** Phase 2 — Profile Page
**Last completed:** 04 Database Schema
**Next:** 05 Profile Page — Full UI

---

## Progress

### Phase 1 — Foundation

- [x] 01 Homepage
- [x] 02 Auth
- [x] 03 PostHog Initialization
- [x] 04 Database Schema

### Phase 2 — Profile Page

- [ ] 05 Profile Page — Full UI
- [ ] 06 Profile Save Logic
- [ ] 07 AI Profile Extraction from Resume
- [ ] 08 Resume PDF Generation from Profile

### Phase 3 — Find Jobs Page

- [ ] 09 Find Jobs Page — Full UI
- [ ] 10 Adzuna Job Discovery
- [ ] 11 Filter + Sort + Pagination

### Phase 4 — Job Details Page

- [ ] 12 Job Details Page — Full UI
- [ ] 13 Company Research Agent

### Phase 5 — Dashboard

- [ ] 14 Dashboard Page — Full UI
- [ ] 15 Stats Bar — Real Data
- [ ] 16 Recent Activity — Real Data
- [ ] 17 Analytics Charts — PostHog Data

---

## Decisions Made During Build

- The homepage is split into reusable layout and marketing components matching the delivered landing-page design.
- Supplied artwork in `public/images` is used for product previews rather than recreated UI mockups.
- Homepage CTAs remain public and resolve to `/dashboard` for authenticated users or `/login` for guests.
- Authentication uses `@insforge/sdk/ssr` with server-side PKCE initiation and exchange, HTTP-only refresh-token cookies, `/api/auth/refresh`, and Next.js 16 `proxy.ts` route protection.
- The OAuth application callback is `/api/auth/callback`; only localhost should be allowlisted until a production deployment URL exists.
- PostHog browser initialization runs before hydration through `instrumentation-client.ts`, while the root layout provider exposes the shared client to authentication lifecycle components.
- PostHog server events use a fresh `posthog-node` client with immediate flushing; every call site must await `shutdown()` before returning.
- Database infrastructure is managed through versioned InsForge migrations, with
  least-privilege grants and owner-scoped RLS enforced independently of app filters.
- Resume storage uses a private bucket, a durable object key, owner attribution,
  and a restrictive `{user_id}/resume.pdf` path policy.

---

## Notes

- Homepage visually verified at a 1920px desktop viewport and constrained for responsive layouts.
- Auth UI, callback and refresh handlers, protected-route proxy, sign-out action, and temporary protected dashboard are implemented.
- `/login` uses request-time rendering with `connection()` and `instant = false`.
- Authentication code review findings are resolved: the app URL is required, callback failures are handled, and SDK guidance is current.
- Feature 02 is complete.
- PostHog identifies authenticated users by their stable auth user ID and resets browser identity on logout.
- Feature 03 is complete; lint and the Next.js production build pass.
- Feature 04 is merged and applied to the parent Job Pilot InsForge backend.
- The four application tables, constraints, indexes, grants, RLS policies, and
  private `resumes` bucket passed structural verification.
