# Find Jobs Page — Full UI (Feature 09)

Date: 2026-06-23  
Status: Approved  
Scope: UI only — mock data, no API calls, no agent logic

---

## Goal

Build the complete Find Jobs page UI exactly matching `context/designs/find-jobs.png`. All data is hardcoded mock data. No Adzuna calls, no DB reads, no filter/sort logic. The page must be visually complete and production-ready so Features 10 and 11 can wire real data into the existing components without restructuring.

---

## File Structure

```
app/find-jobs/
  page.tsx                     → Server Component — renders FindJobsClient

components/find-jobs/
  FindJobsClient.tsx           → "use client" — owns all shared state, composes sections
  SearchControls.tsx           → Search card: inputs + Find Jobs button + success banner
  JobFilters.tsx               → Filter bar: text search + All Matches dropdown + sort dropdown
  JobsTable.tsx                → Jobs table + "Jobs by Adzuna" credit
  JobsPagination.tsx           → Result count text + pagination buttons
```

---

## Component Architecture

### `app/find-jobs/page.tsx`

Server Component. No data fetching at this stage — just renders `FindJobsClient`. Protected by existing middleware.

```tsx
import { FindJobsClient } from "@/components/find-jobs/FindJobsClient";

export default function FindJobsPage() {
  return <FindJobsClient />;
}
```

---

### `FindJobsClient.tsx`

`"use client"`. Owns all state for the page. Passes props to each child component.

**State:**

| Name | Type | Default | Purpose |
|---|---|---|---|
| `jobTitle` | `string` | `""` | Controlled search input |
| `location` | `string` | `""` | Controlled search input |
| `showSuccess` | `boolean` | `true` | Shows green success banner (true for mock) |
| `filterText` | `string` | `""` | Text filter input value |
| `matchFilter` | `"all" \| "high" \| "low"` | `"all"` | All Matches dropdown |
| `sortBy` | `"match_score" \| "newest" \| "oldest"` | `"match_score"` | Sort dropdown |
| `currentPage` | `number` | `1` | Active pagination page |

**Shared type** exported from this file so `JobsTable` can import it:
```ts
export type Job = {
  id: string;
  company: string;
  role: string;
  matchScore: number;
  salary: string;
  dateFound: string;
};
```

**Mock data** defined as a `const MOCK_JOBS: Job[]` array at the top of this file (see Mock Data section).

**Layout:**

```
<div className="max-w-[1440px] mx-auto px-8 py-8 flex flex-col gap-6">
  <SearchControls ... />
  <div className="bg-surface rounded-2xl border border-border shadow-sm">
    <JobFilters ... />
    <JobsTable ... />
    <JobsPagination ... />
  </div>
</div>
```

The filter bar, table, and pagination share one card wrapper — they visually belong together as one block.

---

### `SearchControls.tsx`

Props:
```ts
type Props = {
  jobTitle: string;
  location: string;
  showSuccess: boolean;
  onJobTitleChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onSearch: () => void;
};
```

**Card:** `bg-surface rounded-2xl border border-border shadow-[0px_1px_3px_rgba(0,0,0,0.1),_0px_1px_2px_-1px_rgba(0,0,0,0.1)] p-6 flex flex-col gap-4`

**Input row:** `flex items-end gap-4`

**JOB TITLE field:**
- Label: `text-[11px] font-medium text-text-secondary uppercase tracking-wide mb-1.5`
- Input wrapper: relative, `<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />`
- Input: `w-full bg-surface border border-border rounded-md pl-9 pr-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent`
- Placeholder: `Frontend Engineer`

**LOCATION field:** Same structure, no icon, placeholder `Remote, New York...`

**Find Jobs button:** `bg-accent text-accent-foreground text-sm font-medium px-4 py-2 rounded-md hover:bg-accent-dark transition-colors flex items-center gap-2 shrink-0`
- Icon: `<Search className="w-4 h-4" />`
- Clicking calls `onSearch()` which sets `showSuccess = true` in parent

**Success banner** (shown when `showSuccess === true`):
```
bg-success-lightest rounded-lg px-4 py-3 flex items-center gap-2
text-sm font-medium text-success-foreground
```
- Icon: `<Sparkles className="w-4 h-4 text-success" />`
- Text: `Found 8 jobs and saved 4 strong matches.`

---

### `JobFilters.tsx`

Props:
```ts
type Props = {
  filterText: string;
  matchFilter: "all" | "high" | "low";
  sortBy: "match_score" | "newest" | "oldest";
  onFilterTextChange: (value: string) => void;
  onMatchFilterChange: (value: "all" | "high" | "low") => void;
  onSortByChange: (value: "match_score" | "newest" | "oldest") => void;
};
```

**Wrapper:** `px-6 py-4 flex items-center gap-3 border-b border-border`

**Text filter:**
- Wrapper: `relative flex-1`
- Icon: `<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />`
- Input: `w-full bg-surface border border-border rounded-md pl-9 pr-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent`
- Placeholder: `Filter by company or role...`

**All Matches dropdown:**
```
relative
<select> bg-surface border border-border rounded-md pl-3 pr-8 py-2 text-sm text-text-primary appearance-none focus:outline-none focus:ring-1 focus:ring-accent
<ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
```
Options: `all` → "All Matches", `high` → "High Match", `low` → "Low Match"

**Match Score sort dropdown:** Same structure.  
Options: `match_score` → "Match Score", `newest` → "Newest", `oldest` → "Oldest"

---

### `JobsTable.tsx`

The `Job` type is defined and exported from `FindJobsClient.tsx` — import it there, do not redefine it.

Props:
```ts
import type { Job } from "@/components/find-jobs/FindJobsClient";

type Props = {
  jobs: Job[];
};
```

**Table wrapper:** `w-full`

**Column headers row:** `px-6 py-3 border-b border-border`
- `<div className="grid grid-cols-[2fr_2fr_1.5fr_1fr_1fr] gap-4 px-6">`
- Each header: `text-xs font-medium text-text-secondary uppercase tracking-wide`
- Columns: COMPANY, ROLE, MATCH SCORE, SALARY EST., DATE FOUND

**Job row:**
- `<div className="grid grid-cols-[2fr_2fr_1.5fr_1fr_1fr] gap-4 px-6 py-4 border-b border-border hover:bg-surface-secondary transition-colors cursor-pointer items-center">`
- Clicking navigates to `/find-jobs/${job.id}` via `useRouter().push()`

**COMPANY cell:**
```
flex items-center gap-3
<div className="w-8 h-8 rounded-lg bg-surface-tertiary border border-border flex items-center justify-center shrink-0">
  <Building2 className="w-4 h-4 text-text-muted" />
</div>
<span className="text-sm font-medium text-text-primary">{job.company}</span>
```

**ROLE cell:** `<span className="text-sm text-text-primary">{job.role}</span>`

**MATCH SCORE cell:**
```
flex items-center gap-2
<div className="flex-1 h-1 rounded-full bg-border-light">
  <div className={`h-1 rounded-full ${scoreColor}`} style={{ width: `${job.matchScore}%` }} />
</div>
<span className="text-sm font-medium text-text-primary w-9 text-right">{job.matchScore}%</span>
```

Score color logic:
```ts
function getScoreColor(score: number): string {
  if (score >= 80) return "bg-success";
  if (score >= 60) return "bg-info";
  return "bg-warning";
}
```

**SALARY EST. cell:** `<span className="text-sm text-text-primary">{job.salary}</span>`

**DATE FOUND cell:** `<span className="text-sm text-text-muted">{job.dateFound}</span>`

**Empty state** (when `jobs.length === 0`):
```
<div className="px-6 py-16 flex flex-col items-center gap-2">
  <p className="text-sm text-text-muted">No jobs found.</p>
  <p className="text-xs text-text-muted">Use the search above to find matching jobs.</p>
</div>
```

**Adzuna credit** (always shown below rows):
```
<div className="px-6 py-3 text-xs text-text-muted">
  Jobs by <span className="font-medium">Adzuna</span>
</div>
```

---

### `JobsPagination.tsx`

Props:
```ts
type Props = {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  pageSize: number;
  onPageChange: (page: number) => void;
};
```

**Wrapper:** `px-6 py-4 flex items-center justify-between border-t border-border`

**Left — result count:**
```
<span className="text-sm text-text-muted">
  Showing <span className="font-medium text-text-primary">1</span> to{" "}
  <span className="font-medium text-text-primary">6</span> of{" "}
  <span className="font-medium text-text-primary">24</span> results
</span>
```
Calculated from `currentPage`, `pageSize`, `totalResults`.

**Right — page buttons:**
- Previous: `border border-border rounded-md px-3 py-1.5 text-sm text-text-secondary hover:bg-surface-secondary disabled:opacity-40`
- Page numbers: active page gets `bg-accent text-accent-foreground`, others get `text-text-secondary hover:bg-surface-secondary`
- Ellipsis `...` shown for large page counts
- Next: same style as Previous
- Mock values: `currentPage=1`, `totalPages=8`, `totalResults=24`, `pageSize=6`

---

## Mock Data

Defined as `const MOCK_JOBS` in `FindJobsClient.tsx`:

```ts
const MOCK_JOBS = [
  { id: "1", company: "Vercel",  role: "Senior Frontend Engineer",  matchScore: 94, salary: "$160k–$200k", dateFound: "2 hours ago" },
  { id: "2", company: "Stripe",  role: "Staff UI Engineer",          matchScore: 88, salary: "$180k–$240k", dateFound: "Yesterday"   },
  { id: "3", company: "Linear",  role: "Product Engineer",           matchScore: 96, salary: "$150k–$190k", dateFound: "Yesterday"   },
  { id: "4", company: "Notion",  role: "Frontend Developer",         matchScore: 72, salary: "$130k–$170k", dateFound: "2 days ago"  },
  { id: "5", company: "OpenAI",  role: "Design Engineer",            matchScore: 91, salary: "$200k–$280k", dateFound: "3 days ago"  },
  { id: "6", company: "Figma",   role: "Software Engineer, Editor",  matchScore: 85, salary: "$170k–$220k", dateFound: "4 days ago"  },
];
```

---

## Tokens & Classes — Quick Reference

| Element | Classes |
|---|---|
| Page wrapper | `max-w-[1440px] mx-auto px-8 py-8 flex flex-col gap-6` |
| Search card | `bg-surface rounded-2xl border border-border shadow-[0px_1px_3px_rgba(0,0,0,0.1),_0px_1px_2px_-1px_rgba(0,0,0,0.1)] p-6` |
| Jobs card | `bg-surface rounded-2xl border border-border shadow-[0px_1px_3px_rgba(0,0,0,0.1),_0px_1px_2px_-1px_rgba(0,0,0,0.1)]` |
| Success banner | `bg-success-lightest rounded-lg px-4 py-3` |
| Table header | `text-xs font-medium text-text-secondary uppercase tracking-wide` |
| Row hover | `hover:bg-surface-secondary transition-colors` |
| Score ≥ 80 | `bg-success` |
| Score 60–79 | `bg-info` |
| Score < 60 | `bg-warning` |
| Active page btn | `bg-accent text-accent-foreground` |

---

## Constraints

- No API calls in this feature — all data is `MOCK_JOBS`
- Filter/sort dropdowns and text input are wired to state but do NOT filter `MOCK_JOBS` — that is Feature 11
- Pagination buttons update `currentPage` state but do NOT slice `MOCK_JOBS` — that is Feature 11
- Clicking a job row navigates to `/find-jobs/[id]` — the details page is Feature 12
- SOURCE column is omitted — design does not include it
- No `"use client"` on `app/find-jobs/page.tsx` — it is a Server Component
