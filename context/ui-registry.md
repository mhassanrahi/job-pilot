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

### Navbar

File: `components/layout/Navbar.tsx`
Last updated: 2026-10-31

| Property | Class |
| --- | --- |
| Background | `bg-surface` |
| Border | `border-b border-border` |
| Border radius | none |
| Text — primary | `text-text-dark` |
| Text — secondary | `text-accent-foreground` |
| Spacing | `h-24 px-5 lg:px-12` |
| Hover state | `hover:text-accent`, `hover:opacity-90` |
| Shadow | none |
| Accent usage | `bg-overlay` primary CTA |

**Pattern notes:** The desktop navbar uses a centered `max-w-[1720px]` container, hides primary navigation below `md`, and keeps the logo and CTA visible at every size.

### Landing CTA

Files: `components/homepage/Hero.tsx`, `app/page.tsx`
Last updated: 2026-10-31

| Property | Class |
| --- | --- |
| Background | `soft-spectrum` |
| Border | `border-y border-border` |
| Border radius | `rounded-md` buttons |
| Text — primary | `text-text-black` |
| Text — secondary | `text-text-secondary` / `text-text-dark` |
| Spacing | `px-6 py-20`, `gap-4` |
| Hover state | `hover:opacity-90`, `hover:bg-surface` |
| Shadow | none |
| Accent usage | `bg-overlay text-accent-foreground` primary CTA |

**Pattern notes:** Marketing CTAs use a soft pink/blue spectrum surface, a dark primary action, and a translucent white secondary action. Button pairs stack on mobile and align horizontally from `sm` upward.

### Dashboard Preview

File: `components/homepage/DashboardPreview.tsx`
Last updated: 2026-10-31

| Property | Class |
| --- | --- |
| Background | `bg-surface-tertiary` |
| Border | none |
| Border radius | `rounded-[30px]` |
| Text — primary | none |
| Text — secondary | none |
| Spacing | `px-5 py-16 md:px-20 md:py-20` |
| Hover state | none |
| Shadow | `shadow-2xl` |
| Accent usage | supplied dashboard artwork |

**Pattern notes:** Product screenshots sit on muted full-width panels and retain their native aspect ratio. Use generous padding and a soft elevated frame for the primary dashboard preview.

### Feature Showcase

Files: `components/homepage/HowItWorks.tsx`, `components/homepage/Features.tsx`
Last updated: 2026-10-31

| Property | Class |
| --- | --- |
| Background | `bg-surface`, `bg-surface-muted` |
| Border | `border-b border-border` |
| Border radius | none |
| Text — primary | `text-text-black`, `text-text-darker` |
| Text — secondary | `text-text-secondary` |
| Spacing | `px-10 py-16 lg:px-24`, row `px-10 py-10/11 lg:px-24` |
| Hover state | none |
| Shadow | none |
| Accent usage | `border-l-accent`, `border-l-success` selected rows |

**Pattern notes:** Homepage feature showcases use a two-column editorial split: white copy panels paired with muted image panels. Selected feature rows are marked by a two-pixel semantic accent border.

### Testimonial

File: `components/homepage/Testimonial.tsx`
Last updated: 2026-10-31

| Property | Class |
| --- | --- |
| Background | `bg-surface` |
| Border | none |
| Border radius | `rounded-lg` portrait |
| Text — primary | `text-text-darker`, `text-text-black` |
| Text — secondary | `text-text-secondary` |
| Spacing | `px-8 py-24`, `mt-10` |
| Hover state | none |
| Shadow | none |
| Accent usage | `text-accent` uppercase eyebrow |

**Pattern notes:** Testimonials are centered, spacious, and use an uppercase accent eyebrow with a large editorial quote and compact author lockup.

### Footer

File: `components/layout/Footer.tsx`
Last updated: 2026-10-31

| Property | Class |
| --- | --- |
| Background | `bg-surface` |
| Border | inherited section border |
| Border radius | none |
| Text — primary | `text-text-dark` |
| Text — secondary | none |
| Spacing | `px-8 py-16 md:px-14`, `gap-10` |
| Hover state | `hover:text-accent` |
| Shadow | none |
| Accent usage | brand logo and link hover |

**Pattern notes:** The footer stacks on small screens and becomes a single horizontal row at `md`, with the wordmark left and simple text links right.

### Auth Surface

Files: `app/(auth)/login/page.tsx`, `app/dashboard/page.tsx`, `components/auth/OAuthButton.tsx`, `components/auth/SignOutButton.tsx`
Last updated: 2026-11-02

| Property | Class |
| --- | --- |
| Background | `soft-spectrum` page, `bg-surface` card |
| Border | `border border-border` |
| Border radius | `rounded-xl` card, `rounded-md` actions |
| Text — primary | `text-text-primary` |
| Text — secondary | `text-text-secondary`, `text-text-muted` |
| Spacing | `p-6 sm:p-8` card, `space-y-3` actions |
| Hover state | `hover:bg-surface-secondary`, `hover:text-accent` |
| Shadow | `shadow-lg` |
| Accent usage | `soft-spectrum` page background, semantic success state |

**Pattern notes:** Authentication screens use a centered white card on the shared spectrum background. Provider actions are full-width neutral bordered buttons, while session completion uses the semantic success palette. The sign-out action preserves the established `bg-overlay` primary-action treatment. Loading states preserve the same card silhouette with `bg-surface-tertiary` skeletons.

### Analytics Lifecycle

Files: `components/analytics/PostHogProvider.tsx`, `components/analytics/PostHogIdentify.tsx`
Last updated: 2026-11-02

| Property | Class |
| --- | --- |
| Background | none |
| Border | none |
| Border radius | none |
| Text — primary | none |
| Text — secondary | none |
| Spacing | none |
| Hover state | none |
| Shadow | none |
| Accent usage | none |

**Pattern notes:** Analytics lifecycle components are intentionally non-visual. Keep PostHog context and authenticated-user identification isolated from rendered UI so future analytics work does not introduce styling or layout side effects.

### Database Foundation

Files: `migrations/20261110071940_create-job-pilot-schema.sql`
Last updated: 2026-11-10

| Property | Class |
| --- | --- |
| Background | none |
| Border | none |
| Border radius | none |
| Text — primary | none |
| Text — secondary | none |
| Spacing | none |
| Hover state | none |
| Shadow | none |
| Accent usage | none |

**Pattern notes:** Feature 04 is intentionally non-visual. Database tables, RLS,
least-privilege grants, and private resume storage establish the data contract
used by later profile, job discovery, research, and dashboard components.

### Authenticated App Navigation

File: `components/profile/ProfileNavbar.tsx`
Last updated: 2026-11-10

| Property | Class |
| --- | --- |
| Background | `bg-surface` |
| Border | `border-b border-border` |
| Border radius | none |
| Text — primary | `text-text-dark` |
| Text — secondary | none |
| Spacing | `h-16 px-5 sm:px-8`, `gap-5 sm:gap-8` |
| Hover state | `hover:text-accent` |
| Shadow | none |
| Accent usage | `text-accent`, `bg-accent` active indicator |

**Pattern notes:** Authenticated product pages use a compact 64px app header. The active route uses accent text and a two-pixel bottom indicator. Below `sm`, navigation labels become screen-reader-only and the three icons remain visible.

### Profile Completion Banner

File: `components/profile/CompletionIndicator.tsx`
Last updated: 2026-11-10

| Property | Class |
| --- | --- |
| Background | `bg-surface` |
| Border | `border border-error/20` |
| Border radius | `rounded-xl` |
| Text — primary | `text-text-primary` |
| Text — secondary | `text-text-secondary` |
| Spacing | `p-6 sm:p-8`, `gap-6` |
| Hover state | none |
| Shadow | `shadow-sm` |
| Accent usage | `text-error`, `bg-error/10` missing-field badges and progress ring |

**Pattern notes:** Incomplete-profile guidance stays on a white card and uses the semantic error palette only for the alert icon, missing-field labels, and circular completion indicator. The content stacks on small screens.

### Resume Upload Card

File: `components/profile/ResumeUpload.tsx`
Last updated: 2026-11-10

| Property | Class |
| --- | --- |
| Background | `bg-surface`, `bg-surface-secondary` drop zone |
| Border | `border border-border`, `border-dashed border-border-muted` drop zone |
| Border radius | `rounded-xl`, `rounded-lg` drop zone |
| Text — primary | `text-text-primary` |
| Text — secondary | `text-text-secondary` |
| Spacing | `p-6 sm:p-8`, `px-5 py-8` drop zone |
| Hover state | `hover:bg-surface-secondary`, `hover:opacity-90` |
| Shadow | `shadow-sm` |
| Accent usage | `text-accent`, `border-accent bg-accent-muted` drag state, `bg-accent` primary action |

**Pattern notes:** File upload areas use a light secondary surface with a dashed token border. Drag state changes only the border and subtle surface accent; the upload control remains neutral while the downstream action is primary.

### Profile Form

File: `components/profile/ProfileForm.tsx`
Last updated: 2026-11-10

| Property | Class |
| --- | --- |
| Background | `bg-surface`, `bg-surface-secondary` nested role cards |
| Border | `border border-border`, section `border-t border-border` |
| Border radius | `rounded-xl`, `rounded-lg` nested role cards, `rounded-md` controls |
| Text — primary | `text-text-primary` |
| Text — secondary | `text-text-secondary`, `text-text-muted` |
| Spacing | `p-6 sm:p-8`, section `pt-8`, fields `gap-5` |
| Hover state | `hover:bg-border`, primary `hover:opacity-90` |
| Shadow | `shadow-sm`, inputs `shadow-sm` |
| Accent usage | `focus:border-accent focus:ring-1 focus:ring-accent`, `bg-accent` save action |

**Pattern notes:** Long forms use bordered section dividers, uppercase 12px labels, 44px minimum-height controls, and a two-column grid from `md`. Nested repeatable records use the secondary surface and one lower radius level. Primary submit actions span the card width.
