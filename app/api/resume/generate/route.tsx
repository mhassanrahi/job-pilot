import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { createInsforgeServer } from "@/lib/insforge-server";
import OpenAI, { APIConnectionTimeoutError } from "openai";
import type { ProfileRow, WorkExperience } from "@/actions/profile";

// react-pdf cannot use CSS variables — hex values from ui-tokens.md are required here
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#101828",
    lineHeight: 1.4,
  },
  header: {
    marginBottom: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#101828",
    marginBottom: 4,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    color: "#6a7282",
    fontSize: 9,
    marginBottom: 4,
  },
  contactItem: {
    color: "#6a7282",
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#e7eaf3",
    marginBottom: 14,
  },
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#7c5cfc",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#e7eaf3",
    paddingBottom: 3,
  },
  summaryText: {
    color: "#364153",
    lineHeight: 1.5,
  },
  experienceItem: {
    marginBottom: 10,
  },
  experienceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  jobTitle: {
    fontWeight: "bold",
    color: "#101828",
  },
  company: {
    color: "#6a7282",
  },
  period: {
    color: "#99a1af",
    fontSize: 9,
  },
  bullet: {
    flexDirection: "row",
    marginBottom: 2,
    paddingLeft: 4,
  },
  bulletDot: {
    width: 12,
    color: "#7c5cfc",
  },
  bulletText: {
    flex: 1,
    color: "#364153",
    lineHeight: 1.4,
  },
  skillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  skillBadge: {
    backgroundColor: "#f3e8ff",
    color: "#7c5cfc",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontSize: 9,
  },
  educationLine: {
    color: "#364153",
    marginBottom: 1,
  },
  educationMuted: {
    color: "#6a7282",
    fontSize: 9,
  },
});

type GeneratedContent = {
  professionalSummary: string;
  polishedExperience: { id: string; bullets: string[] }[];
};

function isValidGeneratedContent(obj: unknown): obj is GeneratedContent {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return false;
  const o = obj as Record<string, unknown>;
  if (typeof o.professionalSummary !== "string") return false;
  if (!Array.isArray(o.polishedExperience)) return false;
  return true;
}

function parseJsonSafe(raw: string): GeneratedContent | null {
  if (!raw) return null;
  try {
    const stripped = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
    try {
      const parsed: unknown = JSON.parse(stripped);
      return isValidGeneratedContent(parsed) ? parsed : null;
    } catch {
      const start = stripped.indexOf("{");
      const end = stripped.lastIndexOf("}");
      if (start !== -1 && end > start) {
        const parsed: unknown = JSON.parse(stripped.slice(start, end + 1));
        return isValidGeneratedContent(parsed) ? parsed : null;
      }
      return null;
    }
  } catch {
    return null;
  }
}

function formatPeriod(exp: WorkExperience): string {
  const end = exp.currentlyWorking ? "Present" : (exp.endDate || "Present");
  return `${exp.startDate} – ${end}`;
}

function buildPrompt(profile: ProfileRow): string {
  const workSection = profile.work_experience?.length
    ? profile.work_experience
      .map(
        (e, i) =>
          `Role ${i + 1}: ${e.jobTitle} at ${e.company} (${formatPeriod(e)})\nResponsibilities: ${e.responsibilities}`,
      )
      .join("\n\n")
    : "No work experience provided.";

  return `You are a professional resume writer. Given the following candidate profile, generate:
1. A concise, compelling professional summary (2–3 sentences). Tailor it to their experience level and job titles they are seeking.
2. For each work experience role, 2–4 polished bullet points that highlight achievements and impact. Use strong action verbs. Be specific. Do not repeat the raw responsibilities — rewrite them professionally.

Return ONLY valid JSON in this exact shape:
{
  "professionalSummary": "string",
  "polishedExperience": [
    { "id": "1", "bullets": ["string", "string"] },
    { "id": "2", "bullets": ["string"] }
  ]
}

The "id" in polishedExperience must be the sequential role number as a string ("1", "2", "3", ...) matching the order of roles listed in WORK EXPERIENCE above.

CANDIDATE PROFILE:
Name: ${profile.full_name ?? "Not provided"}
Current Title: ${profile.current_title ?? "Not provided"}
Experience Level: ${profile.experience_level ?? "Not provided"}
Years of Experience: ${profile.years_experience ?? "Not provided"}
Skills: ${profile.skills?.join(", ") ?? "Not provided"}
Industries: ${profile.industries?.join(", ") ?? "Not provided"}
Job Titles Seeking: ${profile.job_titles_seeking?.join(", ") ?? "Not provided"}

WORK EXPERIENCE:
${workSection}`;
}

type ResumeDocProps = {
  profile: ProfileRow;
  generated: GeneratedContent;
};

function ResumePDF({ profile, generated }: ResumeDocProps) {
  const experienceMap = new Map(
    (generated.polishedExperience ?? []).map((e) => [e.id, e.bullets]),
  );

  const contactParts = [
    profile.email,
    profile.phone,
    profile.location,
    profile.linkedin_url,
    profile.portfolio_url,
  ].filter(Boolean) as string[];

  const edu = profile.education;
  const degreeLabel: Record<string, string> = {
    high_school: "High School",
    associate: "Associate",
    bachelor: "Bachelor's",
    master: "Master's",
    phd: "PhD",
    bootcamp: "Bootcamp",
    other: "Other",
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{profile.full_name ?? "Your Name"}</Text>
          {profile.current_title && (
            <Text style={{ color: "#6a7282", marginBottom: 6, fontSize: 11 }}>
              {profile.current_title}
            </Text>
          )}
          <View style={styles.contactRow}>
            {contactParts.map((part, i) => (
              <Text key={i} style={styles.contactItem}>
                {i > 0 ? "·  " : ""}{part}
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.divider} />

        {/* Professional Summary */}
        {generated.professionalSummary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.summaryText}>{generated.professionalSummary}</Text>
          </View>
        )}

        {/* Work Experience */}
        {profile.work_experience && profile.work_experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Work Experience</Text>
            {profile.work_experience.map((exp, index) => {
              const bullets = experienceMap.get(String(index + 1)) ?? [exp.responsibilities];
              return (
                <View key={exp.id} style={styles.experienceItem}>
                  <View style={styles.experienceHeader}>
                    <View>
                      <Text style={styles.jobTitle}>{exp.jobTitle}</Text>
                      <Text style={styles.company}>{exp.company}</Text>
                    </View>
                    <Text style={styles.period}>{formatPeriod(exp)}</Text>
                  </View>
                  {bullets.map((b, i) => (
                    <View key={i} style={styles.bullet}>
                      <Text style={styles.bulletDot}>•</Text>
                      <Text style={styles.bulletText}>{b}</Text>
                    </View>
                  ))}
                </View>
              );
            })}
          </View>
        )}

        {/* Skills */}
        {profile.skills && profile.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.skillsRow}>
              {profile.skills.map((skill, i) => (
                <Text key={i} style={styles.skillBadge}>
                  {skill}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Education */}
        {edu && (edu.institutionName || edu.highestDegree) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {edu.institutionName && (
              <Text style={styles.educationLine}>{edu.institutionName}</Text>
            )}
            {(edu.highestDegree || edu.fieldOfStudy) && (
              <Text style={styles.educationMuted}>
                {[degreeLabel[edu.highestDegree] ?? edu.highestDegree, edu.fieldOfStudy]
                  .filter(Boolean)
                  .join(" · ")}
                {edu.graduationYear ? `  ${edu.graduationYear}` : ""}
              </Text>
            )}
          </View>
        )}
      </Page>
    </Document>
  );
}

export async function POST(_req: NextRequest) {
  try {
    const insforge = await createInsforgeServer();
    const {
      data: { user },
      error: authError,
    } = await insforge.auth.getCurrentUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile, error: profileError } = await insforge.database
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { success: false, error: "Profile not found." },
        { status: 404 },
      );
    }

    const typedProfile = profile as ProfileRow;

    if (!typedProfile.full_name && !typedProfile.current_title) {
      return NextResponse.json(
        {
          success: false,
          error: "Your profile has too little data to generate a resume. Please fill in your name and current title first.",
        },
        { status: 400 },
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY!,
      baseURL: "https://openrouter.ai/api/v1",
    });

    const aiResponse = await openai.chat.completions.create(
      {
        model: process.env.OPENROUTER_MODEL!,
        temperature: 0.7,
        max_tokens: 2000,
        messages: [{ role: "user", content: buildPrompt(typedProfile) }],
      },
      { timeout: 90_000 },
    );

    const message = aiResponse.choices[0]?.message;
    const content = message?.content ?? "";
    const reasoning = (message as unknown as Record<string, unknown>)?.reasoning as string ?? "";
    const rawText = content || reasoning;
    const generated = parseJsonSafe(rawText);

    if (!generated) {
      console.error("[resume/generate] Failed to parse AI response", rawText.slice(0, 200));
      return NextResponse.json(
        { success: false, error: "Failed to generate resume content. Please try again." },
        { status: 500 },
      );
    }

    const buffer = await renderToBuffer(
      <ResumePDF profile={typedProfile} generated={generated} />,
    );

    const blob = new Blob([new Uint8Array(buffer)], { type: "application/pdf" });

    // Delete using the stored key — auto-rename means the actual key may differ from the path
    if (typedProfile.resume_pdf_key) {
      const { error: removeError } = await insforge.storage.from("resumes").remove(typedProfile.resume_pdf_key);
      if (removeError) console.error("[resume/generate] remove", removeError);
    }

    const { data: uploadData, error: uploadError } = await insforge.storage
      .from("resumes")
      .upload(`${user.id}/resume.pdf`, blob);

    if (uploadError || !uploadData) {
      console.error("[resume/generate] storage upload", uploadError);
      return NextResponse.json(
        { success: false, error: "Failed to save generated resume." },
        { status: 500 },
      );
    }

    const { error: dbError } = await insforge.database
      .from("profiles")
      .update({ resume_pdf_url: uploadData.url, resume_pdf_key: uploadData.key })
      .eq("id", user.id);

    if (dbError) {
      console.error("[resume/generate] db update", dbError);
    }

    return NextResponse.json({ success: true, url: uploadData.url });
  } catch (error) {
    if (error instanceof APIConnectionTimeoutError) {
      return NextResponse.json(
        { success: false, error: "Resume generation timed out. Please try again." },
        { status: 504 },
      );
    }
    console.error("[resume/generate]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
