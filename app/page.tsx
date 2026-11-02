import { Suspense } from "react";
import { AuthBottomCta } from "@/components/homepage/AuthBottomCta";
import { AuthHero } from "@/components/homepage/AuthHero";
import { BottomCta } from "@/components/homepage/BottomCta";
import { DashboardPreview } from "@/components/homepage/DashboardPreview";
import { Features } from "@/components/homepage/Features";
import { Hero } from "@/components/homepage/Hero";
import { HowItWorks } from "@/components/homepage/HowItWorks";
import { Testimonial } from "@/components/homepage/Testimonial";
import { AuthNavbar } from "@/components/layout/AuthNavbar";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-surface">
      <Suspense fallback={<Navbar />}>
        <AuthNavbar />
      </Suspense>
      <div className="mx-auto w-full max-w-[1720px] border-x border-border">
        <Suspense fallback={<Hero />}>
          <AuthHero />
        </Suspense>
        <DashboardPreview />
        <div className="h-24 border-y border-border diagonal-divider md:h-32" />
        <HowItWorks />
        <div className="h-24 border-y border-border diagonal-divider md:h-32" />
        <Features />
        <div className="h-24 border-y border-border diagonal-divider md:h-32" />
        <Testimonial />
        <div className="h-24 border-y border-border diagonal-divider md:h-32" />
        <Suspense fallback={<BottomCta />}>
          <AuthBottomCta />
        </Suspense>
        <div className="h-24 border-y border-border diagonal-divider md:h-32" />
        <Footer />
      </div>
    </main>
  );
}
