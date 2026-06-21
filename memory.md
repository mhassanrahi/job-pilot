# Memory — Feature 07 AI Profile Extraction from Resume

Last updated: 2026-06-22

## What was built

Feature 07 AI Profile Extraction from Resume — implemented but debugging still in progress at end of session.

**Files created:**
- `app/api/resume/extract/route.ts` — POST API route: auth → signed URL from InsForge Storage → fetch PDF buffer → `pdf-parse` v2 text extraction → OpenRouter LLM call → returns `ExtractedFields` JSON
- `components/profile/ProfilePageClient.tsx` — thin `"use client"` wrapper that holds `extractedFields` state; renders `ResumeSection` (passes `onExtracted` callback) and `ProfileForm` (passes `extractedFields` prop)

**Files modified:**
- `actions/profile.ts` — added `ExtractedFields` type (exported; `Partial<{fullName, phone, location, ...workExperience, education fields}>`)
- `components/profile/ResumeSection.tsx` — phase state machine (`idle → uploading → extracting → complete | error`); after upload success, automatically POSTs to `/api/resume/extract`; `onExtracted` callback fires with parsed fields; extraction failure is silent (upload still completes)
- `components/profile/ProfileForm.tsx` — added `extractedFields: ExtractedFields | null` prop + `useEffect` that merges extracted values into form state when prop changes; preference fields never touched
- `app/profile/page.tsx` — replaced `<ResumeSection>` + `<ProfileForm>` with `<ProfilePageClient initialData={...} resumeUrl={...} />`
- `next.config.ts` — `serverExternalPackages: ["pdf-parse", "@napi-rs/canvas"]`
- `context/progress-tracker.md` and `context/ui-registry.md` — updated

**Packages installed:** `pdf-parse`, `openai`, `@types/pdf-parse` (later uninstalled — v2 has own types)

## Decisions made

- **Extraction is automatic on upload** — no "Extract from Resume" button; fires immediately after upload success inside `useTransition` in `ResumeSection`
- **State sharing via ProfilePageClient** — `ResumeSection` and `ProfileForm` are siblings under a Server Component; thin client wrapper holds shared `extractedFields` state
- **API route, not Server Action** — heavier operation (PDF parse + AI call), matches architecture.md pattern for resume operations at `app/api/resume/`
- **PDF downloaded from storage in API route** — route creates a 60-second signed URL and fetches the buffer server-side; client never re-uploads the file
- **pdf-parse is v2 (class-based)** — `new PDFParse({ data: buffer })` → `parser.getText()` → `result.text`; must import `"pdf-parse/worker"` before `PDFParse` in serverless
- **OpenRouter model** — `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free`; `max_tokens: 8000` required because reasoning trace consumes most tokens before JSON output
- **Reasoning model fallback** — model puts output in non-standard `reasoning` field (not `content`); code checks `content || reasoning`; `parseJsonSafe` extracts JSON by finding outermost `{...}` in mixed text

## Problems solved

- **`pdf-parse` is not a function** — installed package is v2 (class-based API), not the v1 function-based API documented in library-docs.md. Fix: use `new PDFParse({ data: buffer })`.
- **`require()` and `import().default` both failed** — Next.js ESM module context wraps CJS exports; v2 class API solved the problem entirely (no require needed)
- **`content` is null from reasoning model** — `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free` is a reasoning model that writes to `response.choices[0].message.reasoning` not `content`. Fixed with fallback.
- **Reasoning trace truncated at 800 tokens** — reasoning model consumes `max_tokens` budget on the trace itself; raised to 8000 to leave room for JSON output

## Current state

Feature 07 is implemented. Last known issue was the reasoning model producing truncated output at 800 tokens — fixed by raising to 8000. End-to-end verification (upload → extract → form populated) was not completed before session end; next session should verify this works first.

## Next session starts with

1. Verify Feature 07 end-to-end: upload a PDF → confirm form fields populate correctly
3. Then move to Feature 08 — Resume PDF Generation from Profile (`POST /api/resume/generate`, reads profile from DB, nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free generates content, `@react-pdf/renderer` renders to buffer, uploads to InsForge Storage)

Before Feature 08: run `/remember restore`, read context files per AGENTS.md order, run `/architect` before touching any code.

## Open questions

- **Feature 07 end-to-end not confirmed** — last session ended before verifying the 8000 token fix resolved the truncated reasoning issue
- **Defensive upsert in `saveProfile`** — still uses pure `.update()`; if trigger fails or row deleted, saves silently no-op. Should upsert before shipping (carried over from Feature 06)
- **OAuth redirect URLs** — need to be registered in InsForge dashboard before production auth testing (carried over from Feature 02)
- **PostHog session-restore identify** — `identify` only runs in OAuth callback; consider adding on authenticated page loads (carried over from Feature 03)
