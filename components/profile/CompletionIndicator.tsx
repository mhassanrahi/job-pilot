const missingFields = ["Phone", "Location", "Education"];

export function CompletionIndicator() {
  return (
    <section className="w-full min-w-0 rounded-xl border border-error/20 bg-surface p-6 shadow-sm sm:p-8" aria-labelledby="profile-attention-title">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-5 items-center justify-center rounded-full border-2 border-error text-xs font-semibold text-error" aria-hidden="true">
              !
            </span>
            <h1 id="profile-attention-title" className="text-lg font-semibold text-text-primary">
              Profile needs attention
            </h1>
          </div>
          <p className="mt-2 max-w-xl text-sm leading-5 text-text-secondary">
            Complete the missing fields to improve your chance of getting tailored matches and generating quality resumes.
          </p>
          <div className="mt-4 flex flex-wrap gap-2" aria-label="Missing profile fields">
            {missingFields.map((field) => (
              <span key={field} className="rounded-sm bg-error/10 px-2 py-1 text-xs font-semibold uppercase text-error">
                {field}
              </span>
            ))}
          </div>
        </div>
        <div className="relative grid size-28 shrink-0 place-items-center self-center" aria-label="Profile 70 percent complete">
          <svg className="size-28 -rotate-90" viewBox="0 0 112 112" aria-hidden="true">
            <circle cx="56" cy="56" r="45" fill="none" stroke="currentColor" strokeWidth="10" className="text-error/15" />
            <circle
              cx="56"
              cy="56"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray="197.9 282.7"
              className="text-error"
            />
          </svg>
          <span className="absolute text-2xl font-semibold text-text-primary">70%</span>
        </div>
      </div>
    </section>
  );
}
