import OpenAI from "openai";
import { searchJobs, detectCountry } from "@/lib/adzuna";
import { createInsforgeServer } from "@/lib/insforge-server";
import { MATCH_THRESHOLD } from "@/lib/utils";
import type { Profile, ScoredJob, JobRecord, InsertedJob } from "@/agent/types";
import type { AdzunaJob } from "@/lib/adzuna";

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY!,
  baseURL: "https://openrouter.ai/api/v1",
});

async function scoreJob(job: AdzunaJob, profile: Profile): Promise<ScoredJob> {
  const systemPrompt = `You are a job matching assistant. Score how well a job matches a candidate's profile.
Return ONLY valid JSON with this exact shape:
{
  "matchScore": number (0-100),
  "matchReason": string (one paragraph),
  "matchedSkills": string[],
  "missingSkills": string[]
}`;

  const userPrompt = `JOB:
Title: ${job.title}
Company: ${job.company.display_name}
Description: ${job.description}

CANDIDATE:
Current title: ${profile.current_title ?? "Not specified"}
Experience level: ${profile.experience_level ?? "Not specified"}
Years of experience: ${profile.years_experience ?? 0}
Skills: ${(profile.skills ?? []).join(", ")}
Industries: ${(profile.industries ?? []).join(", ")}`;

  const response = await openai.chat.completions.create({
    model: "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
    response_format: { type: "json_object" },
    temperature: 0.3,
    max_tokens: 300,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  try {
    const rawContent = response.choices?.[0]?.message?.content;
    const raw = typeof rawContent === "string" ? rawContent : "{}";
    const parsed = JSON.parse(raw) as ScoredJob;
    return {
      matchScore: Math.max(0, Math.min(100, Math.round(Number(parsed.matchScore) || 0))),
      matchReason: parsed.matchReason ?? "",
      matchedSkills: Array.isArray(parsed.matchedSkills) ? parsed.matchedSkills : [],
      missingSkills: Array.isArray(parsed.missingSkills) ? parsed.missingSkills : [],
    };
  } catch {
    return { matchScore: 0, matchReason: "", matchedSkills: [], missingSkills: [] };
  }
}

function buildJobRecord(
  job: AdzunaJob,
  scored: ScoredJob,
  userId: string,
  runId: string,
): JobRecord {
  let salary: string | null = null;
  if (job.salary_min) {
    const min = Math.round(job.salary_min / 1000);
    const max = job.salary_max ? Math.round(job.salary_max / 1000) : min;
    salary = `$${min}k – $${max}k`;
  }

  return {
    user_id: userId,
    run_id: runId,
    source: "search",
    source_url: job.redirect_url,
    external_apply_url: job.redirect_url,
    title: job.title,
    company: job.company.display_name,
    location: job.location.display_name,
    salary,
    job_type: job.contract_type ?? "fulltime",
    about_role: job.description,
    match_score: scored.matchScore,
    match_reason: scored.matchReason,
    matched_skills: scored.matchedSkills,
    missing_skills: scored.missingSkills,
    found_at: new Date().toISOString(),
  };
}

export async function discoverJobs(
  userId: string,
  jobTitle: string,
  location: string,
  runId: string,
  profile: Profile,
): Promise<{ success: boolean; jobsFound: number; strongMatches: number; matchScores: number[]; insertedJobs: InsertedJob[]; error?: string }> {
  try {
    const country = detectCountry(location);
    const adzunaJobs = await searchJobs(jobTitle, location, country);

    if (adzunaJobs.length === 0) {
      return { success: true, jobsFound: 0, strongMatches: 0, matchScores: [], insertedJobs: [] };
    }

    const records: JobRecord[] = [];
    const matchScores: number[] = [];
    let strongMatches = 0;

    for (const job of adzunaJobs) {
      const scored = await scoreJob(job, profile);
      const record = buildJobRecord(job, scored, userId, runId);
      records.push(record);
      matchScores.push(scored.matchScore);
      if (scored.matchScore >= MATCH_THRESHOLD) strongMatches++;
    }

    const insforge = await createInsforgeServer();
    const { data: insertedRows, error: insertError } = await insforge.database
      .from("jobs")
      .insert(records)
      .select("id, title, company, salary, match_score, found_at");

    if (insertError || !insertedRows) {
      console.error("[agent/adzuna] insert", insertError);
      return { success: false, jobsFound: 0, strongMatches: 0, matchScores: [], insertedJobs: [], error: "Failed to save jobs" };
    }

    return {
      success: true,
      jobsFound: insertedRows.length,
      strongMatches,
      matchScores,
      insertedJobs: insertedRows as InsertedJob[],
    };
  } catch (err) {
    console.error("[agent/adzuna]", err);
    return { success: false, jobsFound: 0, strongMatches: 0, matchScores: [], insertedJobs: [], error: String(err) };
  }
}
