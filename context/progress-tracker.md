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

- **Profile auto-creation**: `handle_new_user` trigger on `auth.users INSERT` creates a blank profiles row automatically — ensures a row always exists before any agent or profile code runs
- **`updated_at` trigger**: `handle_updated_at` BEFORE UPDATE trigger on profiles — app code never needs to pass this field explicitly
- **storage.objects RLS**: InsForge uses `bucket` and `key` columns (not Supabase's `bucket_id`/`name`) — policies use `split_part(key, '/', 1) = auth.uid()::text` to scope to own path

---

## Notes

_Add notes here as the build progresses — workarounds, patterns, anything that differs from the context files._
