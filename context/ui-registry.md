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

#### BottomCta
**File:** `components/homepage/BottomCta.tsx`
**Background:** `linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-dark) 100%)` via inline style
**Heading:** `text-4xl font-bold text-accent-foreground leading-tight`
**Subtext:** `color: rgba(255, 255, 255, 0.8)` via inline style
**Primary button:** `bg-accent-foreground text-accent text-sm font-medium px-5 py-2.5 rounded-md`
**Outline button:** `border border-accent-foreground text-accent-foreground text-sm font-medium px-5 py-2.5 rounded-md`
