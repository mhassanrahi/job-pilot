type Props = {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  pageSize: number;
  onPageChange: (page: number) => void;
};

function getPageNumbers(currentPage: number, totalPages: number): (number | "...")[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages];
  }
  if (currentPage >= totalPages - 2) {
    return [1, "...", totalPages - 2, totalPages - 1, totalPages];
  }
  return [1, "...", currentPage, "...", totalPages];
}

export function JobsPagination({
  currentPage,
  totalPages,
  totalResults,
  pageSize,
  onPageChange,
}: Props) {
  const startResult = (currentPage - 1) * pageSize + 1;
  const endResult = Math.min(currentPage * pageSize, totalResults);
  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <div className="px-6 py-4 flex items-center justify-between border-t border-border">
      <span className="text-sm text-text-muted">
        Showing{" "}
        <span className="font-medium text-text-primary">{startResult}</span> to{" "}
        <span className="font-medium text-text-primary">{endResult}</span> of{" "}
        <span className="font-medium text-text-primary">{totalResults}</span> results
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1.5 text-sm text-text-secondary border border-border rounded-md hover:bg-surface-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        {pages.map((page, i) => {
          if (page === "...") {
            return (
              <span key={`ellipsis-${i}`} className="px-2 py-1.5 text-sm text-text-muted select-none">
                ...
              </span>
            );
          }
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 text-sm rounded-md transition-colors ${
                page === currentPage
                  ? "bg-accent text-accent-foreground"
                  : "text-text-secondary hover:bg-surface-secondary"
              }`}
            >
              {page}
            </button>
          );
        })}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 text-sm text-text-secondary border border-border rounded-md hover:bg-surface-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
