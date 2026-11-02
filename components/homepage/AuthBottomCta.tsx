import { BottomCta } from "@/components/homepage/BottomCta";
import { isAuthenticated } from "@/lib/auth";

export async function AuthBottomCta() {
  return <BottomCta isAuthenticated={await isAuthenticated()} />;
}
