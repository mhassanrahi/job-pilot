import Link from "next/link";

export function BottomCta() {
  return (
    <section className="bg-accent-gradient py-24 text-center">
      <div className="max-w-2xl mx-auto px-8">
        <h2 className="text-4xl font-bold text-accent-foreground leading-tight mb-4">
          Your next job search can feel a lot less overwhelming
        </h2>
        <p className="text-base text-accent-foreground/80 mb-10">
          Set up your profile once. Let AI find, score, and research jobs for
          you. Show up to every interview prepared.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/login"
            className="bg-accent-foreground text-accent text-sm font-medium px-5 py-2.5 rounded-md hover:bg-surface-secondary transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium px-5 py-2.5 rounded-md border border-accent-foreground text-accent-foreground hover:bg-accent-foreground/10 transition-colors"
          >
            Find Your First Match
          </Link>
        </div>
      </div>
    </section>
  );
}
