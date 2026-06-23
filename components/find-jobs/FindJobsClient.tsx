"use client";

import { useState } from "react";
import { SearchControls } from "@/components/find-jobs/SearchControls";
import { JobFilters } from "@/components/find-jobs/JobFilters";
import { JobsTable } from "@/components/find-jobs/JobsTable";
import { JobsPagination } from "@/components/find-jobs/JobsPagination";

export type Job = {
  id: string;
  company: string;
  role: string;
  matchScore: number;
  salary: string;
  dateFound: string;
};

const MOCK_JOBS: Job[] = [
  { id: "1", company: "Vercel",  role: "Senior Frontend Engineer",  matchScore: 94, salary: "$160k–$200k", dateFound: "2 hours ago" },
  { id: "2", company: "Stripe",  role: "Staff UI Engineer",          matchScore: 88, salary: "$180k–$240k", dateFound: "Yesterday"   },
  { id: "3", company: "Linear",  role: "Product Engineer",           matchScore: 96, salary: "$150k–$190k", dateFound: "Yesterday"   },
  { id: "4", company: "Notion",  role: "Frontend Developer",         matchScore: 72, salary: "$130k–$170k", dateFound: "2 days ago"  },
  { id: "5", company: "OpenAI",  role: "Design Engineer",            matchScore: 91, salary: "$200k–$280k", dateFound: "3 days ago"  },
  { id: "6", company: "Figma",   role: "Software Engineer, Editor",  matchScore: 85, salary: "$170k–$220k", dateFound: "4 days ago"  },
];

export function FindJobsClient() {
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [showSuccess, setShowSuccess] = useState(true);
  const [filterText, setFilterText] = useState("");
  const [matchFilter, setMatchFilter] = useState<"all" | "high" | "low">("all");
  const [sortBy, setSortBy] = useState<"match_score" | "newest" | "oldest">("match_score");
  const [currentPage, setCurrentPage] = useState(1);

  const PAGE_SIZE = 6;

  const filtered = MOCK_JOBS.filter((job) => {
    if (filterText) {
      const q = filterText.toLowerCase();
      if (!job.company.toLowerCase().includes(q) && !job.role.toLowerCase().includes(q)) return false;
    }
    if (matchFilter === "high" && job.matchScore < 80) return false;
    if (matchFilter === "low" && job.matchScore >= 80) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "match_score") return b.matchScore - a.matchScore;
    const aIdx = MOCK_JOBS.findIndex((j) => j.id === a.id);
    const bIdx = MOCK_JOBS.findIndex((j) => j.id === b.id);
    return sortBy === "newest" ? aIdx - bIdx : bIdx - aIdx;
  });

  const totalFiltered = sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / PAGE_SIZE));
  const visibleJobs = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="max-w-[1440px] mx-auto px-8 py-8 flex flex-col gap-6">
      <SearchControls
        jobTitle={jobTitle}
        location={location}
        showSuccess={showSuccess}
        onJobTitleChange={setJobTitle}
        onLocationChange={setLocation}
        onSearch={() => setShowSuccess(true)}
      />
      <div className="bg-surface rounded-2xl border border-border shadow-sm">
        <JobFilters
          filterText={filterText}
          matchFilter={matchFilter}
          sortBy={sortBy}
          onFilterTextChange={(v) => { setFilterText(v); setCurrentPage(1); }}
          onMatchFilterChange={(v) => { setMatchFilter(v); setCurrentPage(1); }}
          onSortByChange={(v) => { setSortBy(v); setCurrentPage(1); }}
        />
        <JobsTable jobs={visibleJobs} />
        <JobsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalResults={totalFiltered}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
