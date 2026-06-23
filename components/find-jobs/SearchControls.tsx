import { Search, Sparkles, Loader2 } from "lucide-react";

type Props = {
  jobTitle: string;
  location: string;
  showSuccess: boolean;
  isSearching: boolean;
  successMessage: string;
  onJobTitleChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onSearch: () => void;
};

export function SearchControls({
  jobTitle,
  location,
  showSuccess,
  isSearching,
  successMessage,
  onJobTitleChange,
  onLocationChange,
  onSearch,
}: Props) {
  return (
    <div className="bg-surface rounded-2xl border border-border shadow-card p-6 flex flex-col gap-4">
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
              disabled={isSearching}
              className="w-full bg-surface border border-border rounded-md pl-9 pr-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent disabled:opacity-50"
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
            disabled={isSearching}
            className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent disabled:opacity-50"
          />
        </div>
        <button
          onClick={onSearch}
          disabled={isSearching}
          className="bg-accent text-accent-foreground text-sm font-medium px-4 py-2 rounded-md hover:bg-accent-dark transition-colors flex items-center gap-2 shrink-0 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSearching ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              Find Jobs
            </>
          )}
        </button>
      </div>
      {showSuccess && (
        <div className="bg-success-lightest rounded-lg px-4 py-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-success shrink-0" />
          <span className="text-sm font-medium text-success-foreground">
            {successMessage}
          </span>
        </div>
      )}
    </div>
  );
}
