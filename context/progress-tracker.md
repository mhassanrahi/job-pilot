# Progress Tracker

Update this file after every completed feature. Any AI agent reading this should immediately know what is done, what is in progress, and what is next.

---

## Current Status

**Phase:** Phase 2 — Profile Page
**Last completed:** 08 Resume PDF Generation from Profile
**Next:** 09 Find Jobs Page — Full UI

---

## Progress

### Phase 1 — Foundation

- [x] 01 Homepage
- [x] 02 Auth
- [x] 03 PostHog Initialization
- [x] 04 Database Schema

### Phase 2 — Profile Page

- [x] 05 Profile Page — Full UI
- [x] 06 Profile Save Logic
- [x] 07 AI Profile Extraction from Resume
- [x] 08 Resume PDF Generation from Profile

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

- **Profile auto-creation**: `handle_new_user` trigger on `auth.users INSERT` creates a blank profiles row automatically — ensures a row always exists before any agent or profile code runs
- **`updated_at` trigger**: `handle_updated_at` BEFORE UPDATE trigger on profiles — app code never needs to pass this field explicitly
- **storage.objects RLS**: InsForge uses `bucket` and `key` columns (not Supabase's `bucket_id`/`name`) — policies use `split_part(key, '/', 1) = auth.uid()::text` to scope to own path
- **DB API is `insforge.database.from()`**: library-docs.md shows `insforge.from()` but the actual SDK (v latest) requires `insforge.database.from()` — confirmed by TypeScript error in build
- **Storage upload has no options**: `upload(path, file)` takes only 2 args — no `upsert`, no `contentType`. Each upload at the same path may auto-rename; URL from `data.url` is always correct
- **is_complete required fields**: fullName + phone + location + currentTitle + skills(≥1) + institutionName — maps to the 3 banner pills (PHONE, LOCATION, EDUCATION)
- **Resume upload is immediate**: triggers on file select, independent of Save Profile — uses `useTransition` + `uploadResume` server action
- **pdf-parse import**: `moduleResolution: "bundler"` resolves to ESM stub (no default export) — use `require("pdf-parse")` with explicit type cast; `serverExternalPackages: ["pdf-parse"]` in next.config.ts handles runtime
- **Extraction is automatic**: after upload success, POST `/api/resume/extract` fires immediately (no button) — extraction failure is silent, upload success is not affected
- **State sharing via ProfilePageClient**: `ResumeSection` and `ProfileForm` are siblings; `ProfilePageClient.tsx` (thin client wrapper) holds `extractedFields` state and passes `onExtracted` / `extractedFields` props to each
- **OpenRouter model for extraction**: `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free` via `OPENROUTER_API_KEY` — uses `openai` package with `baseURL: "https://openrouter.ai/api/v1"`
- **PDF generation route is .tsx**: `app/api/resume/generate/route.tsx` — JSX required for `@react-pdf/renderer` Document/Page components; `@react-pdf/renderer` in `serverExternalPackages`
- **Storage upload needs Blob**: `insforge.storage.upload()` expects `Blob`, not Node.js `Buffer` — wrap with `new Blob([new Uint8Array(buffer)], { type: "application/pdf" })`
- **Storage remove takes a single string**: `insforge.storage.from("bucket").remove(key)` — NOT an array like Supabase
- **Storage does not overwrite — save and use the key**: storage auto-renames on conflict (resume.pdf → resume (1).pdf). Always save `uploadData.key` to the DB alongside `uploadData.url`. Before re-uploading, read the stored key and call `remove(storedKey)` — never construct the path yourself, the actual key may differ
- **Storage URLs are not publicly accessible**: always use `getResumeSignedUrl()` to open a resume in a new tab — never use the raw `uploadData.url` directly
- **PDF hex colors are intentional**: react-pdf cannot use CSS variables — ui-tokens.md hex values are hardcoded in the PDF StyleSheet; this is the explicit exception to the no-hex rule
- **Generate button returns URL**: `POST /api/resume/generate` returns `{ success, url }` — `ResumeSection` handles the response; "View current resume" always fetches a signed URL via `getResumeSignedUrl()` before opening in a tab

---

## Notes

_Add notes here as the build progresses — workarounds, patterns, anything that differs from the context files._
