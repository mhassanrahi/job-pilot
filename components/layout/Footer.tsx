import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-surface border-t border-border">
      <div className="max-w-[1440px] mx-auto px-8 py-10 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="JobPilot logo" width={28} height={28} />
          <span className="text-base font-bold text-text-darkest">JobPilot</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/dashboard"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/find-jobs"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Find Jobs
          </Link>
          <Link
            href="/profile"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Profile
          </Link>
          <Link
            href="/login"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Sign In
          </Link>
        </nav>

        <p className="text-sm text-text-muted">
          © {new Date().getFullYear()} JobPilot. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
