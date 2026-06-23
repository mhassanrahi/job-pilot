import type { WorkExperience, Education } from "@/actions/profile";

export type Profile = {
  id: string;
  full_name: string | null;
  current_title: string | null;
  experience_level: string | null;
  years_experience: number | null;
  skills: string[] | null;
  industries: string[] | null;
  work_experience: WorkExperience[] | null;
  education: Education | null;
  job_titles_seeking: string[] | null;
};

export type ScoredJob = {
  matchScore: number;
  matchReason: string;
  matchedSkills: string[];
  missingSkills: string[];
};

export type JobRecord = {
  user_id: string;
  run_id: string;
  source: "search";
  source_url: string;
  external_apply_url: string;
  title: string;
  company: string;
  location: string;
  salary: string | null;
  job_type: string;
  about_role: string;
  match_score: number;
  match_reason: string;
  matched_skills: string[];
  missing_skills: string[];
  found_at: string;
};

export type InsertedJob = {
  id: string;
  title: string;
  company: string;
  salary: string | null;
  match_score: number;
  found_at: string;
};
