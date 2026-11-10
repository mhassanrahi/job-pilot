import type { Metadata } from "next";
import { CompletionIndicator } from "@/components/profile/CompletionIndicator";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ProfileNavbar } from "@/components/profile/ProfileNavbar";
import { ResumeUpload } from "@/components/profile/ResumeUpload";

export const metadata: Metadata = {
  title: "Profile | JobPilot",
  description: "Manage your JobPilot profile, resume, experience, and job preferences.",
};

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <ProfileNavbar />
      <main className="mx-auto flex w-full min-w-0 max-w-5xl flex-col gap-6 px-5 py-8 sm:px-8 lg:py-10">
        <CompletionIndicator />
        <ResumeUpload />
        <ProfileForm />
      </main>
    </div>
  );
}
