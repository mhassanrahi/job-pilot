type Props = {
  isAuthenticated?: boolean;
};

export function BottomCta({ isAuthenticated = false }: Props) {
  return (
    <section className="soft-spectrum flex min-h-[520px] flex-col items-center justify-center px-6 py-24 text-center">
      <h2 className="max-w-4xl text-4xl font-semibold tracking-[-0.04em] text-text-black sm:text-5xl md:text-[64px] md:leading-[1.08]">
        Your next job search can feel a lot less overwhelming
      </h2>
      <p className="mt-10 text-base text-text-dark sm:text-xl">
        Set up your profile, upload your resume, and start finding matches in minutes.
      </p>
      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <a
          href={isAuthenticated ? "/dashboard" : "/login"}
          className="rounded-md bg-overlay px-8 py-4 text-base font-medium text-accent-foreground transition-opacity hover:opacity-90"
        >
          Get Started <span aria-hidden="true" className="ml-1 text-text-muted">▶</span>
        </a>
        <a
          href="/find-jobs"
          className="rounded-md border border-border bg-surface/60 px-8 py-4 text-base font-medium text-text-black transition-colors hover:bg-surface"
        >
          Find Your First Match
        </a>
      </div>
    </section>
  );
}
