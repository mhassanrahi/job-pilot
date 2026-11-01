import { Navbar } from "@/components/layout/Navbar";
import { isAuthenticated } from "@/lib/auth";

export async function AuthNavbar() {
  return <Navbar isAuthenticated={await isAuthenticated()} />;
}
