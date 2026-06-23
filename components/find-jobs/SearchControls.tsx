import { Search, Sparkles } from "lucide-react";

type Props = {
  jobTitle: string;
  location: string;
  showSuccess: boolean;
  onJobTitleChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onSearch: () => void;
};

export function SearchControls({
  jobTitle,
  location,
  showSuccess,
  onJobTitleChange,
  onLocationChange,
  onSearch,
}: Props): JSX.Element {
  return (
    <div className="bg-surface rounded-2xl border border-border shadow-[0px_1px_3px_rgba(0,0,0,0.1),_0px_1px_2px_-1px_rgba(0,0,0,0.1)] p-6 flex flex-col gap-4">
      <div className="flex items-end gap-4">
        <div className="flex-1">
          <label className="block text-[11px] font-medium text-text-secondary uppercase tracking-wide mb-1.5">
            Job Title
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => onJobTitleChange(e.target.value)}
              placeholder="Frontend Engineer"
              className="w-full bg-surface border border-border rounded-md pl-9 pr-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
            />
          </div>
        </div>
        <div className="flex-1">
          <label className="block text-[11px] font-medium text-text-secondary uppercase tracking-wide mb-1.5">
            Location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            placeholder="Remote, New York..."
            className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
          />
        </div>
        <button
          onClick={onSearch}
          className="bg-accent text-accent-foreground text-sm font-medium px-4 py-2 rounded-md hover:bg-accent-dark transition-colors flex items-center gap-2 shrink-0"
        >
          <Search className="w-4 h-4" />
          Find Jobs
        </button>
      </div>
      {showSuccess && (
        <div className="bg-success-lightest rounded-lg px-4 py-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-success shrink-0" />
          <span className="text-sm font-medium text-success-foreground">
            Found 8 jobs and saved 4 strong matches.
          </span>
        </div>
      )}
    </div>
  );
}
