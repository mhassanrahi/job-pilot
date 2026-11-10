import Image from "next/image";
import Link from "next/link";

export function ProfileNavbar() {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between px-5 sm:px-8">
        <Link href="/" aria-label="JobPilot home" className="shrink-0">
          <Image
            src="/logo.png"
            alt="JobPilot"
            width={148}
            height={50}
            priority
            className="w-[112px] sm:w-[122px]"
          />
        </Link>
        <nav aria-label="Primary navigation" className="flex h-full items-center gap-5 sm:gap-8">
          <Link
            href="/dashboard"
            className="inline-flex h-full items-center gap-2 text-xs font-medium text-text-dark transition-colors hover:text-accent sm:text-sm"
          >
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            <span className="sr-only sm:not-sr-only">Dashboard</span>
          </Link>
          <Link
            href="/find-jobs"
            className="inline-flex h-full items-center gap-2 text-xs font-medium text-text-dark transition-colors hover:text-accent sm:text-sm"
          >
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>
            <span className="sr-only sm:not-sr-only">Find Jobs</span>
          </Link>
          <Link
            href="/profile"
            aria-current="page"
            className="relative inline-flex h-full items-center gap-2 text-xs font-medium text-accent sm:text-sm"
          >
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <circle cx="12" cy="8" r="3" />
              <path d="M6.5 20a5.5 5.5 0 0 1 11 0" />
            </svg>
            <span className="sr-only sm:not-sr-only">Profile</span>
            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-accent" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
