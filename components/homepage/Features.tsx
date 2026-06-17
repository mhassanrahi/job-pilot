import type { ReactNode } from "react";
import Image from "next/image";
import {
  Search,
  Building2,
  LayoutDashboard,
  BarChart2,
  BrainCircuit,
  Target,
} from "lucide-react";

type FeatureItem = {
  icon: ReactNode;
  title: string;
  body: string;
};

function FeatureList({ items }: { items: FeatureItem[] }) {
  return (
    <ul className="flex flex-col gap-8">
      {items.map((item) => (
        <li key={item.title} className="flex gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent-muted flex items-center justify-center text-accent">
            {item.icon}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-1">
              {item.title}
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              {item.body}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

const manageFeatures: FeatureItem[] = [
  {
    icon: <Search size={18} />,
    title: "Find Jobs Across All Major Boards",
    body: "Automatically discover the most relevant openings for your skills and location — no more manual searching across dozens of sites.",
  },
  {
    icon: <Building2 size={18} />,
    title: "Know the Company Before You Apply",
    body: "Our AI agent visits the company website and builds a detailed dossier covering culture, tech stack, and why the role exists.",
  },
  {
    icon: <LayoutDashboard size={18} />,
    title: "Keep Track of Every Application",
    body: "One clear dashboard shows every job you've found, your match scores, and your research — all in one place.",
  },
];

const applyFeatures: FeatureItem[] = [
  {
    icon: <BarChart2 size={18} />,
    title: "Understand Your Fit Before You Apply",
    body: "Every job gets an AI-generated match score with a breakdown of which skills you have and which you're missing.",
  },
  {
    icon: <BrainCircuit size={18} />,
    title: "AI-Prepared for Every Interview",
    body: "Company research is delivered automatically so you walk in knowing the product, the tech stack, and the culture.",
  },
  {
    icon: <Target size={18} />,
    title: "Choose the Right Role",
    body: "Not every job deserves your time. Smart scoring helps you focus on the opportunities most likely to land.",
  },
];

export function Features() {
  return (
    <div className="bg-background">
      {/* Section A: text left, image right */}
      <section className="max-w-[1440px] mx-auto px-8 py-20">
        <div className="grid grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-text-primary mb-10">
              Manage Your Job Search<br />With Ease
            </h2>
            <FeatureList items={manageFeatures} />
          </div>
          <div className="rounded-xl overflow-hidden shadow-xl border border-border">
            <Image
              src="/images/jobs-lists.png"
              alt="JobPilot jobs list"
              width={880}
              height={560}
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Section B: image left, text right */}
      <section className="max-w-[1440px] mx-auto px-8 py-20">
        <div className="grid grid-cols-2 gap-16 items-center">
          <div className="rounded-xl overflow-hidden shadow-xl border border-border">
            <Image
              src="/images/agnet-log.png"
              alt="JobPilot AI agent activity"
              width={880}
              height={560}
              className="w-full h-auto"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-text-primary mb-10">
              Apply With More Confidence,<br />Every Time
            </h2>
            <FeatureList items={applyFeatures} />
          </div>
        </div>
      </section>
    </div>
  );
}
