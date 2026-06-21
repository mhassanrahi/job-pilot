"use client";

import { useState } from "react";
import { ResumeSection } from "@/components/profile/ResumeSection";
import { ProfileForm } from "@/components/profile/ProfileForm";
import type { ProfileRow, ExtractedFields } from "@/actions/profile";

export function ProfilePageClient({
  initialData,
  resumeUrl,
}: {
  initialData: ProfileRow | null;
  resumeUrl: string | null;
}) {
  const [extractedFields, setExtractedFields] = useState<ExtractedFields | null>(null);

  return (
    <>
      <ResumeSection resumeUrl={resumeUrl} onExtracted={setExtractedFields} />
      <ProfileForm initialData={initialData} extractedFields={extractedFields} />
    </>
  );
}
