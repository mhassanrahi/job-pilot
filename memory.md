# Memory — Feature 01 Homepage

Last updated: 2026-06-17

## What was built

Complete static homepage for JobPilot — Feature 01 from the build plan. All 6 Server Components assembled in `app/page.tsx`.

**Files created:**
- `components/layout/Navbar.tsx` — logo, Dashboard/Find Jobs/Profile links, "Get Started" → `/login`
- `components/layout/Footer.tsx` — logo, nav links, dynamic copyright year
- `components/homepage/Hero.tsx` — two-line headline, subheadline, two CTA buttons, dashboard screenshot
- `components/homepage/Features.tsx` — two alternating grid sections (text+image), 3 feature bullets each with lucide-react icons
- `components/homepage/BottomCta.tsx` — gradient CTA section using `bg-accent-gradient` utility

**Files modified:**
- `app/page.tsx` — full assembly of all sections
- `app/globals.css` — added `@utility bg-accent-gradient` (135deg accent→accent-dark gradient)
- `context/ui-registry.md` — all 6 components registered with file paths and class patterns
- `context/progress-tracker.md` — `[x] 01 Homepage` checked, Next: `02 Auth`

**Dependency added:** `lucide-react` (icons for Features section)

## Decisions made

- **All CTAs link to `/login` unconditionally.** Auth-aware redirect (`/login` vs `/dashboard`) deferred to Feature 02 Auth.
- **`rounded-md` = 8px** in this project because `--radius-md: 8px` is declared in `@theme`, overriding Tailwind's default 6px. `rounded-lg` = 12px, `rounded-xl` = 16px. All buttons use `rounded-md`.
- **`bg-accent-gradient` utility** added to `globals.css` via `@utility` rather than inline styles, keeping gradient controllable via the token system.
- **No responsive breakpoints.** Homepage is desktop-only per spec. Mobile breakpoints explicitly out of scope for Feature 01.
- **`<main className="flex-1">`** inside `body className="min-h-full flex flex-col"` — `flex-1` lets main grow to fill remaining height without adding extra viewport height (using `min-h-screen` caused a permanent scrollbar).
- **`text-accent-foreground/80`** used for semi-transparent white text in BottomCta — Tailwind v4 opacity modifier on a token-derived class, no inline styles.
- **`agnet-log.png`** — the public asset has a typo ("agnet" not "agent"). Code correctly references the file as-is.

## Problems solved

- **`rounded-md` vs `rounded-lg` confusion** — an early review incorrectly suggested `rounded-lg` for 8px. Correct answer: with `--radius-md: 8px` in `@theme`, `rounded-md` IS 8px and `rounded-lg` is 12px. Fixed in a cleanup commit.
- **Scrollbar bug** — `<main className="min-h-screen">` inside a `flex-col min-h-full` body produced Navbar+100vh+Footer total height. Fixed to `flex-1`.
- **Inline style violations in BottomCta** — gradient and rgba color were originally inline styles. Refactored: gradient → `@utility bg-accent-gradient`, rgba → `text-accent-foreground/80`, `hover:bg-white/10` → `hover:bg-accent-foreground/10`.

## Current state

Feature 01 Homepage is **fully complete and clean**. Build passes with zero TypeScript errors. All context docs updated. 12 commits on `main` (branch: `homepage`).

The page renders: Navbar → Hero → Features (2 sections) → Testimonial → BottomCta → Footer.

## Next session starts with

**Feature 02 — Auth** (Phase 1, Foundation).

From `context/build-plan.md` — Feature 02 scope:
- Login page UI: Google OAuth button, GitHub OAuth button
- InsForge Auth: Google OAuth + GitHub OAuth via `@insforge/ssr`
- OAuth callback handler at `app/(auth)/callback/page.tsx`
- Session management via middleware (`middleware.ts`)
- Protected routes: `/dashboard`, `/profile`, `/find-jobs`, `/find-jobs/[id]`
- Public routes: `/`, `/login`
- After login → redirect to `/dashboard`

CTA buttons on the homepage are already pointing to `/login` — the login page just needs to be built.

Before starting: run `/remember restore`, read all context files per AGENTS.md order, then `/architect` (AGENTS.md recommends this before complex features).

## Open questions

- InsForge (`@insforge/ssr`) — not yet installed. Need to check if it's available as an npm package or if it requires different setup. Check AGENTS.md for an installed InsForge skill before implementing.
- Middleware in Next.js 16 — APIs may differ from training data. Read `node_modules/next/dist/docs/` before implementing.
- OAuth redirect URLs — will need to be configured in InsForge dashboard. Not a code question but needs to happen before testing.
