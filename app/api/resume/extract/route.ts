// pdf-parse v2 requires the worker to be imported first in serverless environments
import "pdf-parse/worker";
import { PDFParse } from "pdf-parse";
import { NextRequest, NextResponse } from "next/server";
import { createInsforgeServer } from "@/lib/insforge-server";
import OpenAI from "openai";
import type { ExtractedFields } from "@/actions/profile";

const SYSTEM_PROMPT = `You are a resume parser. Extract structured profile information from the resume text provided. Return ONLY valid JSON — no markdown, no code blocks, no explanation.

Only include fields you can confidently extract from the resume. Omit fields you cannot find. Do not invent or guess data.

Return a JSON object with these fields (all optional):
{
  "fullName": string,
  "phone": string,
  "location": string (city, country),
  "linkedinUrl": string,
  "portfolioUrl": string,
  "currentTitle": string (most recent job title),
  "experienceLevel": "junior" | "mid" | "senior" | "lead",
  "yearsExperience": string (number as string, e.g. "5"),
  "skills": string[],
  "industries": string[],
  "workExperience": [
    {
      "id": string (sequential: "1", "2", "3"),
      "company": string,
      "jobTitle": string,
      "startDate": string (e.g. "January 2020"),
      "endDate": string (e.g. "March 2023", or "" if currently working),
      "currentlyWorking": boolean,
      "responsibilities": string
    }
  ] (max 3, most recent first),
  "highestDegree": "high_school" | "associate" | "bachelor" | "master" | "phd" | "bootcamp" | "other",
  "fieldOfStudy": string,
  "institutionName": string,
  "graduationYear": string (YYYY)
}`;

function isValidExtractedFields(obj: unknown): obj is ExtractedFields {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return false;
  const o = obj as Record<string, unknown>;
  if (o.skills !== undefined && !Array.isArray(o.skills)) return false;
  if (o.industries !== undefined && !Array.isArray(o.industries)) return false;
  if (o.workExperience !== undefined && !Array.isArray(o.workExperience)) return false;
  return true;
}

function parseJsonSafe(raw: string): ExtractedFields | null {
  if (!raw) return null;
  try {
    const stripped = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
    try {
      const parsed: unknown = JSON.parse(stripped);
      return isValidExtractedFields(parsed) ? parsed : null;
    } catch {
      // Reasoning models embed JSON inside a longer text — extract the outermost object
      const start = stripped.indexOf("{");
      const end = stripped.lastIndexOf("}");
      if (start !== -1 && end > start) {
        const parsed: unknown = JSON.parse(stripped.slice(start, end + 1));
        return isValidExtractedFields(parsed) ? parsed : null;
      }
      return null;
    }
  } catch {
    return null;
  }
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

    const { data: signedData, error: signedError } = await insforge.storage
      .from("resumes")
      .createSignedUrl(`${user.id}/resume.pdf`, 60);

    if (signedError || !signedData?.signedUrl) {
      return NextResponse.json(
        { success: false, error: "No resume found. Please upload a resume first." },
        { status: 404 },
      );
    }

    const pdfResponse = await fetch(signedData.signedUrl);
    if (!pdfResponse.ok) {
      return NextResponse.json(
        { success: false, error: "Failed to download resume from storage." },
        { status: 500 },
      );
    }

    const arrayBuffer = await pdfResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const parser = new PDFParse({ data: buffer });
    let extractedText = "";
    try {
      const result = await parser.getText();
      extractedText = result.text?.trim() ?? "";
    } finally {
      await parser.destroy();
    }

    if (extractedText.length < 100) {
      return NextResponse.json(
        {
          success: false,
          error: "Could not extract text from this PDF. Please try a different file.",
        },
        { status: 422 },
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY!,
      baseURL: "https://openrouter.ai/api/v1",
    });

    const response = await openai.chat.completions.create({
      model: process.env.OPENROUTER_MODEL!,
      temperature: 0.3,
      max_tokens: 8000,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Resume text:\n\n${extractedText}` },
      ],
    });

    const message = response.choices[0]?.message;
    const content = message?.content ?? "";
    // Reasoning models (e.g. nemotron) put output in a non-standard `reasoning` field
    const reasoning = (message as unknown as Record<string, unknown>)?.reasoning as string ?? "";
    const rawText = content || reasoning;
    const extracted = parseJsonSafe(rawText);

    if (!extracted) {
      console.error("[resume/extract] Failed to parse AI response:", content);
      return NextResponse.json(
        { success: false, error: "Failed to parse extracted profile data." },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, data: extracted });
  } catch (error) {
    console.error("[resume/extract]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
