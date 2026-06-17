# Homepage Design Spec

**Date:** 2026-06-17
**Feature:** 01 — Homepage (Phase 1, Foundation)
**Reference:** `context/designs/landing-page.png`

---

## Overview

Build the complete JobPilot landing page as a fully static Next.js page. All sections are Server Components. CTA buttons link to `/login` — no auth logic yet (deferred to Feature 02).

---

## File Structure

```
app/page.tsx                          ← assembles all sections (Server Component)
components/layout/Navbar.tsx          ← shared top navbar
components/layout/Footer.tsx          ← shared footer
components/homepage/Hero.tsx          ← hero section
components/homepage/Features.tsx      ← two alternating feature sections
components/homepage/Testimonial.tsx   ← single testimonial quote block
components/homepage/BottomCta.tsx     ← closing CTA with gradient background
```

---

## Sections

### Navbar
- Full-width, white background, 64px height, `px-6` padding
- Left: `logo.png` + "JobPilot" text
- Center/right nav links: Dashboard, Find Jobs, Profile — `text-text-dark`, 14px, weight 500
- Far right: "Get Started" primary button → `/login`
- Max-width 1440px container, centered

### Hero
- White background, centered content, `py-20`
- Headline: "Job hunting is hard. Your tools shouldn't be." — large, weight 700, `text-text-primary`
- Subheadline: one paragraph, `text-text-secondary`, 16px
- Two CTAs side by side:
  - "Get Started" → primary button (`bg-accent`) → `/login`
  - "Find Your First Match" → secondary button (outlined) → `/login`
- `images/dashboard-demo.png` centered below CTAs, rounded-xl, shadow

### Features A — "Manage Your Job Search With Ease"
- Two-column layout: text left, image right
- Section title + 3 feature bullets (icon + heading + body text)
- Feature 1: Find Jobs Across All Major Boards
- Feature 2: Know the Company Before You Apply
- Feature 3: Keep Track of Every Application
- Right column: `images/jobs-lists.png`, rounded-xl, shadow

### Features B — "Apply With More Confidence, Every Time"
- Two-column layout: image left, text right
- Left column: `images/agnet-log.png`, rounded-xl, shadow
- Section title + 3 feature bullets matching design copy
- Feature 1: Understand your fit before you apply
- Feature 2: AI-Prepared for Every Interview
- Feature 3: Choose the Right Role

### Testimonial
- Full-width, centered, `py-16`
- Quote text, `text-text-primary`, italic or weight 500
- `images/user-icon.png` avatar, name, title below quote

### Bottom CTA
- Dark purple gradient background (linear-gradient from `--color-accent` to `--color-accent-dark`)
- Centered content, `py-20`
- Headline: "Your next job search can feel a lot less overwhelming"
- Subtext paragraph, white/muted
- Two buttons: "Get Started" (white bg, accent text) and "Find Your First Match" (outlined white) → both `/login`

### Footer
- White background, full width, border-top `border-border`
- Left: logo + "JobPilot" text
- Links and copyright

---

## Constraints

- All colors via project tokens (`bg-accent`, `text-text-primary`, etc.) — zero hex, zero raw Tailwind color classes
- Font: Inter (already imported in root layout)
- Max-width 1440px on all sections, `px-8` horizontal padding
- Named exports only — no default component exports
- No `"use client"` anywhere — pure Server Components
- All images via `next/image` with explicit `width` and `height`
- CTA buttons → `/login` only (no auth check)

---

## Out of Scope

- Auth-aware CTA redirects (Feature 02)
- Mobile responsive breakpoints (not in design spec)
- Animations or transitions
