export type AdzunaJob = {
  id: string;
  title: string;
  company: { display_name: string };
  location: { display_name: string };
  description: string;
  redirect_url: string;
  salary_min?: number;
  salary_max?: number;
  salary_is_predicted: "0" | "1";
  contract_type?: string;
  created: string;
  category: { tag: string; label: string };
};

const COUNTRY_KEYWORDS: Record<string, string> = {
  uk: "gb",
  "united kingdom": "gb",
  england: "gb",
  scotland: "gb",
  wales: "gb",
  london: "gb",
  manchester: "gb",
  birmingham: "gb",
  australia: "au",
  sydney: "au",
  melbourne: "au",
  brisbane: "au",
  canada: "ca",
  toronto: "ca",
  vancouver: "ca",
  montreal: "ca",
};

export function detectCountry(location: string): string {
  const lower = location.toLowerCase();
  for (const [keyword, code] of Object.entries(COUNTRY_KEYWORDS)) {
    if (new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(lower)) return code;
  }
  return "us";
}

export async function searchJobs(
  jobTitle: string,
  location: string,
  country: string = "us",
): Promise<AdzunaJob[]> {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;
  if (!appId || !appKey) {
    throw new Error("Missing required environment variables: ADZUNA_APP_ID and ADZUNA_APP_KEY must be set");
  }
  const params = new URLSearchParams({
    app_id: appId,
    app_key: appKey,
    what: jobTitle,
    category: "it-jobs",
    results_per_page: "10",
    "content-type": "application/json",
  });

  if (location) {
    params.set("where", location);
  }

  const response = await fetch(
    `https://api.adzuna.com/v1/api/jobs/${country}/search/1?${params}`,
  );

  if (!response.ok) {
    throw new Error(`Adzuna API error: ${response.status}`);
  }

  const data = (await response.json()) as { results?: AdzunaJob[] };
  return data.results ?? [];
}
