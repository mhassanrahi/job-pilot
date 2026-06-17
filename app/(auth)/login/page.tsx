import { redirect } from "next/navigation";
import { createInsforgeServer } from "@/lib/insforge-server";
import { LoginCard } from "@/components/auth/LoginCard";

export const metadata = {
  title: "Sign In — JobPilot",
};

export default async function LoginPage() {
  const insforge = await createInsforgeServer();
  const {
    data: { user },
  } = await insforge.auth.getCurrentUser();

  if (user) redirect("/dashboard");

  return <LoginCard />;
}
