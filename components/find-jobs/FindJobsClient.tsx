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

const PAGE_SIZE = 6;

export function FindJobsClient() {
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [searchError, setSearchError] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filterText, setFilterText] = useState("");
  const [matchFilter, setMatchFilter] = useState<"all" | "high" | "low">("all");
  const [sortBy, setSortBy] = useState<"match_score" | "newest" | "oldest">("match_score");
  const [currentPage, setCurrentPage] = useState(1);

  async function handleSearch() {
    if (!jobTitle.trim() || isSearching) return;

    setIsSearching(true);
    setShowSuccess(false);
    setSearchError("");

    try {
      const res = await fetch("/api/agent/find", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle, location }),
      });

      const json = (await res.json()) as {
        success: boolean;
        data?: { jobsFound: number; strongMatches: number; jobs: Job[] };
        error?: string;
      };

      if (json.success && json.data) {
        const { jobsFound, strongMatches, jobs: found } = json.data;
        setJobs(found);
        setSuccessMessage(
          `Found ${jobsFound} job${jobsFound !== 1 ? "s" : ""} and saved ${strongMatches} strong match${strongMatches !== 1 ? "es" : ""}.`,
        );
        setShowSuccess(true);
        setCurrentPage(1);
      } else {
        setSearchError(json.error ?? "Search failed. Please try again.");
      }
    } catch (err) {
      console.error("[FindJobsClient] search", err);
      setSearchError("Search failed. Please try again.");
    } finally {
      setIsSearching(false);
    }
  }

  const filtered = jobs.filter((job) => {
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
    const aIdx = jobs.findIndex((j) => j.id === a.id);
    const bIdx = jobs.findIndex((j) => j.id === b.id);
    return sortBy === "newest" ? aIdx - bIdx : bIdx - aIdx;
  });

  const totalFiltered = sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / PAGE_SIZE));
  const visibleJobs = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="flex flex-col gap-6">
      <SearchControls
        jobTitle={jobTitle}
        location={location}
        showSuccess={showSuccess}
        isSearching={isSearching}
        successMessage={successMessage}
        onJobTitleChange={setJobTitle}
        onLocationChange={setLocation}
        onSearch={handleSearch}
      />
      {searchError && (
        <div className="bg-error-lightest rounded-lg px-4 py-3 text-sm font-medium text-error">
          {searchError}
        </div>
      )}
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
