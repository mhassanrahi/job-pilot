import { Hero } from "@/components/homepage/Hero";
import { isAuthenticated } from "@/lib/auth";

export async function AuthHero() {
  return <Hero isAuthenticated={await isAuthenticated()} />;
}
