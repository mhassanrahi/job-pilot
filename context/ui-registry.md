# UI Registry

Living document. Updated after every component is built. Read this before building any new component — match existing patterns exactly before inventing new ones.

---

## How to Use

Before building any component:

1. Check if a similar component already exists here
2. If yes — match its exact classes
3. If no — build it following ui-rules.md and ui-tokens.md, then add it here

After building any component — update this file with the component name, file path, and exact classes used.

---

## Components

### Layout

#### Navbar
**File:** `components/layout/Navbar.tsx`
**Wrapper:** `w-full bg-surface border-b border-border`
**Inner:** `max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between`
**Logo text:** `text-[19px] font-bold leading-7 text-text-darkest`
**Nav link:** `text-sm font-medium text-text-dark hover:text-accent transition-colors`
**CTA button:** `bg-accent text-accent-foreground text-sm font-medium px-4 py-2 rounded-md hover:bg-accent-dark`

#### Footer
**File:** `components/layout/Footer.tsx`
**Wrapper:** `bg-surface border-t border-border`
**Inner:** `max-w-[1440px] mx-auto px-8 py-10 flex items-center justify-between`
**Link:** `text-sm font-medium text-text-secondary hover:text-text-primary transition-colors`
**Copyright:** `text-sm text-text-muted`

### Homepage

#### Hero
**File:** `components/homepage/Hero.tsx`
**Section:** `bg-surface py-20 text-center`
**Headline:** `text-5xl font-bold text-text-primary leading-tight`
**Subheadline:** `text-lg text-text-secondary max-w-2xl mx-auto`
**Primary CTA:** `bg-accent text-accent-foreground text-sm font-medium px-5 py-2.5 rounded-md hover:bg-accent-dark`
**Secondary CTA:** `bg-surface border border-border text-text-primary text-sm font-medium px-5 py-2.5 rounded-md hover:bg-surface-secondary`
**Screenshot wrapper:** `rounded-xl overflow-hidden shadow-2xl mx-auto max-w-5xl border border-border`

#### Features
**File:** `components/homepage/Features.tsx`
**Outer wrapper:** `bg-background`
**Grid:** `grid grid-cols-2 gap-16 items-center`
**Section heading:** `text-3xl font-bold text-text-primary`
**Icon container:** `w-10 h-10 rounded-lg bg-accent-muted flex items-center justify-center text-accent`
**Feature title:** `text-sm font-semibold text-text-primary`
**Feature body:** `text-sm text-text-secondary leading-relaxed`
**Screenshot wrapper:** `rounded-xl overflow-hidden shadow-xl border border-border`

#### Testimonial
**File:** `components/homepage/Testimonial.tsx`
**Section:** `bg-surface py-20`
**Quote:** `text-xl font-medium text-text-primary leading-relaxed`
**Avatar:** `w-12 h-12 rounded-full overflow-hidden border-2 border-border`
**Name:** `text-sm font-semibold text-text-primary`
**Title:** `text-xs text-text-muted`

### Auth

#### LoginCard
**File:** `components/auth/LoginCard.tsx`
**Page wrapper:** `min-h-screen bg-background flex items-center justify-center p-4`
**Card:** `bg-surface border border-border rounded-2xl p-8 w-full max-w-sm shadow-[0px_1px_3px_rgba(0,0,0,0.1),_0px_1px_2px_-1px_rgba(0,0,0,0.1)]`
**Logo container:** `w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0` with inline gradient `linear-gradient(45deg, #7C5CFC 0%, #4A2EC5 100%)`
**Logo text:** `text-[19px] font-bold leading-7 text-text-darkest`
**Heading:** `text-base font-semibold text-text-primary text-center`
**Subheading:** `text-xs text-text-muted text-center`
**OAuth button:** `w-full flex items-center justify-center gap-3 bg-surface border border-border rounded-md px-4 py-2.5 text-sm font-medium text-text-primary hover:bg-surface-secondary transition-colors disabled:opacity-60 disabled:cursor-not-allowed`
**Spinner:** `w-4 h-4 border-2 border-border border-t-accent rounded-full animate-spin shrink-0`
**Back link:** `text-xs text-text-muted hover:text-text-secondary transition-colors`

---

### Profile

#### CompletionBanner
**File:** `components/profile/CompletionBanner.tsx`
Last updated: 2026-06-21

| Property           | Class / Value                                                        |
| ------------------ | -------------------------------------------------------------------- |
| Background         | `bg-surface`                                                         |
| Border             | `border border-border`                                               |
| Border radius      | `rounded-2xl`                                                        |
| Shadow             | `shadow-[0px_1px_3px_rgba(0,0,0,0.1),_0px_1px_2px_-1px_rgba(0,0,0,0.1)]` |
| Spacing            | `p-6` (card), `gap-3` (internal stack), `gap-6` (content ↔ ring)    |
| Text — primary     | `text-sm font-semibold text-text-primary` (heading)                  |
| Text — secondary   | `text-sm text-text-secondary leading-relaxed` (body)                 |
| Alert icon         | `text-error` (AlertCircle, when incomplete)                          |
| Complete icon      | `text-success` (CheckCircle2, when all fields filled)                |
| Missing field pill | `px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-warning/10 text-warning tracking-wide` |
| SVG ring track     | inline `stroke: var(--color-border)`, strokeWidth 8, r 36            |
| SVG ring progress  | incomplete: `stroke: var(--color-text-primary)`; complete: `stroke: var(--color-success)` |
| Ring % text        | `text-lg font-bold text-text-primary` (absolutely centered)          |
| Props              | `missingFields: string[]`, `completionPct: number` — computed server-side in page.tsx |

**Pattern notes:**
SVG circumference = 2π×36 ≈ 226.2. Dashoffset = 226.2 × (1 − pct/100). Always start from top with `rotate(-90 50 50)`. Percentage text sits in an absolute overlay div, not inside the SVG, to avoid SVG text scaling issues. Component is purely presentational — all data computed from DB profile in the Server Component.

---

#### ResumeSection
**File:** `components/profile/ResumeSection.tsx`
Last updated: 2026-06-21

| Property           | Class / Value                                                        |
| ------------------ | -------------------------------------------------------------------- |
| Background         | `bg-surface`                                                         |
| Border             | `border border-border`                                               |
| Border radius      | `rounded-2xl`                                                        |
| Shadow             | `shadow-[0px_1px_3px_rgba(0,0,0,0.1),_0px_1px_2px_-1px_rgba(0,0,0,0.1)]` |
| Card header        | `px-6 py-5 border-b border-border`                                   |
| Card body          | `p-6 flex flex-col gap-4`                                            |
| Text — heading     | `text-base font-semibold text-text-primary`                          |
| Text — subtitle    | `text-sm text-text-secondary`                                        |
| Text — hint        | `text-xs text-text-muted`                                            |
| Upload area        | `border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center gap-3 bg-surface-secondary` |
| Secondary button   | `bg-surface border border-border text-text-primary text-sm font-medium px-4 py-2 rounded-md hover:bg-surface-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed` |
| Primary button     | `bg-accent text-accent-foreground text-sm font-medium px-4 py-2 rounded-md hover:bg-accent-dark transition-colors` |
| Current resume link | `text-accent hover:text-accent-dark transition-colors underline underline-offset-2` |
| Props              | `resumeUrl: string \| null` — passed from Server Component           |

**Pattern notes:**
Upload happens immediately on file select (no Save needed). File input is hidden; "Select Resume" button triggers `fileInputRef.current?.click()`. After upload succeeds, POST `/api/resume/extract` is called automatically — no user action required. Phase state: `idle → uploading → extracting → complete | error`. Status text shown inline in the dashed area. `onExtracted` callback fires with `ExtractedFields` when extraction succeeds; extraction failure is silent (upload still completes). Props: `resumeUrl: string | null`, `onExtracted: (fields: ExtractedFields) => void`.

---

#### ProfileForm
**File:** `components/profile/ProfileForm.tsx`
Last updated: 2026-06-21

| Property           | Class / Value                                                        |
| ------------------ | -------------------------------------------------------------------- |
| Background         | `bg-surface`                                                         |
| Border             | `border border-border`                                               |
| Border radius      | `rounded-2xl`                                                        |
| Shadow             | `shadow-[0px_1px_3px_rgba(0,0,0,0.1),_0px_1px_2px_-1px_rgba(0,0,0,0.1)]` |
| Card header        | `px-6 py-5 border-b border-border`                                   |
| Card body spacing  | `p-6 flex flex-col gap-8` (between sections), `gap-4` (between fields) |
| Section heading    | `text-sm font-semibold text-text-dark mb-4`                          |
| Field label        | `text-[11px] font-medium text-text-secondary uppercase tracking-wide mb-1.5` |
| Input              | `w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent` |
| Select             | same as input + `appearance-none` + absolutely-positioned `<ChevronDown w-4 h-4 text-text-muted>` |
| Tag container      | `border border-border rounded-md p-3 bg-surface min-h-[52px] focus-within:ring-1 focus-within:ring-accent focus-within:border-accent` |
| Tag pill           | `bg-surface-secondary border border-border rounded-full px-2.5 py-1 text-xs font-medium text-text-dark` |
| Tag remove button  | `text-text-muted hover:text-text-secondary transition-colors` + `<X w-3 h-3>` |
| Add tag button     | `flex items-center gap-1 text-sm font-medium text-accent hover:text-accent-dark transition-colors` |
| Section divider    | `border-t border-border`                                             |
| Save button        | `w-full bg-accent text-accent-foreground text-sm font-medium py-3 rounded-md hover:bg-accent-dark transition-colors` |
| Disabled input     | `opacity-60 cursor-not-allowed` (email field — read-only)            |

**Pattern notes:**
Accepts `extractedFields: ExtractedFields | null` prop. A `useEffect` watches this prop and merges extracted values into `form` state when it changes — scalar fields overwrite existing values, array fields (skills, industries, workExperience) only replace if the extracted array is non-empty. Preferences (remotePreference, salaryExpectation, jobTitlesSeeking, preferredLocations) are never touched by extraction. Section headings use `text-text-dark` (not `text-text-primary`) — one shade lighter than card title. Card title uses `text-text-primary`. Field labels are `text-[11px]` uppercase tracking-wide — not `text-xs` — to match the design's finer label weight. Select elements need a wrapper div for the ChevronDown overlay; the select itself gets `appearance-none` to hide the native arrow. Tag container uses `focus-within` (not `focus`) so the ring appears when the embedded input is focused.

---

#### BottomCta
**File:** `components/homepage/BottomCta.tsx`
**Background:** `linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-dark) 100%)` via inline style
**Heading:** `text-4xl font-bold text-accent-foreground leading-tight`
**Subtext:** `color: rgba(255, 255, 255, 0.8)` via inline style
**Primary button:** `bg-accent-foreground text-accent text-sm font-medium px-5 py-2.5 rounded-md`
**Outline button:** `border border-accent-foreground text-accent-foreground text-sm font-medium px-5 py-2.5 rounded-md`
