import Image from "next/image";
import Link from "next/link";

export function Navbar() {
  return (
    <header className="w-full bg-surface border-b border-border">
      <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="JobPilot logo" width={36} height={36} />
          <span className="text-[19px] font-bold leading-7 text-text-darkest">
            JobPilot
          </span>
        </Link>

        <nav className="flex items-center gap-8">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-text-dark hover:text-accent transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/find-jobs"
            className="text-sm font-medium text-text-dark hover:text-accent transition-colors"
          >
            Find Jobs
          </Link>
          <Link
            href="/profile"
            className="text-sm font-medium text-text-dark hover:text-accent transition-colors"
          >
            Profile
          </Link>
        </nav>

        <Link
          href="/login"
          className="bg-accent text-accent-foreground text-sm font-medium px-4 py-2 rounded-md hover:bg-accent-dark transition-colors"
        >
          Get Started
        </Link>
      </div>
    </header>
  );
}
