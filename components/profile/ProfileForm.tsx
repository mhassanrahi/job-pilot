"use client";

import { useState, useTransition } from "react";
import { X, Plus, CalendarDays, ChevronDown } from "lucide-react";
import { saveProfile } from "@/actions/profile";
import type { ProfileRow, WorkExperience } from "@/actions/profile";

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedinUrl: string;
  portfolioUrl: string;
  workAuthorization: string;
  currentTitle: string;
  experienceLevel: string;
  yearsExperience: string;
  skills: string[];
  skillInput: string;
  industries: string[];
  industryInput: string;
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

type Education = {
  highestDegree?: string;
  fieldOfStudy?: string;
  institutionName?: string;
  graduationYear?: string;
};

function dbToForm(profile: ProfileRow | null): FormState {
  if (!profile) {
    return {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      linkedinUrl: "",
      portfolioUrl: "",
      workAuthorization: "citizen",
      currentTitle: "",
      experienceLevel: "junior",
      yearsExperience: "",
      skills: [],
      skillInput: "",
      industries: [],
      industryInput: "",
      workExperience: [],
      highestDegree: "high_school",
      fieldOfStudy: "",
      institutionName: "",
      graduationYear: "",
      jobTitlesSeeking: "",
      remotePreference: "any",
      salaryExpectation: "",
      preferredLocations: "",
    };
  }

  const edu = (profile.education as Education | null) ?? {};
  return {
    fullName: profile.full_name ?? "",
    email: profile.email ?? "",
    phone: profile.phone ?? "",
    location: profile.location ?? "",
    linkedinUrl: profile.linkedin_url ?? "",
    portfolioUrl: profile.portfolio_url ?? "",
    workAuthorization: profile.work_authorization ?? "citizen",
    currentTitle: profile.current_title ?? "",
    experienceLevel: profile.experience_level ?? "junior",
    yearsExperience: profile.years_experience?.toString() ?? "",
    skills: profile.skills ?? [],
    skillInput: "",
    industries: profile.industries ?? [],
    industryInput: "",
    workExperience: (profile.work_experience ?? []).map((w, i) => ({
      ...w,
      id: w.id ?? String(i + 1),
    })),
    highestDegree: edu.highestDegree ?? "high_school",
    fieldOfStudy: edu.fieldOfStudy ?? "",
    institutionName: edu.institutionName ?? "",
    graduationYear: edu.graduationYear ?? "",
    jobTitlesSeeking: (profile.job_titles_seeking ?? []).join(", "),
    remotePreference: profile.remote_preference ?? "any",
    salaryExpectation: profile.salary_expectation ?? "",
    preferredLocations: (profile.preferred_locations ?? []).join(", "),
  };
}

const inputClass =
  "w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent";

const selectClass =
  "w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent appearance-none";

const labelClass =
  "block text-[11px] font-medium text-text-secondary uppercase tracking-wide mb-1.5";

function FieldLabel({
  children,
  optional,
}: {
  children: React.ReactNode;
  optional?: boolean;
}) {
  return (
    <label className={labelClass}>
      {children}
      {optional && (
        <span className="normal-case text-text-muted ml-1">(optional)</span>
      )}
    </label>
  );
}

function SelectWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
    </div>
  );
}

function SectionDivider() {
  return <div className="border-t border-border" />;
}

export function ProfileForm({ initialData }: { initialData: ProfileRow | null }) {
  const [form, setForm] = useState<FormState>(() => dbToForm(initialData));
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );

  const set = (key: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const addSkill = () => {
    const skill = form.skillInput.trim();
    if (!skill || form.skills.includes(skill)) return;
    setForm((prev) => ({
      ...prev,
      skills: [...prev.skills, skill],
      skillInput: "",
    }));
  };

  const removeSkill = (skill: string) =>
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));

  const addIndustry = () => {
    const industry = form.industryInput.trim();
    if (!industry || form.industries.includes(industry)) return;
    setForm((prev) => ({
      ...prev,
      industries: [...prev.industries, industry],
      industryInput: "",
    }));
  };

  const removeIndustry = (industry: string) =>
    setForm((prev) => ({
      ...prev,
      industries: prev.industries.filter((i) => i !== industry),
    }));

  const addWorkExp = () => {
    if (form.workExperience.length >= 3) return;
    setForm((prev) => ({
      ...prev,
      workExperience: [
        ...prev.workExperience,
        {
          id: Date.now().toString(),
          company: "",
          jobTitle: "",
          startDate: "",
          endDate: "",
          currentlyWorking: false,
          responsibilities: "",
        },
      ],
    }));
  };

  const updateWorkExp = (id: string, fields: Partial<WorkExperience>) =>
    setForm((prev) => ({
      ...prev,
      workExperience: prev.workExperience.map((w) =>
        w.id === id ? { ...w, ...fields } : w,
      ),
    }));

  const removeWorkExp = (id: string) =>
    setForm((prev) => ({
      ...prev,
      workExperience: prev.workExperience.filter((w) => w.id !== id),
    }));

  function handleSave() {
    startTransition(async () => {
      setStatus("saving");
      const result = await saveProfile({
        fullName: form.fullName,
        phone: form.phone,
        location: form.location,
        linkedinUrl: form.linkedinUrl,
        portfolioUrl: form.portfolioUrl,
        workAuthorization: form.workAuthorization,
        currentTitle: form.currentTitle,
        experienceLevel: form.experienceLevel,
        yearsExperience: form.yearsExperience,
        skills: form.skills,
        industries: form.industries,
        workExperience: form.workExperience,
        highestDegree: form.highestDegree,
        fieldOfStudy: form.fieldOfStudy,
        institutionName: form.institutionName,
        graduationYear: form.graduationYear,
        jobTitlesSeeking: form.jobTitlesSeeking,
        remotePreference: form.remotePreference,
        salaryExpectation: form.salaryExpectation,
        preferredLocations: form.preferredLocations,
      });
      if (result.success) {
        setStatus("saved");
        setTimeout(() => setStatus("idle"), 2000);
      } else {
        setStatus("error");
      }
    });
  }

  const saveLabel =
    status === "saving"
      ? "Saving…"
      : status === "saved"
        ? "Saved!"
        : status === "error"
          ? "Failed — try again"
          : "Save Profile";

  return (
    <div className="bg-surface rounded-2xl border border-border shadow-[0px_1px_3px_rgba(0,0,0,0.1),_0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      {/* Card header */}
      <div className="px-6 py-5 border-b border-border">
        <h2 className="text-base font-semibold text-text-primary">
          Profile Information
        </h2>
        <p className="text-sm text-text-secondary mt-1">
          This context is used to accurately represent you in agent interactions.
        </p>
      </div>

      <div className="p-6 flex flex-col gap-8">
        {/* ── Personal Info ── */}
        <section>
          <h3 className="text-sm font-semibold text-text-dark mb-4">
            Personal Info
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel>Full Name</FieldLabel>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => set("fullName", e.target.value)}
                placeholder="Your full name"
                className={inputClass}
              />
            </div>
            <div>
              <FieldLabel>Email</FieldLabel>
              <input
                type="email"
                value={form.email}
                readOnly
                className={`${inputClass} opacity-60 cursor-not-allowed`}
              />
            </div>
            <div>
              <FieldLabel>Phone Number</FieldLabel>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="(555) 000-0000"
                className={inputClass}
              />
            </div>
            <div>
              <FieldLabel>Location</FieldLabel>
              <input
                type="text"
                value={form.location}
                onChange={(e) => set("location", e.target.value)}
                placeholder="City, Country"
                className={inputClass}
              />
            </div>
            <div>
              <FieldLabel>LinkedIn URL</FieldLabel>
              <input
                type="url"
                value={form.linkedinUrl}
                onChange={(e) => set("linkedinUrl", e.target.value)}
                placeholder="https://linkedin.com/in/..."
                className={inputClass}
              />
            </div>
            <div>
              <FieldLabel>Portfolio / GitHub</FieldLabel>
              <input
                type="url"
                value={form.portfolioUrl}
                onChange={(e) => set("portfolioUrl", e.target.value)}
                placeholder="https://github.com/..."
                className={inputClass}
              />
            </div>
            <div>
              <FieldLabel>Work Authorization</FieldLabel>
              <SelectWrapper>
                <select
                  value={form.workAuthorization}
                  onChange={(e) => set("workAuthorization", e.target.value)}
                  className={selectClass}
                >
                  <option value="citizen">Citizen</option>
                  <option value="permanent_resident">Permanent Resident</option>
                  <option value="visa_required">Visa Required</option>
                </select>
              </SelectWrapper>
            </div>
          </div>
        </section>

        <SectionDivider />

        {/* ── Professional Info ── */}
        <section>
          <h3 className="text-sm font-semibold text-text-dark mb-4">
            Professional Info
          </h3>
          <div className="flex flex-col gap-4">
            <div>
              <FieldLabel>Current / Recent Job Title</FieldLabel>
              <input
                type="text"
                value={form.currentTitle}
                onChange={(e) => set("currentTitle", e.target.value)}
                placeholder="e.g. Frontend Engineer"
                className={inputClass}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel>Experience Level</FieldLabel>
                <SelectWrapper>
                  <select
                    value={form.experienceLevel}
                    onChange={(e) => set("experienceLevel", e.target.value)}
                    className={selectClass}
                  >
                    <option value="junior">Junior</option>
                    <option value="mid">Mid</option>
                    <option value="senior">Senior</option>
                    <option value="lead">Lead</option>
                  </select>
                </SelectWrapper>
              </div>
              <div>
                <FieldLabel>Years of Experience</FieldLabel>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={form.yearsExperience}
                  onChange={(e) => set("yearsExperience", e.target.value)}
                  placeholder="e.g. 4"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Skills */}
            <div>
              <FieldLabel>Skills</FieldLabel>
              <div className="border border-border rounded-md p-3 bg-surface min-h-[52px] focus-within:ring-1 focus-within:ring-accent focus-within:border-accent">
                {form.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {form.skills.map((skill) => (
                      <span
                        key={skill}
                        className="flex items-center gap-1 bg-surface-secondary border border-border rounded-full px-2.5 py-1 text-xs font-medium text-text-dark"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          aria-label={`Remove skill ${skill}`}
                          className="text-text-muted hover:text-text-secondary transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={form.skillInput}
                    onChange={(e) => set("skillInput", e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addSkill())
                    }
                    placeholder="Add a skill"
                    className="flex-1 text-sm text-text-primary placeholder:text-text-muted outline-none bg-transparent"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="flex items-center gap-1 text-sm font-medium text-accent hover:text-accent-dark transition-colors px-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Industries */}
            <div>
              <FieldLabel optional>Industries</FieldLabel>
              <div className="border border-border rounded-md p-3 bg-surface min-h-[52px] focus-within:ring-1 focus-within:ring-accent focus-within:border-accent">
                {form.industries.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {form.industries.map((industry) => (
                      <span
                        key={industry}
                        className="flex items-center gap-1 bg-surface-secondary border border-border rounded-full px-2.5 py-1 text-xs font-medium text-text-dark"
                      >
                        {industry}
                        <button
                          type="button"
                          onClick={() => removeIndustry(industry)}
                          aria-label={`Remove industry ${industry}`}
                          className="text-text-muted hover:text-text-secondary transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={form.industryInput}
                    onChange={(e) => set("industryInput", e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addIndustry())
                    }
                    placeholder="E.g. FinTech, Healthcare"
                    className="flex-1 text-sm text-text-primary placeholder:text-text-muted outline-none bg-transparent"
                  />
                  <button
                    type="button"
                    onClick={addIndustry}
                    className="flex items-center gap-1 text-sm font-medium text-accent hover:text-accent-dark transition-colors px-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <SectionDivider />

        {/* ── Work Experience ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-text-dark">
              Work Experience
            </h3>
            {form.workExperience.length < 3 && (
              <button
                type="button"
                onClick={addWorkExp}
                className="flex items-center gap-1 text-sm font-medium text-accent hover:text-accent-dark transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add role
              </button>
            )}
          </div>

          <div className="flex flex-col gap-6">
            {form.workExperience.map((exp, index) => (
              <div key={exp.id} className="flex flex-col gap-4">
                {index > 0 && <div className="border-t border-border-light" />}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-muted font-medium">
                    Role {index + 1}
                  </span>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeWorkExp(exp.id)}
                      className="text-xs text-text-muted hover:text-error transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <FieldLabel>Company Name</FieldLabel>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) =>
                        updateWorkExp(exp.id, { company: e.target.value })
                      }
                      placeholder="Company name"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <FieldLabel>Job Title</FieldLabel>
                    <input
                      type="text"
                      value={exp.jobTitle}
                      onChange={(e) =>
                        updateWorkExp(exp.id, { jobTitle: e.target.value })
                      }
                      placeholder="Your job title"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 items-end">
                  <div>
                    <FieldLabel>Start Date</FieldLabel>
                    <div className="relative">
                      <input
                        type="text"
                        value={exp.startDate}
                        onChange={(e) =>
                          updateWorkExp(exp.id, { startDate: e.target.value })
                        }
                        placeholder="January 2022"
                        className={`${inputClass} pr-9`}
                      />
                      <CalendarDays className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <FieldLabel>End Date</FieldLabel>
                    <div className="relative">
                      <input
                        type="text"
                        value={exp.endDate}
                        onChange={(e) =>
                          updateWorkExp(exp.id, { endDate: e.target.value })
                        }
                        placeholder="Present"
                        disabled={exp.currentlyWorking}
                        className={`${inputClass} pr-9 ${exp.currentlyWorking ? "opacity-50 cursor-not-allowed" : ""}`}
                      />
                      <CalendarDays className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pb-2">
                    <input
                      type="checkbox"
                      id={`currently-working-${exp.id}`}
                      checked={exp.currentlyWorking}
                      onChange={(e) =>
                        updateWorkExp(exp.id, {
                          currentlyWorking: e.target.checked,
                          endDate: e.target.checked ? "" : exp.endDate,
                        })
                      }
                      className="w-4 h-4 rounded border-border accent-accent"
                    />
                    <label
                      htmlFor={`currently-working-${exp.id}`}
                      className="text-xs text-text-secondary cursor-pointer select-none"
                    >
                      Currently working here
                    </label>
                  </div>
                </div>

                <div>
                  <FieldLabel>Key Responsibilities</FieldLabel>
                  <textarea
                    value={exp.responsibilities}
                    onChange={(e) =>
                      updateWorkExp(exp.id, {
                        responsibilities: e.target.value,
                      })
                    }
                    placeholder="Describe your key responsibilities..."
                    rows={3}
                    className={`${inputClass} resize-none`}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <SectionDivider />

        {/* ── Education ── */}
        <section>
          <h3 className="text-sm font-semibold text-text-dark mb-4">
            Education
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel>Highest Degree</FieldLabel>
              <SelectWrapper>
                <select
                  value={form.highestDegree}
                  onChange={(e) => set("highestDegree", e.target.value)}
                  className={selectClass}
                >
                  <option value="high_school">High School</option>
                  <option value="associate">Associate</option>
                  <option value="bachelor">Bachelor&apos;s</option>
                  <option value="master">Master&apos;s</option>
                  <option value="phd">PhD</option>
                  <option value="bootcamp">Bootcamp</option>
                  <option value="other">Other</option>
                </select>
              </SelectWrapper>
            </div>
            <div>
              <FieldLabel>Field of Study</FieldLabel>
              <input
                type="text"
                value={form.fieldOfStudy}
                onChange={(e) => set("fieldOfStudy", e.target.value)}
                placeholder="e.g. Computer Science"
                className={inputClass}
              />
            </div>
            <div>
              <FieldLabel>Institution Name</FieldLabel>
              <input
                type="text"
                value={form.institutionName}
                onChange={(e) => set("institutionName", e.target.value)}
                placeholder="E.g. State University"
                className={inputClass}
              />
            </div>
            <div>
              <FieldLabel>Graduation Year</FieldLabel>
              <input
                type="text"
                value={form.graduationYear}
                onChange={(e) => set("graduationYear", e.target.value)}
                placeholder="YYYY"
                className={inputClass}
              />
            </div>
          </div>
        </section>

        <SectionDivider />

        {/* ── Job Preferences ── */}
        <section>
          <h3 className="text-sm font-semibold text-text-dark mb-4">
            Job Preferences
          </h3>
          <div className="flex flex-col gap-4">
            <div>
              <FieldLabel>Job Titles Seeking</FieldLabel>
              <input
                type="text"
                value={form.jobTitlesSeeking}
                onChange={(e) => set("jobTitlesSeeking", e.target.value)}
                placeholder="e.g. Frontend Engineer, React Developer"
                className={inputClass}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel>Remote Preference</FieldLabel>
                <SelectWrapper>
                  <select
                    value={form.remotePreference}
                    onChange={(e) => set("remotePreference", e.target.value)}
                    className={selectClass}
                  >
                    <option value="any">Any</option>
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="onsite">Onsite</option>
                  </select>
                </SelectWrapper>
              </div>
              <div>
                <FieldLabel optional>Salary Expectation</FieldLabel>
                <input
                  type="text"
                  value={form.salaryExpectation}
                  onChange={(e) => set("salaryExpectation", e.target.value)}
                  placeholder="E.g. $120k+"
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <FieldLabel optional>Preferred Locations</FieldLabel>
              <input
                type="text"
                value={form.preferredLocations}
                onChange={(e) => set("preferredLocations", e.target.value)}
                placeholder="E.g. New York, London"
                className={inputClass}
              />
            </div>
          </div>
        </section>

        {/* Save button */}
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className={`w-full text-sm font-medium py-3 rounded-md transition-colors disabled:cursor-not-allowed ${status === "saved"
              ? "bg-success text-success-foreground"
              : status === "error"
                ? "bg-error text-error-foreground hover:bg-error/90"
                : "bg-accent text-accent-foreground hover:bg-accent-dark disabled:opacity-70"
            }`}
        >
          {saveLabel}
        </button>
      </div>
    </div>
  );
}
