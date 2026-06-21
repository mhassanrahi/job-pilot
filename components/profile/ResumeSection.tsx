"use client";

import { useRef, useTransition, useState } from "react";
import { UploadCloud, FileText, Sparkles } from "lucide-react";
import { uploadResume, getResumeSignedUrl } from "@/actions/profile";
import type { ExtractedFields } from "@/actions/profile";

type Phase = "idle" | "uploading" | "extracting" | "complete" | "error";

type Props = {
  resumeUrl: string | null;
  onExtracted: (fields: ExtractedFields) => void;
};

export function ResumeSection({ resumeUrl, onExtracted }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [phase, setPhase] = useState<Phase>("idle");
  const [fileName, setFileName] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isViewingResume, setIsViewingResume] = useState(false);
  const [hasResume, setHasResume] = useState(!!resumeUrl);

  async function handleViewResume() {
    setIsViewingResume(true);
    const result = await getResumeSignedUrl();
    setIsViewingResume(false);
    if (result.url) {
      window.open(result.url, "_blank", "noopener,noreferrer");
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setPhase("error");
      setErrorMsg("File exceeds 5 MB limit");
      e.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);
    setFileName(file.name);
    setErrorMsg(null);

    startTransition(async () => {
      setPhase("uploading");
      const uploadResult = await uploadResume(formData);

      if (!uploadResult.success) {
        setPhase("error");
        setErrorMsg(uploadResult.error ?? "Upload failed");
        return;
      }

      setHasResume(true);

      setPhase("extracting");

      try {
        const res = await fetch("/api/resume/extract", { method: "POST" });
        const json = (await res.json()) as {
          success: boolean;
          data?: ExtractedFields;
          error?: string;
        };

        if (json.success && json.data) {
          onExtracted(json.data);
        }
      } catch {
        // Extraction failure is non-fatal — upload succeeded
      }

      setPhase("complete");
    });

    e.target.value = "";
  }

  const statusText = (() => {
    if (phase === "uploading") return "Uploading…";
    if (phase === "extracting") return "Extracting profile data…";
    if (phase === "complete") return (fileName ?? "Resume") + " ✓";
    if (phase === "error") return errorMsg ?? "Upload failed";
    if (resumeUrl) return "Resume on file — upload to replace";
    return "Click to upload or drag and drop";
  })();

  const showViewLink =
    hasResume && phase !== "uploading" && phase !== "extracting";

  return (
    <div className="bg-surface rounded-2xl border border-border shadow-[0px_1px_3px_rgba(0,0,0,0.1),_0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <div className="px-6 py-5 border-b border-border">
        <h2 className="text-base font-semibold text-text-primary">Resume</h2>
        <p className="text-sm text-text-secondary mt-1">
          Upload an existing resume to auto-fill the profile, or generate a new
          tailored one from your details below.
        </p>
      </div>

      <div className="p-6 flex flex-col gap-4">
        <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center gap-3 bg-surface-secondary">
          <UploadCloud className="w-8 h-8 text-text-muted" />
          <div className="text-center">
            <p className="text-sm font-medium text-text-primary">{statusText}</p>
            <p className="text-xs text-text-muted mt-1">
              PDF formatting only. Maximum file size 5MB.
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            disabled={isPending}
            onClick={() => fileInputRef.current?.click()}
            className="bg-surface border border-border text-text-primary text-sm font-medium px-4 py-2 rounded-md hover:bg-surface-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Processing…" : "Select Resume"}
          </button>
        </div>

        {showViewLink && (
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <FileText className="w-4 h-4 shrink-0 text-accent" />
            <button
              type="button"
              disabled={isViewingResume}
              onClick={handleViewResume}
              className="text-accent hover:text-accent-dark transition-colors underline underline-offset-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isViewingResume ? "Opening…" : "View current resume"}
            </button>
          </div>
        )}

        <div className="flex items-center justify-between">
          <p className="text-sm text-text-secondary">
            Need a fresh document based on the fields below?
          </p>
          <button
            type="button"
            className="flex items-center gap-2 bg-accent text-accent-foreground text-sm font-medium px-4 py-2 rounded-md hover:bg-accent-dark transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Generate Resume from Profile
          </button>
        </div>
      </div>
    </div>
  );
}
