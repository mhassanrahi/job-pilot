import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { CompletionBanner } from "@/components/profile/CompletionBanner";
import { ResumeSection } from "@/components/profile/ResumeSection";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { createInsforgeServer } from "@/lib/insforge-server";
import type { ProfileRow } from "@/actions/profile";

type Education = { institutionName?: string };

function computeCompletion(profile: ProfileRow | null): {
  missingFields: string[];
  completionPct: number;
} {
  const checks = [
    { label: "NAME", filled: !!profile?.full_name?.trim() },
    { label: "PHONE", filled: !!profile?.phone?.trim() },
    { label: "LOCATION", filled: !!profile?.location?.trim() },
    { label: "TITLE", filled: !!profile?.current_title?.trim() },
    { label: "SKILLS", filled: (profile?.skills ?? []).length > 0 },
    {
      label: "EDUCATION",
      filled: !!(profile?.education as Education | null)?.institutionName?.trim(),
    },
  ];

  const missingFields = checks.filter((c) => !c.filled).map((c) => c.label);
  const completionPct = Math.round(((6 - missingFields.length) / 6) * 100);
  return { missingFields, completionPct };
}

export default async function ProfilePage() {
  const insforge = await createInsforgeServer();
  const {
    data: { user },
  } = await insforge.auth.getCurrentUser();
  if (!user) redirect("/login");

  const { data: profile, error } = await insforge.database
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("[ProfilePage]", error);
    throw new Error("Failed to load profile");
  }

  const typedProfile = profile as ProfileRow | null;
  const { missingFields, completionPct } = computeCompletion(typedProfile);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-8 py-8">
        <div className="max-w-[760px] mx-auto flex flex-col gap-6">
          <CompletionBanner
            missingFields={missingFields}
            completionPct={completionPct}
          />
          <ResumeSection resumeUrl={typedProfile?.resume_pdf_url ?? null} />
          <ProfileForm initialData={typedProfile} />
        </div>
      </main>
    </div>
  );
}
