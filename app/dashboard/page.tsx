import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { signOut } from "@/actions/auth";
import { createInsforgeServer } from "@/lib/insforge-server";

export default async function DashboardPage() {
  const insforge = await createInsforgeServer();
  const { data, error } = await insforge.auth.getCurrentUser();

  if (error || !data.user) {
    redirect("/login");
  }

  return (
    <main className="soft-spectrum flex min-h-screen items-center justify-center px-5 py-12">
      <section className="w-full max-w-xl rounded-xl border border-border bg-surface p-8 text-center shadow-lg">
        <Link href="/" aria-label="JobPilot home" className="inline-flex">
          <Image src="/logo.png" alt="JobPilot" width={148} height={50} priority />
        </Link>
        <div className="mx-auto mt-8 flex size-12 items-center justify-center rounded-full bg-success-light text-xl text-success-foreground">
          <span aria-hidden="true">✓</span>
        </div>
        <h1 className="mt-5 text-3xl font-semibold tracking-[-0.03em] text-text-primary">
          You’re signed in
        </h1>
        <p className="mt-3 text-sm leading-6 text-text-secondary">
          Authentication is ready. The full dashboard arrives in Feature 14.
        </p>
        <form action={signOut} className="mt-8">
          <button
            type="submit"
            className="rounded-md bg-overlay px-6 py-3 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
          >
            Sign out
          </button>
        </form>
      </section>
    </main>
  );
}
