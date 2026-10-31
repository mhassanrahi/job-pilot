import Image from "next/image";

export function DashboardPreview() {
  return (
    <section className="flex min-h-[760px] items-center justify-center overflow-hidden bg-surface-tertiary px-5 py-16 md:px-20 md:py-20">
      <Image
        src="/images/dashboard-demo.png"
        alt="JobPilot dashboard showing job search statistics and recent activity"
        width={4788}
        height={2416}
        sizes="(max-width: 1720px) 90vw, 1530px"
        className="w-full max-w-[1530px] rounded-[30px] shadow-2xl"
        priority
      />
    </section>
  );
}
