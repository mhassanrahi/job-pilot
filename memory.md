# Memory — Feature 04 Database Schema Complete

Last updated: 2026-11-10 08:49 +01:00

## What was built

- Added `migrations/20261110071940_create-job-pilot-schema.sql` defining the
  `profiles`, `agent_runs`, `jobs`, and `agent_logs` tables with constraints,
  indexes, ownership-safe foreign keys, least-privilege grants, and RLS.
- Added private resume-storage policies enforcing owner access to the exact
  `{user_id}/resume.pdf` path.
- Added profile completion fields and durable `resume_pdf_key` storage metadata.
- Created the private `resumes` bucket and merged the migration into the parent
  Job Pilot InsForge backend.
- Updated `context/architecture.md`, `context/build-plan.md`,
  `context/library-docs.md`, `context/progress-tracker.md`, and
  `context/ui-registry.md` for Feature 04.

## Decisions made

- `profiles.id` is both the primary key and the reference to `auth.users(id)`;
  other tables carry an explicit `user_id`.
- Resume tailoring remains out of scope, so no tailored-job columns were added.
- Resume storage persists both the returned URL and durable object key; the
  bucket stays private and access is path-scoped.
- Authenticated users receive select/insert and narrowly scoped updates, but no
  direct deletes. Agent logs are append-only for authenticated clients.
- Composite foreign keys prevent records from linking to another user's run or
  job. User deletion cascades owned data, run deletion cascades run output, and
  job deletion preserves logs while clearing their optional job link.

## Problems solved

- Distinguished the Git branch from an InsForge backend branch, created an
  isolated schema-only backend branch for the migration, and avoided applying
  untested RLS directly to the parent.
- Added restrictive storage policies alongside InsForge owner policies so a
  user cannot upload a resume under another user's path or another filename.
- Corrected the CLI context after verification found it still linked to the
  backend branch; it is now linked to the parent project.

## Current state

- Feature 04 is complete and marked complete in `context/progress-tracker.md`.
- The parent backend contains the migration and the private `resumes` bucket.
- Parent migration history, bucket privacy, schema, constraints, indexes, RLS,
  and privilege boundaries were structurally verified.
- ESLint and the Next.js 16.4.3 production build pass.
- The Feature 04 files are present in the working tree but have not been
  committed during this session.

## Next session starts with

Feature 05 — Profile Page Full UI — using `/architect` before implementation.

## Open questions

- Confirm live PostHog ingestion when the first approved product event ships.
- Production PostHog/OAuth configuration still waits for a deployment URL.
- Recheck dependency advisories when compatible InsForge and PostHog releases
  are available.
- `/privacy` and `/terms` still point to unimplemented routes.
