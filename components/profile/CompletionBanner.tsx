import { AlertCircle, CheckCircle2 } from "lucide-react";

const RADIUS = 36;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function CompletionBanner({
  missingFields,
  completionPct,
}: {
  missingFields: string[];
  completionPct: number;
}) {
  const offset = CIRCUMFERENCE * (1 - completionPct / 100);
  const isComplete = missingFields.length === 0;

  return (
    <div className="bg-surface rounded-2xl border border-border p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.1),_0px_1px_2px_-1px_rgba(0,0,0,0.1)] flex items-start justify-between gap-6">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          {isComplete ? (
            <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-error shrink-0" />
          )}
          <h2 className="text-sm font-semibold text-text-primary">
            {isComplete ? "Profile complete" : "Profile needs attention"}
          </h2>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed max-w-md">
          {isComplete
            ? "Your profile is complete. Agents will use this to represent you accurately."
            : "Complete the missing fields to improve your chance of getting tailored matches and generating quality resumes."}
        </p>
        {!isComplete && (
          <div className="flex items-center gap-2">
            {missingFields.map((field) => (
              <span
                key={field}
                className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-warning/10 text-warning tracking-wide"
              >
                {field}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="relative shrink-0 w-20 h-20">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle
            cx="50"
            cy="50"
            r={RADIUS}
            fill="none"
            strokeWidth="8"
            style={{ stroke: "var(--color-border)" }}
          />
          <circle
            cx="50"
            cy="50"
            r={RADIUS}
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
            style={{
              stroke: isComplete
                ? "var(--color-success)"
                : "var(--color-text-primary)",
              strokeDasharray: CIRCUMFERENCE,
              strokeDashoffset: offset,
              transition: "stroke-dashoffset 0.5s ease",
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-text-primary">
            {completionPct}%
          </span>
        </div>
      </div>
    </div>
  );
}
