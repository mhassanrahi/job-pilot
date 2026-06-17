import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/homepage/Hero";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <Hero />
      </main>
      <Footer />
    </>
  );
}
