"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createInsforgeServer } from "@/lib/insforge-server";
import { getPostHogClient } from "@/lib/posthog-server";

export type WorkExperience = {
  id: string;
  company: string;
  jobTitle: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  responsibilities: string;
};

export type Education = {
  highestDegree: string;
  fieldOfStudy: string;
  institutionName: string;
  graduationYear: string;
};

export type ProfileRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
  work_authorization: string | null;
  current_title: string | null;
  experience_level: string | null;
  years_experience: number | null;
  skills: string[] | null;
  industries: string[] | null;
  work_experience: WorkExperience[] | null;
  education: Education | null;
  job_titles_seeking: string[] | null;
  remote_preference: string | null;
  preferred_locations: string[] | null;
  salary_expectation: string | null;
  cover_letter_tone: string | null;
  resume_pdf_url: string | null;
  is_complete: boolean;
  created_at: string;
  updated_at: string;
};

export type ProfileFormData = {
  fullName: string;
  phone: string;
  location: string;
  linkedinUrl: string;
  portfolioUrl: string;
  workAuthorization: string;
  currentTitle: string;
  experienceLevel: string;
  yearsExperience: string;
  skills: string[];
  industries: string[];
  workExperience: WorkExperience[];
  highestDegree: string;
  fieldOfStudy: string;
  institutionName: string;
  graduationYear: string;
  jobTitlesSeeking: string;
  remotePreference: string;
  salaryExpectation: string;
  preferredLocations: string;
};

function computeIsComplete(form: ProfileFormData): boolean {
  return !!(
    form.fullName.trim() &&
    form.phone.trim() &&
    form.location.trim() &&
    form.currentTitle.trim() &&
    form.skills.length > 0 &&
    form.institutionName.trim()
  );
}

export async function saveProfile(
  form: ProfileFormData,
): Promise<{ success: boolean; error?: string }> {
  const insforge = await createInsforgeServer();
  const {
    data: { user },
    error: authError,
  } = await insforge.auth.getCurrentUser();
  if (authError) throw new Error(authError.message);
  if (!user) redirect("/login");

  try {
    const is_complete = computeIsComplete(form);

    const { error } = await insforge.database
      .from("profiles")
      .update({
        full_name: form.fullName,
        phone: form.phone,
        location: form.location,
        linkedin_url: form.linkedinUrl,
        portfolio_url: form.portfolioUrl,
        work_authorization: form.workAuthorization,
        current_title: form.currentTitle,
        experience_level: form.experienceLevel,
        years_experience: parseInt(form.yearsExperience) || 0,
        skills: form.skills,
        industries: form.industries,
        work_experience: form.workExperience,
        education: {
          highestDegree: form.highestDegree,
          fieldOfStudy: form.fieldOfStudy,
          institutionName: form.institutionName,
          graduationYear: form.graduationYear,
        },
        job_titles_seeking: form.jobTitlesSeeking
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        remote_preference: form.remotePreference,
        salary_expectation: form.salaryExpectation,
        preferred_locations: form.preferredLocations
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        is_complete,
      })
      .eq("id", user.id);

    if (error) {
      console.error("[saveProfile]", error);
      return { success: false, error: "Failed to save profile" };
    }

    revalidatePath("/profile");

    const posthog = getPostHogClient();
    posthog.capture({
      distinctId: user.id,
      event: "profile_saved",
      properties: { is_complete },
    });

    return { success: true };
  } catch (err) {
    console.error("[saveProfile]", err);
    return { success: false, error: "Failed to save profile" };
  }
}

export async function uploadResume(
  formData: FormData,
): Promise<{ success: boolean; url?: string; error?: string }> {
  const insforge = await createInsforgeServer();
  const {
    data: { user },
    error: authError,
  } = await insforge.auth.getCurrentUser();
  if (authError) throw new Error(authError.message);
  if (!user) redirect("/login");

  try {
    const file = formData.get("resume") as File | null;
    if (!file || !(file instanceof File)) {
      return { success: false, error: "No file provided" };
    }
    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: "File exceeds 5 MB limit" };
    }

    const { data: uploadData, error: uploadError } = await insforge.storage
      .from("resumes")
      .upload(`${user.id}/resume.pdf`, file);

    if (uploadError || !uploadData) {
      console.error("[uploadResume] storage", uploadError);
      return { success: false, error: "Failed to upload resume" };
    }

    const url = uploadData.url;

    const { error: dbError } = await insforge.database
      .from("profiles")
      .update({ resume_pdf_url: url })
      .eq("id", user.id);

    if (dbError) {
      console.error("[uploadResume] db", dbError);
      return { success: false, error: "Failed to save resume URL" };
    }

    revalidatePath("/profile");

    const posthog = getPostHogClient();
    posthog.capture({ distinctId: user.id, event: "resume_uploaded" });

    return { success: true, url };
  } catch (err) {
    console.error("[uploadResume]", err);
    return { success: false, error: "Failed to upload resume" };
  }
}
