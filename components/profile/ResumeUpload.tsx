"use client";

import { useRef, useState, type ChangeEvent, type DragEvent } from "react";

export function ResumeUpload() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  function acceptFile(file: File | undefined): void {
    if (file?.type === "application/pdf") {
      setFileName(file.name);
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>): void {
    acceptFile(event.target.files?.[0]);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>): void {
    event.preventDefault();
    setIsDragging(false);
    acceptFile(event.dataTransfer.files[0]);
  }

  return (
    <section className="w-full min-w-0 rounded-xl border border-border bg-surface p-6 shadow-sm sm:p-8" aria-labelledby="resume-heading">
      <h2 id="resume-heading" className="text-base font-semibold text-text-primary">Resume</h2>
      <p className="mt-1 text-sm text-text-secondary">
        Upload an existing resume to auto-fill the profile, or generate a new tailored one from your details below.
      </p>
      <input ref={inputRef} className="sr-only" type="file" accept="application/pdf,.pdf" onChange={handleFileChange} />
      <div
        className={`mt-6 flex min-h-56 flex-col items-center justify-center rounded-lg border border-dashed px-5 py-8 text-center transition-colors ${isDragging ? "border-accent bg-accent-muted" : "border-border-muted bg-surface-secondary"}`}
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <div className="flex size-12 items-center justify-center rounded-full border border-border bg-surface text-accent shadow-sm">
          <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M12 16V4" />
            <path d="m7 9 5-5 5 5" />
            <path d="M5 15a4 4 0 0 0 1 7h12a4 4 0 0 0 1-7" />
          </svg>
        </div>
        <p className="mt-4 text-sm font-semibold text-text-primary">
          {fileName ?? "Click to upload or drag and drop"}
        </p>
        <p className="mt-1 text-xs text-text-secondary">PDF formatting only. Maximum file size 5MB.</p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-5 rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary shadow-sm transition-colors hover:bg-surface-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          Select Resume
        </button>
      </div>
      <div className="mt-6 flex flex-col gap-4 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-text-secondary">Need a fresh document based on the fields below?</p>
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M6 2h8l4 4v16H6z" />
            <path d="M14 2v5h5" />
            <path d="M9 13h6M9 17h6" />
          </svg>
          Generate Resume from Profile
        </button>
      </div>
    </section>
  );
}
