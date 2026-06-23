import { Search, ChevronDown } from "lucide-react";

type Props = {
  filterText: string;
  matchFilter: "all" | "high" | "low";
  sortBy: "match_score" | "newest" | "oldest";
  onFilterTextChange: (value: string) => void;
  onMatchFilterChange: (value: "all" | "high" | "low") => void;
  onSortByChange: (value: "match_score" | "newest" | "oldest") => void;
};

export function JobFilters({
  filterText,
  matchFilter,
  sortBy,
  onFilterTextChange,
  onMatchFilterChange,
  onSortByChange,
}: Props): JSX.Element {
  return (
    <div className="px-6 py-4 flex items-center gap-3 border-b border-border">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
        <input
          type="text"
          value={filterText}
          onChange={(e) => onFilterTextChange(e.target.value)}
          placeholder="Filter by company or role..."
          className="w-full bg-surface border border-border rounded-md pl-9 pr-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
        />
      </div>
      <div className="relative">
        <select
          value={matchFilter}
          onChange={(e) => onMatchFilterChange(e.target.value as "all" | "high" | "low")}
          className="appearance-none bg-surface border border-border rounded-md pl-3 pr-8 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent cursor-pointer"
        >
          <option value="all">All Matches</option>
          <option value="high">High Match</option>
          <option value="low">Low Match</option>
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
      </div>
      <div className="relative">
        <select
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value as "match_score" | "newest" | "oldest")}
          className="appearance-none bg-surface border border-border rounded-md pl-3 pr-8 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent cursor-pointer"
        >
          <option value="match_score">Match Score</option>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
      </div>
    </div>
  );
}
