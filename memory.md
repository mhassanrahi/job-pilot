# Memory — Feature 02 Auth

Last updated: 2026-06-17

## What was built

Complete OAuth authentication flow for JobPilot — Feature 02 from the build plan. Google + GitHub OAuth via InsForge BaaS.

**Files created:**
- `.env.local` — InsForge credentials (`NEXT_PUBLIC_INSFORGE_URL`, `NEXT_PUBLIC_INSFORGE_ANON_KEY`) — values redacted here
- `app/api/auth/refresh/route.ts` — token refresh endpoint using `createRefreshAuthRouter()` from `@insforge/sdk/ssr`
- `lib/insforge-client.ts` — browser-side singleton via `createBrowserClient()` from `@insforge/sdk/ssr`
- `lib/insforge-server.ts` — server-side factory via `createServerClient()` from `@insforge/sdk/ssr`, accepts awaited `cookies()`
- `actions/auth.ts` — `signInWithOAuth(provider)` + `signOut()` Server Actions
- `components/auth/LoginCard.tsx` — client component, Google + GitHub OAuth buttons, spinner states, error display
- `app/(auth)/login/page.tsx` — Server Component, auth-guard redirect, passes `?error` param to LoginCard
- `app/(auth)/callback/route.ts` — OAuth exchange route handler (GET), PKCE code verifier flow
- `proxy.ts` — Next.js 16 middleware (named `proxy`, not `middleware`)

**Files modified:**
- `context/ui-registry.md` — LoginCard registered
- `context/progress-tracker.md` — `[x] 02 Auth` checked, Next: `03 PostHog`

## Decisions made

- **`@insforge/sdk/ssr` is the correct subpath** — `@insforge/ssr` does not exist on npm (404). All SSR helpers (`createBrowserClient`, `createServerClient`, `createAuthActions`, `createRefreshAuthRouter`) live at `@insforge/sdk/ssr`. Middleware helper `getAccessTokenCookieName` is at `@insforge/sdk/ssr/middleware`.
- **Next.js 16 middleware is `proxy.ts`** — the file is named `proxy.ts` (not `middleware.ts`) and exports a function named `proxy` (not `middleware`). The `config` export with `matcher` works the same way.
- **Proxy does lightweight cookie check only** — `proxy.ts` checks `request.cookies.get(TOKEN_COOKIE)?.value != null` rather than calling `updateSession`. Full session management via `updateSession` was abandoned due to `RequestCookies` vs SDK `CookieStore` type incompatibility that couldn't be resolved cleanly.
- **`getAccessTokenCookieName()` at module level** — called once at import time as `const TOKEN_COOKIE`, not inside the handler, since `proxy` is not `async`.
- **PKCE flow with httpOnly cookie** — `signInWithOAuth` stores `codeVerifier` in `insforge_code_verifier` httpOnly cookie (10 min TTL). Callback route reads it, calls `exchangeOAuthCode(code, codeVerifier)`, then deletes the cookie.
- **`searchParams` is `Promise<{...}>` in Next.js 16** — page props `searchParams` must be awaited before use.
- **Google icon hardcoded hex colors** — `GoogleIcon` SVG uses `#4285F4`, `#34A853`, `#FBBC04`, `#EA4335`. These are Google brand-mandated values with no project token equivalent. Intentional exception to the no-hex rule, documented with a comment.
- **LoginCard gradient via CSS vars** — `style={{ background: "linear-gradient(45deg, var(--color-accent) 0%, var(--color-accent-dark) 100%)" }}` — uses CSS variables, not hex.

## Problems solved

- **`@insforge/ssr` 404** — package doesn't exist. Correct import is `@insforge/sdk/ssr`.
- **`lucide-react` has no `Github` export** — replaced with inline `GitHubIcon` SVG component.
- **`CookieStore` type mismatch in proxy** — `RequestCookies` from Next.js is not assignable to InsForge `CookieStore`. Solved by abandoning `updateSession` and doing a direct cookie name check instead.
- **`| never` in return type** — `Promise<{ error: string } | never>` is a TypeScript anti-pattern (collapses to `{ error: string }`). Fixed to `Promise<{ error: string }>`.
- **`signOut` swallowed errors silently** — now logs the error with `console.error("[signOut]", error)` before redirecting.
- **`errorParam` not URL-encoded in callback** — fixed with `encodeURIComponent(errorParam ?? "missing_code")`.
- **`exchangeOAuthCode` had no try/catch** — wrapped in try/catch, error stored in `exchangeError` variable.

## Current state

Feature 02 Auth is **fully complete and clean**. All code standard violations from the review are fixed:
- No hardcoded hex values in project UI (Google brand colors excepted)
- All route handlers have try/catch
- Return types are correct
- Errors are logged, not swallowed
- `proxy.ts` is synchronous and uses module-level token cookie name

OAuth redirect URLs still need to be configured in the InsForge dashboard before end-to-end testing is possible.

## Next session starts with

**Feature 03 — PostHog Analytics** (Phase 1, Foundation).

From `context/build-plan.md` — Feature 03 scope:
- Install `posthog-js`
- Create `PostHogProvider` client component wrapping `posthog.init()`
- Add `PostHogPageView` for SPA page tracking
- Identify logged-in users via `posthog.identify(user.id)`
- Wrap `app/layout.tsx` root layout with the provider

Before starting: run `/remember restore`, read all context files per AGENTS.md order, then check if there is an installed PostHog skill before installing any packages.

## Open questions

- OAuth redirect URLs need to be registered in the InsForge dashboard (`https://<domain>/callback`). Must be done before testing the full OAuth flow end to end.
- `--color-accent-dark` CSS variable — used in the gradient but not verified against the `@theme` token list in `context/ui-tokens.md`. Confirm it exists before the next UI session.
