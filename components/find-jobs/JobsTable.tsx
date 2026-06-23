"use client";

import { Building2 } from "lucide-react";
import Link from "next/link";
import type { Job } from "@/components/find-jobs/FindJobsClient";

type Props = {
  jobs: Job[];
};

function getScoreColor(score: number): string {
  if (score >= 80) return "bg-success";
  if (score >= 60) return "bg-info";
  return "bg-warning";
}

export function JobsTable({ jobs }: Props) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-[2fr_2fr_1.5fr_1fr_1fr] gap-4 px-6 py-3 border-b border-border">
        <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">Company</span>
        <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">Role</span>
        <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">Match Score</span>
        <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">Salary Est.</span>
        <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">Date Found</span>
      </div>
      {jobs.length === 0 ? (
        <div className="px-6 py-16 flex flex-col items-center gap-2">
          <p className="text-sm text-text-muted">No jobs found.</p>
          <p className="text-xs text-text-muted">Use the search above to find matching jobs.</p>
        </div>
      ) : (
        jobs.map((job) => (
          <Link
            key={job.id}
            href={`/find-jobs/${job.id}`}
            className="grid grid-cols-[2fr_2fr_1.5fr_1fr_1fr] gap-4 px-6 py-4 border-b border-border hover:bg-surface-secondary transition-colors cursor-pointer items-center"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-surface-tertiary border border-border flex items-center justify-center shrink-0">
                <Building2 className="w-4 h-4 text-text-muted" />
              </div>
              <span className="text-sm font-medium text-text-primary">{job.company}</span>
            </div>
            <span className="text-sm text-text-primary">{job.role}</span>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1 rounded-full bg-border-light overflow-hidden">
                <div
                  className={`h-1 rounded-full ${getScoreColor(job.matchScore)}`}
                  style={{ width: `${job.matchScore}%` }}
                />
              </div>
              <span className="text-sm font-medium text-text-primary w-9 text-right">
                {job.matchScore}%
              </span>
            </div>
            <span className="text-sm text-text-primary">{job.salary}</span>
            <span className="text-sm text-text-muted">{job.dateFound}</span>
          </Link>
        ))
      )}
      <div className="px-6 py-3 text-xs text-text-muted">
        Jobs by <span className="font-medium">Adzuna</span>
      </div>
    </div>
  );
}
