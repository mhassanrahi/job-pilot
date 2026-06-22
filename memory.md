# Memory — Feature 08 Resume PDF Generation from Profile

Last updated: 2026-06-22

## What was built

Feature 08 Resume PDF Generation from Profile — fully implemented and verified end-to-end.

**Files created:**
- `app/api/resume/generate/route.tsx` — POST route: auth → fetch profile from DB → OpenRouter LLM generates `professionalSummary` + `polishedExperience` bullets → `@react-pdf/renderer` renders PDF buffer → delete existing storage file using stored key → upload blob → save `url` + `key` to profiles table → return `{ success, url }`

**Files modified:**
- `components/profile/ResumeSection.tsx` — added `generating` phase to state machine; "Generate Resume from Profile" button wired to `handleGenerate()`; `handleViewResume` always uses `getResumeSignedUrl()` (removed `generatedUrl` shortcut that caused 401); both buttons disabled during any active phase
- `actions/profile.ts` — `uploadResume` now fetches `resume_pdf_key` from DB before uploading, calls `remove(key)` with error logging, saves both `uploadData.url` and `uploadData.key` to profiles; added `resume_pdf_key: string | null` to `ProfileRow` type
- `next.config.ts` — added `@react-pdf/renderer` to `serverExternalPackages`
- `context/progress-tracker.md` — updated with Feature 08 complete and all storage patterns documented

**DB changes:**
- Added `resume_pdf_key text` column to `profiles` table
- Added `CREATE POLICY "users can delete own resume"` on `storage.objects` — DELETE policy was missing, causing every `remove()` call to be silently rejected by RLS

**Packages installed:** `@react-pdf/renderer`

## Decisions made

- **AI generates narrative only** — LLM writes `professionalSummary` paragraph and `polishedExperience` bullets per role; all structured data (name, contact, skills, education) comes verbatim from the DB
- **route.tsx not route.ts** — `@react-pdf/renderer` uses JSX; the file must be `.tsx`
- **Blob not Buffer** — `insforge.storage.upload()` expects `File | Blob`; wrap Node.js Buffer with `new Blob([new Uint8Array(buffer)], { type: "application/pdf" })`
- **Always use stored key for deletion** — InsForge storage auto-renames on conflict; the actual key after upload can differ from the path you passed; `uploadData.key` must be saved to DB and used for `remove()` — never construct the path yourself
- **DELETE RLS policy required** — storage objects table needs an explicit DELETE policy; without it `remove()` is silently rejected. Pattern matches existing policies: `bucket = 'resumes'` AND `split_part(key, '/', 1) = auth.uid()::text`
- **View resume always via signed URL** — raw `uploadData.url` requires auth headers; always call `getResumeSignedUrl()` before opening in a new tab
- **PDF uses hardcoded hex values** — `@react-pdf/renderer` StyleSheet cannot use CSS variables; hex values from `ui-tokens.md` are hardcoded in the PDF template — this is the explicit exception to the no-hex rule

## Problems solved

- **Multiple resume files per user** — three-layer fix: (1) save `uploadData.key` to DB, (2) call `remove(storedKey)` before uploading, (3) add DELETE RLS policy that was missing — all three were required together
- **401 on "View current resume" after generation** — raw storage URL requires auth; removed `generatedUrl` shortcut, `handleViewResume` now always fetches a signed URL
- **`remove()` silently failing** — no error was checked; added `console.error` on remove failure so future issues are visible
- **`remove()` accepts single string not array** — InsForge SDK `remove(path)` takes a string, not `string[]` like Supabase

## Current state

Feature 08 is complete and verified. Storage correctly maintains one file per user. Viewing works via signed URL. Generation → upload → view flow is end-to-end correct.

## Next session starts with

Move to Feature 09 — Find Jobs Page Full UI. Before starting: run `/remember restore`, read context files per AGENTS.md order, run `/architect` before touching any code.

## Open questions

- **Defensive upsert in `saveProfile`** — still uses pure `.update()`; if trigger fails or row deleted, saves silently no-op. Should upsert before shipping (carried over from Feature 06)
- **OAuth redirect URLs** — need to be registered in InsForge dashboard before production auth testing (carried over from Feature 02)
- **PostHog session-restore identify** — `identify` only runs in OAuth callback; consider adding on authenticated page loads (carried over from Feature 03)
- **Stale resume files in storage** — any files accumulated before the delete fix (resume (1).pdf, resume (2).pdf etc.) must be manually deleted from the InsForge storage dashboard
