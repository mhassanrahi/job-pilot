import { NextRequest, NextResponse } from "next/server";
import { createInsforgeServer } from "@/lib/insforge-server";
import { getPostHogClient } from "@/lib/posthog-server";
import { discoverJobs } from "@/agent/adzuna";
import type { Profile } from "@/agent/types";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { jobTitle?: string; location?: string };
    const jobTitle = body.jobTitle?.trim() ?? "";
    const location = body.location?.trim() ?? "";

    if (!jobTitle) {
      return NextResponse.json(
        { success: false, error: "Job title is required" },
        { status: 400 },
      );
    }

    const insforge = await createInsforgeServer();
    const {
      data: { user },
      error: authError,
    } = await insforge.auth.getCurrentUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { data: profileData, error: profileError } = await insforge.database
      .from("profiles")
      .select(
        "id, full_name, current_title, experience_level, years_experience, skills, industries, work_experience, education, job_titles_seeking",
      )
      .eq("id", user.id)
      .single();

    if (profileError || !profileData) {
      return NextResponse.json(
        { success: false, error: "Profile not found" },
        { status: 404 },
      );
    }

    const profile = profileData as Profile;

    const posthog = getPostHogClient();
    posthog.capture({
      distinctId: user.id,
      event: "job_search_started",
      properties: { userId: user.id, jobTitle, location },
    });

    const { data: runData, error: runError } = await insforge.database
      .from("agent_runs")
      .insert([{
        user_id: user.id,
        status: "running",
        job_title_searched: jobTitle,
        location_searched: location,
        jobs_found: 0,
        started_at: new Date().toISOString(),
      }])
      .select("id")
      .single();

    if (runError || !runData) {
      console.error("[agent/find] create run", runError);
      return NextResponse.json(
        { success: false, error: "Failed to start agent run" },
        { status: 500 },
      );
    }

    const runId = (runData as { id: string }).id;

    const result = await discoverJobs(user.id, jobTitle, location, runId, profile);

    if (!result.success) {
      await insforge.database
        .from("agent_runs")
        .update({ status: "failed", completed_at: new Date().toISOString() })
        .eq("id", runId);

      return NextResponse.json(
        { success: false, error: result.error ?? "Job discovery failed" },
        { status: 500 },
      );
    }

    await insforge.database
      .from("agent_runs")
      .update({
        status: "completed",
        jobs_found: result.jobsFound,
        completed_at: new Date().toISOString(),
      })
      .eq("id", runId);

    for (const matchScore of result.matchScores) {
      posthog.capture({
        distinctId: user.id,
        event: "job_found",
        properties: { userId: user.id, source: "search", matchScore },
      });
    }

    function formatFoundAt(iso: string): string {
      const diffH = Math.floor((Date.now() - new Date(iso).getTime()) / 3_600_000);
      if (diffH < 1) return "Just now";
      if (diffH < 24) return `${diffH}h ago`;
      const diffD = Math.floor(diffH / 24);
      return diffD === 1 ? "Yesterday" : `${diffD} days ago`;
    }

    const jobs = result.insertedJobs.map((j) => ({
      id: j.id,
      company: j.company,
      role: j.title,
      matchScore: j.match_score,
      salary: j.salary ?? "—",
      dateFound: formatFoundAt(j.found_at),
    }));

    return NextResponse.json({
      success: true,
      data: {
        jobsFound: result.jobsFound,
        strongMatches: result.strongMatches,
        jobs,
      },
    });
  } catch (error) {
    console.error("[agent/find]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
