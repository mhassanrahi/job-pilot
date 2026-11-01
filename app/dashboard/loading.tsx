import Image from "next/image";

export default function DashboardLoading() {
  return (
    <main className="soft-spectrum flex min-h-screen items-center justify-center px-5 py-12">
      <section className="w-full max-w-xl rounded-xl border border-border bg-surface p-8 text-center shadow-lg">
        <Image src="/logo.png" alt="JobPilot" width={148} height={50} priority className="mx-auto" />
        <div className="mx-auto mt-8 size-12 animate-pulse rounded-full bg-surface-tertiary" />
        <div className="mx-auto mt-5 h-8 w-52 animate-pulse rounded-md bg-surface-tertiary" />
        <div className="mx-auto mt-4 h-4 w-80 max-w-full animate-pulse rounded-md bg-surface-tertiary" />
      </section>
    </main>
  );
}
