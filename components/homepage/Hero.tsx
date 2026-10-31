import Link from "next/link";

export function Hero() {
  return (
    <section className="soft-spectrum mt-20 flex min-h-[560px] flex-col items-center justify-center border-y border-border px-6 py-20 text-center lg:mt-24">
      <h1 className="max-w-5xl text-[40px] font-semibold leading-[1.08] tracking-[-0.05em] text-text-black sm:text-6xl md:text-[76px]">
        Job hunting is hard.
        <br />
        Your tools shouldn’t be.
      </h1>
      <p className="mt-9 max-w-3xl text-lg leading-8 text-text-secondary sm:text-xl">
        Stop applying blind. JobPilot finds the jobs, researches the companies, and gives you everything you need to stand out.
      </p>
      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <Link
          href="/login"
          className="rounded-md bg-overlay px-8 py-4 text-base font-medium text-accent-foreground transition-opacity hover:opacity-90"
        >
          Get Started <span aria-hidden="true" className="ml-1 text-text-muted">▶</span>
        </Link>
        <Link
          href="/find-jobs"
          className="rounded-md border border-border bg-surface/60 px-8 py-4 text-base font-medium text-text-black transition-colors hover:bg-surface"
        >
          Find Your First Match
        </Link>
      </div>
    </section>
  );
}
