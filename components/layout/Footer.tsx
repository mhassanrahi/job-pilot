import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="flex min-h-[190px] flex-col items-center justify-between gap-10 bg-surface px-8 py-16 md:flex-row md:px-14">
      <Link href="/" aria-label="JobPilot home">
        <Image src="/logo.png" alt="JobPilot" width={164} height={56} />
      </Link>
      <nav aria-label="Footer navigation" className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
        <Link className="text-base text-text-dark transition-colors hover:text-accent" href="/dashboard">
          Dashboard
        </Link>
        <Link className="text-base text-text-dark transition-colors hover:text-accent" href="/privacy">
          Privacy Policy
        </Link>
        <Link className="text-base text-text-dark transition-colors hover:text-accent" href="/terms">
          Terms &amp; Condition
        </Link>
      </nav>
    </footer>
  );
}
