import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="bg-surface py-20 text-center">
      <div className="max-w-[1440px] mx-auto px-8">
        <h1 className="text-5xl font-bold text-text-primary leading-tight mb-5">
          Job hunting is hard.<br />
          Your tools shouldn't be.
        </h1>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-10">
          JobPilot finds the right jobs, scores them against your profile, and
          researches each company automatically. You just decide which ones to
          apply to.
        </p>
        <div className="flex items-center justify-center gap-4 mb-14">
          <Link
            href="/login"
            className="bg-accent text-accent-foreground text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-accent-dark transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="bg-surface border border-border text-text-primary text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-surface-secondary transition-colors"
          >
            Find Your First Match
          </Link>
        </div>
        <div className="rounded-xl overflow-hidden shadow-2xl mx-auto max-w-5xl border border-border">
          <Image
            src="/images/dashboard-demo.png"
            alt="JobPilot dashboard preview"
            width={1280}
            height={780}
            className="w-full h-auto"
            priority
          />
        </div>
      </div>
    </section>
  );
}
