"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import posthog from "posthog-js";
import { CtaLink } from "@/components/homepage/CtaLink";

export function Navbar() {
  const pathname = usePathname();

  const handleNavClick = (label: string, href: string) => {
    posthog.capture("nav_link_clicked", { label, href });
  };

  const navClass = (href: string) =>
    `text-sm font-medium transition-colors ${
      pathname === href
        ? "text-accent"
        : "text-text-dark hover:text-accent"
    }`;

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
            onClick={() => handleNavClick("Dashboard", "/dashboard")}
            className={navClass("/dashboard")}
          >
            Dashboard
          </Link>
          <Link
            href="/find-jobs"
            onClick={() => handleNavClick("Find Jobs", "/find-jobs")}
            className={navClass("/find-jobs")}
          >
            Find Jobs
          </Link>
          <Link
            href="/profile"
            onClick={() => handleNavClick("Profile", "/profile")}
            className={navClass("/profile")}
          >
            Profile
          </Link>
        </nav>

        <CtaLink
          href="/login"
          ctaLocation="navbar"
          ctaLabel="Get Started"
          className="bg-accent text-accent-foreground text-sm font-medium px-4 py-2 rounded-md hover:bg-accent-dark transition-colors"
        >
          Get Started
        </CtaLink>
      </div>
    </header>
  );
}
