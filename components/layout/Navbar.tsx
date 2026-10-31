import Image from "next/image";
import Link from "next/link";

export function Navbar() {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex h-24 w-full max-w-[1720px] items-center justify-between gap-4 px-5 lg:px-12">
        <Link href="/" aria-label="JobPilot home" className="shrink-0">
          <Image src="/logo.png" alt="JobPilot" width={148} height={50} priority className="w-[130px] sm:w-[148px]" />
        </Link>
        <nav aria-label="Primary navigation" className="hidden items-center gap-12 md:flex">
          <Link className="text-base font-medium text-text-dark transition-colors hover:text-accent" href="/dashboard">
            Dashboard
          </Link>
          <Link className="text-base font-medium text-text-dark transition-colors hover:text-accent" href="/find-jobs">
            Find Jobs
          </Link>
          <Link className="text-base font-medium text-text-dark transition-colors hover:text-accent" href="/profile">
            Profile
          </Link>
        </nav>
        <Link
          href="/login"
          className="shrink-0 rounded-md bg-overlay px-4 py-3 text-xs font-medium text-accent-foreground transition-opacity hover:opacity-90 sm:px-6 sm:text-base"
        >
          Start for free
        </Link>
      </div>
    </header>
  );
}
