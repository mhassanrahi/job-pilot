import Image from "next/image";

const benefits = [
  {
    title: "Find jobs that actually fit",
    description:
      "Search by title and location or paste a job link. Get matched roles you can quickly scan.",
  },
  {
    title: "Know the Company Before You Apply",
    description:
      "Stop guessing what a company is about. JobPilot browses their site and gives you everything you need to apply with confidence.",
  },
  {
    title: "Keep track of every application",
    description:
      "Keep a clear view of every job you’ve found, tailored. Your activity and progress all stay in one simple place.",
  },
];

export function HowItWorks() {
  return (
    <section className="grid lg:grid-cols-2">
      <div className="min-w-0 bg-surface">
        <div className="flex min-h-[300px] items-center border-b border-border px-10 py-16 lg:px-24">
          <h2 className="max-w-xl text-5xl font-semibold leading-[1.08] tracking-[-0.04em] text-text-black md:text-[64px]">
            Manage Your Job Search With Ease
          </h2>
        </div>
        <div>
          {benefits.map((benefit, index) => (
            <article
              key={benefit.title}
              className={`min-h-[190px] border-b border-border px-10 py-11 lg:px-24 ${index === 0 ? "border-l-2 border-l-accent" : ""}`}
            >
              <h3 className="text-xl font-semibold text-text-darker">{benefit.title}</h3>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-text-secondary">{benefit.description}</p>
            </article>
          ))}
        </div>
      </div>
      <div className="flex min-h-[870px] min-w-0 items-center justify-center overflow-hidden bg-surface-muted p-8 lg:p-12">
        <Image
          src="/images/jobs-lists.png"
          alt="JobPilot job list with company match scores, salaries, and sources"
          width={2364}
          height={1778}
          sizes="(max-width: 1024px) 90vw, 760px"
          className="w-full max-w-[790px]"
        />
      </div>
    </section>
  );
}
