# Find Jobs Page — Full UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete Find Jobs page UI with mock data, exactly matching `context/designs/find-jobs.png` — no API calls, no agent logic.

**Architecture:** A Server Component page renders a single `FindJobsClient` client component that owns all state. Four focused child components (`SearchControls`, `JobFilters`, `JobsTable`, `JobsPagination`) receive typed props and callbacks. All data is a hardcoded `MOCK_JOBS` array. Filter/sort/pagination state is wired but does not mutate the displayed data — that is Feature 11.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict, Tailwind CSS v4 tokens, lucide-react icons.

**Spec:** `docs/superpowers/specs/2026-06-23-find-jobs-ui-design.md`

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| Create | `app/find-jobs/page.tsx` | Server Component page route |
| Create | `components/find-jobs/FindJobsClient.tsx` | Client shell — state, Job type, MOCK_JOBS, layout |
| Create | `components/find-jobs/SearchControls.tsx` | Search inputs + Find Jobs button + success banner |
| Create | `components/find-jobs/JobFilters.tsx` | Text filter + All Matches dropdown + sort dropdown |
| Create | `components/find-jobs/JobsTable.tsx` | Jobs table rows + empty state + Adzuna credit |
| Create | `components/find-jobs/JobsPagination.tsx` | Result count + page number buttons |
| Modify | `context/progress-tracker.md` | Mark Feature 09 complete |
| Modify | `context/ui-registry.md` | Add Find Jobs component patterns |

---

## Task 1: Page Route + FindJobsClient Scaffold

**Files:**
- Create: `app/find-jobs/page.tsx`
- Create: `components/find-jobs/FindJobsClient.tsx`

- [ ] **Step 1: Create the page route**

Create `app/find-jobs/page.tsx`:

```tsx
import { FindJobsClient } from "@/components/find-jobs/FindJobsClient";

export default function FindJobsPage() {
  return <FindJobsClient />;
}
```

- [ ] **Step 2: Create FindJobsClient with type, mock data, state, and layout shell**

Create `components/find-jobs/FindJobsClient.tsx`:

```tsx
"use client";

import { useState } from "react";
import { SearchControls } from "@/components/find-jobs/SearchControls";
import { JobFilters } from "@/components/find-jobs/JobFilters";
import { JobsTable } from "@/components/find-jobs/JobsTable";
import { JobsPagination } from "@/components/find-jobs/JobsPagination";

export type Job = {
  id: string;
  company: string;
  role: string;
  matchScore: number;
  salary: string;
  dateFound: string;
};

const MOCK_JOBS: Job[] = [
  { id: "1", company: "Vercel",  role: "Senior Frontend Engineer",  matchScore: 94, salary: "$160k–$200k", dateFound: "2 hours ago" },
  { id: "2", company: "Stripe",  role: "Staff UI Engineer",          matchScore: 88, salary: "$180k–$240k", dateFound: "Yesterday"   },
  { id: "3", company: "Linear",  role: "Product Engineer",           matchScore: 96, salary: "$150k–$190k", dateFound: "Yesterday"   },
  { id: "4", company: "Notion",  role: "Frontend Developer",         matchScore: 72, salary: "$130k–$170k", dateFound: "2 days ago"  },
  { id: "5", company: "OpenAI",  role: "Design Engineer",            matchScore: 91, salary: "$200k–$280k", dateFound: "3 days ago"  },
  { id: "6", company: "Figma",   role: "Software Engineer, Editor",  matchScore: 85, salary: "$170k–$220k", dateFound: "4 days ago"  },
];

export function FindJobsClient() {
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [showSuccess, setShowSuccess] = useState(true);
  const [filterText, setFilterText] = useState("");
  const [matchFilter, setMatchFilter] = useState<"all" | "high" | "low">("all");
  const [sortBy, setSortBy] = useState<"match_score" | "newest" | "oldest">("match_score");
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="max-w-[1440px] mx-auto px-8 py-8 flex flex-col gap-6">
      <SearchControls
        jobTitle={jobTitle}
        location={location}
        showSuccess={showSuccess}
        onJobTitleChange={setJobTitle}
        onLocationChange={setLocation}
        onSearch={() => setShowSuccess(true)}
      />
      <div className="bg-surface rounded-2xl border border-border shadow-[0px_1px_3px_rgba(0,0,0,0.1),_0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
        <JobFilters
          filterText={filterText}
          matchFilter={matchFilter}
          sortBy={sortBy}
          onFilterTextChange={setFilterText}
          onMatchFilterChange={setMatchFilter}
          onSortByChange={setSortBy}
        />
        <JobsTable jobs={MOCK_JOBS} />
        <JobsPagination
          currentPage={currentPage}
          totalPages={8}
          totalResults={24}
          pageSize={6}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Check TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: Errors only about missing child component files (SearchControls, JobFilters, JobsTable, JobsPagination) — those are fine, they'll be created in subsequent tasks. No type errors in FindJobsClient itself.

- [ ] **Step 4: Commit**

```bash
git add app/find-jobs/page.tsx components/find-jobs/FindJobsClient.tsx
git commit -m "feat: add Find Jobs page route and FindJobsClient scaffold"
```

---

## Task 2: SearchControls Component

**Files:**
- Create: `components/find-jobs/SearchControls.tsx`

- [ ] **Step 1: Create SearchControls**

Create `components/find-jobs/SearchControls.tsx`:

```tsx
import { Search, Sparkles } from "lucide-react";

type Props = {
  jobTitle: string;
  location: string;
  showSuccess: boolean;
  onJobTitleChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onSearch: () => void;
};

export function SearchControls({
  jobTitle,
  location,
  showSuccess,
  onJobTitleChange,
  onLocationChange,
  onSearch,
}: Props) {
  return (
    <div className="bg-surface rounded-2xl border border-border shadow-[0px_1px_3px_rgba(0,0,0,0.1),_0px_1px_2px_-1px_rgba(0,0,0,0.1)] p-6 flex flex-col gap-4">
      <div className="flex items-end gap-4">
        <div className="flex-1">
          <label className="block text-[11px] font-medium text-text-secondary uppercase tracking-wide mb-1.5">
            Job Title
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => onJobTitleChange(e.target.value)}
              placeholder="Frontend Engineer"
              className="w-full bg-surface border border-border rounded-md pl-9 pr-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
            />
          </div>
        </div>
        <div className="flex-1">
          <label className="block text-[11px] font-medium text-text-secondary uppercase tracking-wide mb-1.5">
            Location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            placeholder="Remote, New York..."
            className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
          />
        </div>
        <button
          onClick={onSearch}
          className="bg-accent text-accent-foreground text-sm font-medium px-4 py-2 rounded-md hover:bg-accent-dark transition-colors flex items-center gap-2 shrink-0"
        >
          <Search className="w-4 h-4" />
          Find Jobs
        </button>
      </div>
      {showSuccess && (
        <div className="bg-success-lightest rounded-lg px-4 py-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-success shrink-0" />
          <span className="text-sm font-medium text-success-foreground">
            Found 8 jobs and saved 4 strong matches.
          </span>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Check TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: Remaining errors are only about the three components not yet created. No errors in SearchControls.

- [ ] **Step 3: Commit**

```bash
git add components/find-jobs/SearchControls.tsx
git commit -m "feat: add SearchControls component for Find Jobs page"
```

---

## Task 3: JobFilters Component

**Files:**
- Create: `components/find-jobs/JobFilters.tsx`

- [ ] **Step 1: Create JobFilters**

Create `components/find-jobs/JobFilters.tsx`:

```tsx
import { Search, ChevronDown } from "lucide-react";

type Props = {
  filterText: string;
  matchFilter: "all" | "high" | "low";
  sortBy: "match_score" | "newest" | "oldest";
  onFilterTextChange: (value: string) => void;
  onMatchFilterChange: (value: "all" | "high" | "low") => void;
  onSortByChange: (value: "match_score" | "newest" | "oldest") => void;
};

export function JobFilters({
  filterText,
  matchFilter,
  sortBy,
  onFilterTextChange,
  onMatchFilterChange,
  onSortByChange,
}: Props) {
  return (
    <div className="px-6 py-4 flex items-center gap-3 border-b border-border">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
        <input
          type="text"
          value={filterText}
          onChange={(e) => onFilterTextChange(e.target.value)}
          placeholder="Filter by company or role..."
          className="w-full bg-surface border border-border rounded-md pl-9 pr-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
        />
      </div>
      <div className="relative">
        <select
          value={matchFilter}
          onChange={(e) => onMatchFilterChange(e.target.value as "all" | "high" | "low")}
          className="appearance-none bg-surface border border-border rounded-md pl-3 pr-8 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent cursor-pointer"
        >
          <option value="all">All Matches</option>
          <option value="high">High Match</option>
          <option value="low">Low Match</option>
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
      </div>
      <div className="relative">
        <select
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value as "match_score" | "newest" | "oldest")}
          className="appearance-none bg-surface border border-border rounded-md pl-3 pr-8 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent cursor-pointer"
        >
          <option value="match_score">Match Score</option>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Check TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: Remaining errors only for JobsTable and JobsPagination. No errors in JobFilters.

- [ ] **Step 3: Commit**

```bash
git add components/find-jobs/JobFilters.tsx
git commit -m "feat: add JobFilters component for Find Jobs page"
```

---

## Task 4: JobsTable Component

**Files:**
- Create: `components/find-jobs/JobsTable.tsx`

- [ ] **Step 1: Create JobsTable**

Create `components/find-jobs/JobsTable.tsx`:

```tsx
"use client";

import { Building2 } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Job } from "@/components/find-jobs/FindJobsClient";

type Props = {
  jobs: Job[];
};

function getScoreColor(score: number): string {
  if (score >= 80) return "bg-success";
  if (score >= 60) return "bg-info";
  return "bg-warning";
}

export function JobsTable({ jobs }: Props) {
  const router = useRouter();

  return (
    <div className="w-full">
      <div className="grid grid-cols-[2fr_2fr_1.5fr_1fr_1fr] gap-4 px-6 py-3 border-b border-border">
        <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">Company</span>
        <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">Role</span>
        <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">Match Score</span>
        <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">Salary Est.</span>
        <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">Date Found</span>
      </div>
      {jobs.length === 0 ? (
        <div className="px-6 py-16 flex flex-col items-center gap-2">
          <p className="text-sm text-text-muted">No jobs found.</p>
          <p className="text-xs text-text-muted">Use the search above to find matching jobs.</p>
        </div>
      ) : (
        jobs.map((job) => (
          <div
            key={job.id}
            onClick={() => router.push(`/find-jobs/${job.id}`)}
            className="grid grid-cols-[2fr_2fr_1.5fr_1fr_1fr] gap-4 px-6 py-4 border-b border-border hover:bg-surface-secondary transition-colors cursor-pointer items-center"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-surface-tertiary border border-border flex items-center justify-center shrink-0">
                <Building2 className="w-4 h-4 text-text-muted" />
              </div>
              <span className="text-sm font-medium text-text-primary">{job.company}</span>
            </div>
            <span className="text-sm text-text-primary">{job.role}</span>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1 rounded-full bg-border-light overflow-hidden">
                <div
                  className={`h-1 rounded-full ${getScoreColor(job.matchScore)}`}
                  style={{ width: `${job.matchScore}%` }}
                />
              </div>
              <span className="text-sm font-medium text-text-primary w-9 text-right">
                {job.matchScore}%
              </span>
            </div>
            <span className="text-sm text-text-primary">{job.salary}</span>
            <span className="text-sm text-text-muted">{job.dateFound}</span>
          </div>
        ))
      )}
      <div className="px-6 py-3 text-xs text-text-muted">
        Jobs by <span className="font-medium">Adzuna</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Check TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: Only the missing JobsPagination error remains. No errors in JobsTable.

- [ ] **Step 3: Commit**

```bash
git add components/find-jobs/JobsTable.tsx
git commit -m "feat: add JobsTable component with match score bar and row navigation"
```

---

## Task 5: JobsPagination Component

**Files:**
- Create: `components/find-jobs/JobsPagination.tsx`

- [ ] **Step 1: Create JobsPagination**

Create `components/find-jobs/JobsPagination.tsx`:

```tsx
type Props = {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  pageSize: number;
  onPageChange: (page: number) => void;
};

function getPageNumbers(currentPage: number, totalPages: number): (number | "...")[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages];
  }
  if (currentPage >= totalPages - 2) {
    return [1, "...", totalPages - 2, totalPages - 1, totalPages];
  }
  return [1, "...", currentPage, "...", totalPages];
}

export function JobsPagination({
  currentPage,
  totalPages,
  totalResults,
  pageSize,
  onPageChange,
}: Props) {
  const startResult = (currentPage - 1) * pageSize + 1;
  const endResult = Math.min(currentPage * pageSize, totalResults);
  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <div className="px-6 py-4 flex items-center justify-between border-t border-border">
      <span className="text-sm text-text-muted">
        Showing{" "}
        <span className="font-medium text-text-primary">{startResult}</span> to{" "}
        <span className="font-medium text-text-primary">{endResult}</span> of{" "}
        <span className="font-medium text-text-primary">{totalResults}</span> results
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1.5 text-sm text-text-secondary border border-border rounded-md hover:bg-surface-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        {pages.map((page, i) => {
          if (page === "...") {
            return (
              <span key={`ellipsis-${i}`} className="px-2 py-1.5 text-sm text-text-muted select-none">
                ...
              </span>
            );
          }
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 text-sm rounded-md transition-colors ${
                page === currentPage
                  ? "bg-accent text-accent-foreground"
                  : "text-text-secondary hover:bg-surface-secondary"
              }`}
            >
              {page}
            </button>
          );
        })}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 text-sm text-text-secondary border border-border rounded-md hover:bg-surface-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Check TypeScript compiles with zero errors**

Run: `npx tsc --noEmit`

Expected: Exit 0. Zero errors across all files.

- [ ] **Step 3: Commit**

```bash
git add components/find-jobs/JobsPagination.tsx
git commit -m "feat: add JobsPagination component"
```

---

## Task 6: Visual Verification + Docs Update

**Files:**
- Modify: `context/progress-tracker.md`
- Modify: `context/ui-registry.md`

- [ ] **Step 1: Run the dev server and open the Find Jobs page**

```bash
npm run dev
```

Open `http://localhost:3000/find-jobs` in a browser.

Verify against `context/designs/find-jobs.png`:
- [ ] Search card at top — JOB TITLE and LOCATION inputs side by side, Find Jobs button right-aligned
- [ ] Green success banner visible below inputs with sparkle icon
- [ ] Jobs card below — filter bar with text input and two dropdowns
- [ ] Table with 5 column headers: COMPANY, ROLE, MATCH SCORE, SALARY EST., DATE FOUND
- [ ] All 6 mock jobs render with company placeholder icon, match score bar (colored by score), salary, date
- [ ] Score bars: 94%/96%/91% green, 88%/85% green (≥80), 72% blue (60-79)
- [ ] Row hover shows light grey background
- [ ] "Jobs by Adzuna" credit below table rows
- [ ] Pagination shows "Showing 1 to 6 of 24 results" and page buttons 1, 2, 3, ..., 8
- [ ] Page 1 button has accent purple background
- [ ] Clicking Previous is disabled (greyed out) on page 1
- [ ] Clicking a job row navigates to `/find-jobs/1` (404 is fine — details page is Feature 12)

- [ ] **Step 2: Update progress-tracker.md**

In `context/progress-tracker.md`, change:

```markdown
- [ ] 09 Find Jobs Page — Full UI
```

to:

```markdown
- [x] 09 Find Jobs Page — Full UI
```

And update the Current Status section:

```markdown
## Current Status

**Phase:** Phase 3 — Find Jobs Page
**Last completed:** 09 Find Jobs Page — Full UI
**Next:** 10 Adzuna Job Discovery
```

- [ ] **Step 3: Update ui-registry.md**

Append the following to `context/ui-registry.md` after the last component entry:

```markdown
---

### Find Jobs

#### SearchControls
**File:** `components/find-jobs/SearchControls.tsx`
Last updated: 2026-06-23

| Property | Class / Value |
| --- | --- |
| Card | `bg-surface rounded-2xl border border-border shadow-[0px_1px_3px_rgba(0,0,0,0.1),_0px_1px_2px_-1px_rgba(0,0,0,0.1)] p-6 flex flex-col gap-4` |
| Input row | `flex items-end gap-4` |
| Field label | `block text-[11px] font-medium text-text-secondary uppercase tracking-wide mb-1.5` |
| Input with icon | `w-full bg-surface border border-border rounded-md pl-9 pr-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent` |
| Input no icon | `w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent` |
| Find Jobs button | `bg-accent text-accent-foreground text-sm font-medium px-4 py-2 rounded-md hover:bg-accent-dark transition-colors flex items-center gap-2 shrink-0` |
| Success banner | `bg-success-lightest rounded-lg px-4 py-3 flex items-center gap-2` |
| Success text | `text-sm font-medium text-success-foreground` |

**Pattern notes:**
Search icon in JOB TITLE input uses `pointer-events-none` so it doesn't block clicks. LOCATION field has no icon — `px-3` instead of `pl-9`. Success banner shown via `showSuccess` boolean prop; parent sets it to `true` when Find Jobs is clicked.

---

#### JobFilters
**File:** `components/find-jobs/JobFilters.tsx`
Last updated: 2026-06-23

| Property | Class / Value |
| --- | --- |
| Wrapper | `px-6 py-4 flex items-center gap-3 border-b border-border` |
| Text filter input | `w-full bg-surface border border-border rounded-md pl-9 pr-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent` |
| Dropdown select | `appearance-none bg-surface border border-border rounded-md pl-3 pr-8 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent cursor-pointer` |
| Dropdown chevron | `absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none` |

**Pattern notes:**
`appearance-none` removes native browser dropdown arrow. ChevronDown icon positioned absolutely inside a `relative` wrapper. `pointer-events-none` on icon ensures it doesn't block clicks on the select. Two dropdowns share identical classes.

---

#### JobsTable
**File:** `components/find-jobs/JobsTable.tsx`
Last updated: 2026-06-23

| Property | Class / Value |
| --- | --- |
| Column header row | `grid grid-cols-[2fr_2fr_1.5fr_1fr_1fr] gap-4 px-6 py-3 border-b border-border` |
| Column header text | `text-xs font-medium text-text-secondary uppercase tracking-wide` |
| Job row | `grid grid-cols-[2fr_2fr_1.5fr_1fr_1fr] gap-4 px-6 py-4 border-b border-border hover:bg-surface-secondary transition-colors cursor-pointer items-center` |
| Company icon box | `w-8 h-8 rounded-lg bg-surface-tertiary border border-border flex items-center justify-center shrink-0` |
| Company name | `text-sm font-medium text-text-primary` |
| Role text | `text-sm text-text-primary` |
| Score bar track | `flex-1 h-1 rounded-full bg-border-light overflow-hidden` |
| Score bar fill | `h-1 rounded-full` + `bg-success` / `bg-info` / `bg-warning` by score range |
| Score % text | `text-sm font-medium text-text-primary w-9 text-right` |
| Salary text | `text-sm text-text-primary` |
| Date text | `text-sm text-text-muted` |
| Empty state | `px-6 py-16 flex flex-col items-center gap-2` |
| Adzuna credit | `px-6 py-3 text-xs text-text-muted` |

**Pattern notes:**
Score color: ≥80 → `bg-success`, 60–79 → `bg-info`, <60 → `bg-warning`. Bar fill uses inline `style={{ width: \`${score}%\` }}` — only property that requires inline style. `"use client"` required because `useRouter` is used for row click navigation. `overflow-hidden` on track prevents fill from overflowing at 100%.

---

#### JobsPagination
**File:** `components/find-jobs/JobsPagination.tsx`
Last updated: 2026-06-23

| Property | Class / Value |
| --- | --- |
| Wrapper | `px-6 py-4 flex items-center justify-between border-t border-border` |
| Result count text | `text-sm text-text-muted` |
| Count emphasis | `font-medium text-text-primary` |
| Prev/Next button | `px-3 py-1.5 text-sm text-text-secondary border border-border rounded-md hover:bg-surface-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors` |
| Active page button | `w-8 h-8 text-sm rounded-md bg-accent text-accent-foreground` |
| Inactive page button | `w-8 h-8 text-sm rounded-md text-text-secondary hover:bg-surface-secondary transition-colors` |
| Ellipsis | `px-2 py-1.5 text-sm text-text-muted select-none` |

**Pattern notes:**
`getPageNumbers()` is a pure function outside the component — takes currentPage and totalPages, returns `(number | "...")[]`. For totalPages ≤ 5 shows all pages. For larger: first 3 pages show [1,2,3,...,N]; last 3 show [1,...,N-2,N-1,N]; middle shows [1,...,current,...,N]. Ellipsis items use index-based keys to avoid React key conflicts.
```

- [ ] **Step 4: Commit all docs changes**

```bash
git add context/progress-tracker.md context/ui-registry.md
git commit -m "docs: mark Feature 09 complete, add Find Jobs components to ui-registry"
```
