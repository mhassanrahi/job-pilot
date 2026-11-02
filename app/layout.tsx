import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import { PostHogIdentify } from "@/components/analytics/PostHogIdentify";
import { PostHogProvider } from "@/components/analytics/PostHogProvider";
import { createInsforgeServer } from "@/lib/insforge-server";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "JobPilot — Find better jobs with confidence",
  description:
    "Discover fitting roles, research companies, and prepare stronger applications with JobPilot.",
};

async function AuthenticatedPostHogIdentify() {
  const insforge = await createInsforgeServer();
  const { data } = await insforge.auth.getCurrentUser();

  return (
    <PostHogIdentify
      distinctId={data.user?.id ?? null}
      email={data.user?.email ?? null}
    />
  );
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col overflow-x-hidden font-sans">
        <PostHogProvider>
          <Suspense fallback={null}>
            <AuthenticatedPostHogIdentify />
          </Suspense>
          {children}
        </PostHogProvider>
      </body>
    </html>
  );
}
