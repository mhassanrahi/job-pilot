"use client";

import { useState, type FormEvent } from "react";

type WorkRole = {
  id: number;
  company: string;
  title: string;
  startDate: string;
  endDate: string;
  current: boolean;
  responsibilities: string;
};

const initialRole: WorkRole = {
  id: 1,
  company: "Vercel",
  title: "Frontend Engineer",
  startDate: "2022-01",
  endDate: "",
  current: true,
  responsibilities: "Built Next.js features and optimized web vitals. Led a team of 3 developers.",
};

const fieldClass = "min-h-11 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary shadow-sm outline-none placeholder:text-text-muted focus:border-accent focus:ring-1 focus:ring-accent disabled:bg-surface-secondary disabled:text-text-secondary";
const labelClass = "mb-2 block text-xs font-semibold uppercase tracking-wide text-text-secondary";

export function ProfileForm() {
  const [skills, setSkills] = useState(["React", "TypeScript", "Next.js", "Tailwind CSS"]);
  const [industries, setIndustries] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [industryInput, setIndustryInput] = useState("");
  const [roles, setRoles] = useState<WorkRole[]>([initialRole]);

  function addTag(value: string, tags: string[], setTags: (tags: string[]) => void, clear: () => void): void {
    const nextValue = value.trim();
    if (nextValue && !tags.some((tag) => tag.toLowerCase() === nextValue.toLowerCase())) {
      setTags([...tags, nextValue]);
    }
    clear();
  }

  function updateRole(id: number, field: keyof WorkRole, value: string | boolean): void {
    setRoles((currentRoles) => currentRoles.map((role) => (role.id === id ? { ...role, [field]: value } : role)));
  }

  function addRole(): void {
    if (roles.length >= 3) return;
    const id = Math.max(...roles.map((role) => role.id), 0) + 1;
    setRoles([...roles, { id, company: "", title: "", startDate: "", endDate: "", current: false, responsibilities: "" }]);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
  }

  return (
    <section className="w-full min-w-0 rounded-xl border border-border bg-surface p-6 shadow-sm sm:p-8" aria-labelledby="profile-information-heading">
      <div className="border-b border-border pb-5">
        <h2 id="profile-information-heading" className="text-xl font-semibold text-text-primary">Profile Information</h2>
        <p className="mt-1 text-sm text-text-secondary">This context is used to accurately represent you in agent interactions.</p>
      </div>

      <form className="mt-7" onSubmit={handleSubmit}>
        <fieldset>
          <legend className="text-base font-semibold text-text-primary">Personal Info</legend>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <label><span className={labelClass}>Full Name</span><input className={fieldClass} name="fullName" defaultValue="Faizan Ali" /></label>
            <label><span className={labelClass}>Email</span><input className={fieldClass} name="email" type="email" defaultValue="faizan@jsmastery.pro" disabled /></label>
            <label><span className={labelClass}>Phone Number</span><input className={fieldClass} name="phone" type="tel" placeholder="+1 (555) 000-0000" /></label>
            <label><span className={labelClass}>Location</span><input className={fieldClass} name="location" placeholder="City, Country" /></label>
            <label><span className={labelClass}>LinkedIn URL</span><input className={fieldClass} name="linkedin" type="url" defaultValue="https://linkedin.com/in/faizan" /></label>
            <label><span className={labelClass}>Portfolio / GitHub</span><input className={fieldClass} name="portfolio" type="url" defaultValue="https://github.com/jsmastery" /></label>
            <label><span className={labelClass}>Work Authorization</span><select className={fieldClass} name="workAuthorization" defaultValue="citizen"><option value="citizen">Citizen</option><option value="permanent-resident">Permanent Resident</option><option value="visa">Visa Holder</option><option value="sponsorship">Requires Sponsorship</option></select></label>
          </div>
        </fieldset>

        <fieldset className="mt-10 border-t border-border pt-8">
          <legend className="text-base font-semibold text-text-primary">Professional Info</legend>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <label className="md:col-span-2"><span className={labelClass}>Current/Recent Job Title</span><input className={fieldClass} name="currentTitle" defaultValue="Frontend Engineer" /></label>
            <label><span className={labelClass}>Experience Level</span><select className={fieldClass} name="experienceLevel" defaultValue="junior"><option value="junior">Junior</option><option value="mid">Mid-level</option><option value="senior">Senior</option><option value="lead">Lead</option></select></label>
            <label><span className={labelClass}>Years of Experience</span><input className={fieldClass} name="yearsExperience" type="number" min="0" max="60" defaultValue="4" /></label>
            <div className="md:col-span-2">
              <label htmlFor="skills" className={labelClass}>Skills</label>
              <div className="flex gap-2">
                <input id="skills" className={fieldClass} value={skillInput} onChange={(event) => setSkillInput(event.target.value)} placeholder="Add a skill" onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addTag(skillInput, skills, setSkills, () => setSkillInput("")); } }} />
                <button type="button" onClick={() => addTag(skillInput, skills, setSkills, () => setSkillInput(""))} className="rounded-md bg-surface-secondary px-4 text-sm font-medium text-text-dark transition-colors hover:bg-border">Add</button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {skills.map((skill) => <button key={skill} type="button" onClick={() => setSkills(skills.filter((item) => item !== skill))} className="rounded-md bg-surface-tertiary px-3 py-1.5 text-xs font-medium text-text-primary transition-colors hover:bg-border" aria-label={`Remove ${skill}`}>{skill} <span className="text-text-muted" aria-hidden="true">×</span></button>)}
              </div>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="industries" className={labelClass}>Industries Worked In (Optional)</label>
              <div className="flex gap-2">
                <input id="industries" className={fieldClass} value={industryInput} onChange={(event) => setIndustryInput(event.target.value)} placeholder="E.g. FinTech, Healthcare" onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addTag(industryInput, industries, setIndustries, () => setIndustryInput("")); } }} />
                <button type="button" onClick={() => addTag(industryInput, industries, setIndustries, () => setIndustryInput(""))} className="rounded-md bg-surface-secondary px-4 text-sm font-medium text-text-dark transition-colors hover:bg-border">Add</button>
              </div>
              {industries.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{industries.map((industry) => <button key={industry} type="button" onClick={() => setIndustries(industries.filter((item) => item !== industry))} className="rounded-md bg-surface-tertiary px-3 py-1.5 text-xs font-medium text-text-primary hover:bg-border">{industry} <span className="text-text-muted" aria-hidden="true">×</span></button>)}</div>}
            </div>
          </div>
        </fieldset>

        <fieldset className="mt-10 border-t border-border pt-8">
          <div className="flex items-center justify-between gap-4">
            <legend className="text-base font-semibold text-text-primary">Work Experience</legend>
            <button type="button" onClick={addRole} disabled={roles.length >= 3} className="text-sm font-medium text-accent transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40">+&nbsp; Add role</button>
          </div>
          <div className="mt-6 space-y-5">
            {roles.map((role, index) => (
              <div key={role.id} className="rounded-lg border border-border bg-surface-secondary p-5 sm:p-6">
                {roles.length > 1 && <div className="mb-5 flex items-center justify-between"><p className="text-sm font-semibold text-text-primary">Role {index + 1}</p><button type="button" onClick={() => setRoles(roles.filter((item) => item.id !== role.id))} className="text-xs font-medium text-error hover:opacity-80">Remove</button></div>}
                <div className="grid gap-5 md:grid-cols-2">
                  <label><span className={labelClass}>Company Name</span><input className={fieldClass} value={role.company} onChange={(event) => updateRole(role.id, "company", event.target.value)} /></label>
                  <label><span className={labelClass}>Job Title</span><input className={fieldClass} value={role.title} onChange={(event) => updateRole(role.id, "title", event.target.value)} /></label>
                  <label><span className={labelClass}>Start Date</span><input className={fieldClass} type="month" value={role.startDate} onChange={(event) => updateRole(role.id, "startDate", event.target.value)} /></label>
                  <div>
                    <div className="mb-2 flex min-h-4 items-center justify-between gap-3">
                      <label htmlFor={`end-date-${role.id}`} className="text-xs font-semibold uppercase tracking-wide text-text-secondary">End Date</label>
                      <label className="inline-flex items-center gap-2 text-xs text-text-dark"><input type="checkbox" checked={role.current} onChange={(event) => updateRole(role.id, "current", event.target.checked)} className="size-4 accent-accent" />Currently working here</label>
                    </div>
                    <input id={`end-date-${role.id}`} className={fieldClass} type="month" value={role.endDate} disabled={role.current} onChange={(event) => updateRole(role.id, "endDate", event.target.value)} />
                  </div>
                  <label className="md:col-span-2"><span className={labelClass}>Key Responsibilities</span><textarea className={`${fieldClass} min-h-28 resize-y`} value={role.responsibilities} onChange={(event) => updateRole(role.id, "responsibilities", event.target.value)} /></label>
                </div>
              </div>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-10 border-t border-border pt-8">
          <legend className="text-base font-semibold text-text-primary">Education</legend>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <label><span className={labelClass}>Highest Degree</span><select className={fieldClass} name="degree" defaultValue="high-school"><option value="high-school">High School</option><option value="associate">Associate Degree</option><option value="bachelor">Bachelor&apos;s Degree</option><option value="master">Master&apos;s Degree</option><option value="doctorate">Doctorate</option></select></label>
            <label><span className={labelClass}>Field of Study</span><input className={fieldClass} name="fieldOfStudy" defaultValue="Computer Science" /></label>
            <label><span className={labelClass}>Institution Name</span><input className={fieldClass} name="institution" placeholder="E.g. State University" /></label>
            <label><span className={labelClass}>Graduation Year</span><input className={fieldClass} name="graduationYear" type="number" min="1950" max="2100" placeholder="YYYY" /></label>
          </div>
        </fieldset>

        <fieldset className="mt-10 border-t border-border pt-8">
          <legend className="text-base font-semibold text-text-primary">Job Preferences</legend>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <label className="md:col-span-2"><span className={labelClass}>Job Titles Seeking</span><input className={fieldClass} name="jobTitles" defaultValue="Frontend Engineer, React Developer" /></label>
            <label><span className={labelClass}>Remote Preference</span><select className={fieldClass} name="remotePreference" defaultValue="any"><option value="any">Any</option><option value="remote">Remote</option><option value="hybrid">Hybrid</option><option value="onsite">On-site</option></select></label>
            <label><span className={labelClass}>Salary Expectation (Optional)</span><input className={fieldClass} name="salaryExpectation" placeholder="E.g. $120k+" /></label>
            <label className="md:col-span-2"><span className={labelClass}>Preferred Locations (Optional)</span><input className={fieldClass} name="preferredLocations" placeholder="E.g. New York, London" /></label>
            <label><span className={labelClass}>Cover Letter Tone</span><select className={fieldClass} name="coverLetterTone" defaultValue="professional"><option value="professional">Professional</option><option value="confident">Confident</option><option value="conversational">Conversational</option><option value="concise">Concise</option></select></label>
          </div>
        </fieldset>

        <div className="mt-10 border-t border-border pt-8">
          <button type="submit" className="w-full rounded-md bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2">Save Profile</button>
          <p className="mt-3 text-center text-xs text-text-muted">Profile saving will be connected in the next feature.</p>
        </div>
      </form>
    </section>
  );
}
