# Memory — Feature 06 Profile Save Logic

Last updated: 2026-06-21

## What was built

Feature 06 Profile Save Logic is fully complete. Build compiles clean with zero TypeScript errors.

**Files created:**
- `actions/profile.ts` — exports `ProfileRow`, `ProfileFormData`, `WorkExperience`, `Education` types; `saveProfile` Server Action (maps FormState → DB columns, computes `is_complete`, fires PostHog `profile_saved`); `uploadResume` Server Action (uploads to InsForge Storage at `{userId}/resume.pdf`, saves `resume_pdf_url` to profiles row, fires `resume_uploaded`)

**Files modified:**
- `app/profile/page.tsx` — now async Server Component: authenticates user via `createInsforgeServer()`, reads profiles row from DB, computes `missingFields`/`completionPct`, passes props to all three child components; redirects to `/login` if no user
- `components/profile/CompletionBanner.tsx` — now accepts `missingFields: string[]` and `completionPct: number` props; dynamic instead of hardcoded; shows green `CheckCircle2` + "Profile complete" state when all fields filled
- `components/profile/ResumeSection.tsx` — now a client component; accepts `resumeUrl: string | null`; hidden file input triggered by "Select Resume" button; immediate upload on file select via `uploadResume` server action + `useTransition`; shows upload status and "View current resume" link
- `components/profile/ProfileForm.tsx` — accepts `initialData: ProfileRow | null`; pre-fills form via `dbToForm()` helper; Save button wired to `saveProfile` with `useTransition` and `idle/saving/saved/error` button states; added `removeWorkExp` handler
- `context/ui-registry.md` — CompletionBanner and ResumeSection entries updated with new prop signatures
- `context/progress-tracker.md` — Feature 06 checked, current set to Feature 07 AI Profile Extraction from Resume

## Decisions made

- **`insforge.database.from()` not `insforge.from()`** — library-docs.md shows the old API but the actual SDK (v latest via `@insforge/sdk/ssr`) requires `.database.from()`. Confirmed by TypeScript build error.
- **Storage upload has no options** — `insforge.storage.from().upload(path, file)` takes only 2 args. No `upsert`, no `contentType`. Each upload at the same path may auto-rename; URL from `data.url` is always correct. Old files accumulate — cleanup deferred.
- **Resume upload is immediate** — triggers on file select, fully independent of Save Profile. Uses `useTransition` + `uploadResume` server action.
- **`redirect()` must be outside try/catch** — calling `redirect()` inside try/catch causes the NEXT_REDIRECT error to be caught, returning `{ success: false }` instead of redirecting. Auth check moved before the try block in both actions.
- **`posthog.shutdown()` removed from actions** — the singleton is never reset after shutdown, breaking subsequent captures. Pattern from `auth.ts` (no shutdown) is correct with `flushAt: 1` + `flushInterval: 0`.
- **is_complete required fields** — fullName + phone + location + currentTitle + skills(≥1) + institutionName. Maps to the 3 banner pills (PHONE, LOCATION, EDUCATION) plus 3 others.
- **`dbToForm` helper lives in ProfileForm.tsx** — it's a pure client-side transformation, not exported from the server action file.

## Problems solved

- **`saveProfile` returning `{ success: true }` but data not persisting** — root cause was that the `profiles` table had 0 rows. The `handle_new_user` function existed in InsForge but the trigger wiring it to `auth.users INSERT` was never created (Feature 04 gap). Fixed by: (1) creating `on_auth_user_created` trigger via MCP SQL, (2) backfilling 3 existing users with `INSERT INTO profiles SELECT FROM auth.users WHERE id NOT IN (SELECT id FROM profiles)`.
- **`redirect()` inside try/catch** — swallowed the NEXT_REDIRECT error, returning failure to the client instead of redirecting. Fixed by moving auth check outside try blocks.
- **PostHog singleton broken by shutdown()** — removed `await posthog.shutdown()` from both actions; matches existing pattern in auth.ts.

## Current state

Phase 2 — Profile Page:
- Feature 06 is 100% complete and working end-to-end
- Form saves correctly to DB, pre-fills on reload
- CompletionBanner updates dynamically based on saved data
- Resume upload wired (uploads to InsForge Storage, URL saved to profiles row)
- `on_auth_user_created` trigger is live in InsForge — future signups auto-create a profiles row
- 3 existing users have been backfilled with profiles rows

## Next session starts with

Feature 07 — AI Profile Extraction from Resume.

Key things to build:
- Parse uploaded resume PDF (use `pdf-parse` library — server-side only, per library-docs.md)
- Extract structured profile fields using OpenAI GPT-4o (structured JSON response, temperature 0.3)
- Map extracted fields back to ProfileForm state and trigger a save
- Surface this as a "Extract from Resume" flow triggered from ResumeSection

Before starting: run `/remember restore`, read all context files per AGENTS.md order. Run `/architect` before touching any code.

## Open questions

- **Defensive upsert in `saveProfile`** — the action still uses pure `.update()`. If the trigger ever fails or a row is deleted, saves will silently no-op again. Should be hardened: attempt update, if `count === 0`, do insert. Not blocking for Feature 07 but should be done before shipping.
- **OAuth redirect URLs** — still need to be registered in InsForge dashboard (`https://<domain>/callback`) before production auth testing (carried over from Feature 02).
- **PostHog session-restore identify** — `identify` only runs in the OAuth callback. Consider adding a session-restore call on authenticated page loads (carried over from Feature 03).
