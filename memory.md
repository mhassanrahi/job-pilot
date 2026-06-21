# Memory — Feature 04 Database Schema

Last updated: 2026-06-21

## What was built

Feature 04 Database Schema is fully complete. All infrastructure created via InsForge MCP tools — no TypeScript files were created or modified this session.

**Tables created (in dependency order):**
- `profiles` — PK references `auth.users(id) ON DELETE CASCADE`, 23 columns matching architecture.md exactly
- `agent_runs` — FK to `profiles(id)`, `status` CHECK constraint (`running/completed/failed`), `jobs_found` defaults to 0
- `jobs` — FK to `profiles(id)`, nullable FK to `agent_runs(id) ON DELETE SET NULL`, `source` CHECK constraint (`search/url`), `company_research jsonb`
- `agent_logs` — FK to `agent_runs(id)`, FK to `profiles(id)`, nullable `job_id` FK to `jobs(id) ON DELETE SET NULL`, `level` CHECK constraint (`info/success/warning/error`)

**Triggers created:**
- `handle_new_user` (SECURITY DEFINER) on `auth.users AFTER INSERT` — auto-inserts blank row into `profiles` with `id` and `email` from the new auth user
- `handle_updated_at` on `profiles BEFORE UPDATE` — auto-sets `updated_at = now()`

**RLS enabled and policies created on all 4 tables:**
- `profiles`: `id = auth.uid()` for SELECT / INSERT / UPDATE
- `agent_runs`, `jobs`, `agent_logs`: `user_id = auth.uid()` for SELECT / INSERT / UPDATE

**Storage bucket created:**
- `resumes` — private (`isPublic: false`)
- Storage RLS on `storage.objects` for INSERT / SELECT / UPDATE scoped to own path

**progress-tracker.md updated:**
- Phase 1 Foundation now fully complete (`01–04` all checked)
- Current phase set to Phase 2 — Profile Page
- Next set to 05 Profile Page — Full UI
- Decisions recorded in the tracker

## Decisions made

- **Profile auto-creation via trigger** — `handle_new_user` fires on `auth.users INSERT` and creates a blank `profiles` row. This guarantees a profile row exists before any agent or profile save logic runs, eliminating "no profile row yet" edge cases throughout Features 05–17.
- **`updated_at` via trigger** — `handle_updated_at` BEFORE UPDATE trigger means app code never needs to pass this field. Any future mutation path (profile extraction, resume generation) gets it for free.
- **InsForge storage.objects column names differ from Supabase** — uses `bucket` and `key` columns (not `bucket_id`/`name`). Storage RLS uses `split_part(key, '/', 1) = auth.uid()::text` to scope to own `{user_id}/` path.

## Problems solved

- **InsForge `storage.objects` schema is not Supabase-compatible** — the first storage RLS attempt used `bucket_id` and `name` (Supabase convention) and failed. Queried `information_schema.columns` to find actual column names: `bucket` and `key`. Fixed by switching to `split_part(key, '/', 1)` for path-based scoping.

## Current state

Phase 1 Foundation is 100% complete. The database is fully provisioned:
- All 4 tables exist with correct columns, FK constraints, CHECK constraints, and defaults
- Both triggers are live — new OAuth signups will auto-get a profiles row
- RLS is active on all 4 tables and the resumes storage bucket
- No app code touches the DB yet — that starts in Feature 06 (Profile Save Logic)

## Next session starts with

Run `/architect the feature 05` — Feature 05 is Profile Page Full UI. Build the complete profile page with mock data: profile needs attention banner, resume upload area, profile form (Personal Info, Professional Info, Work Experience, Education, Job Preferences), and Save Profile button. No save logic yet — that is Feature 06.

Before starting: run `/remember restore`, read all context files per AGENTS.md order.

## Open questions

- OAuth redirect URLs still need to be registered in the InsForge dashboard (`https://<domain>/callback`) before end-to-end auth testing is possible (carried over from Feature 02).
- `--color-accent-dark` CSS variable — used in LoginCard gradient but not verified against the `@theme` token list in `context/ui-tokens.md`. Confirm it exists before the next UI session.
- Returning visitors are tracked anonymously until they sign in again — `identify` only runs in the OAuth callback. Consider adding a session-restore identify call if a logged-in user lands on any authenticated page (carried over from Feature 03).
