import Image from "next/image";

const features = [
  {
    title: "Understand your match score",
    description:
      "See how your profile lines up with each role before you apply. Get a clear breakdown of what fits and what’s missing.",
  },
  {
    title: "AI-Powered Job Matching",
    description:
      "Stop guessing which jobs are worth applying to. JobPilot scores every role against your actual skills so you focus on the ones that matter.",
  },
  {
    title: "Focus on the right roles",
    description:
      "Filter out low fit jobs and stay on the ones that actually matter. Spend less time sorting and more time applying.",
  },
];

export function Features() {
  return (
    <section className="grid lg:grid-cols-2">
      <div className="order-2 flex min-h-[900px] min-w-0 items-center justify-center overflow-hidden bg-surface-muted p-8 lg:order-1 lg:p-16">
        <Image
          src="/images/agnet-log.png"
          alt="JobPilot agent log showing role discovery and application preparation"
          width={2144}
          height={1656}
          sizes="(max-width: 1024px) 90vw, 760px"
          className="w-full max-w-[760px]"
        />
      </div>
      <div className="order-1 min-w-0 bg-surface lg:order-2">
        <div className="flex min-h-[360px] items-center border-b border-border px-10 py-16 lg:px-24">
          <h2 className="max-w-2xl text-5xl font-semibold leading-[1.08] tracking-[-0.04em] text-text-black md:text-[64px]">
            Apply With More Confidence, Every Time
          </h2>
        </div>
        <div>
          {features.map((feature, index) => (
            <article
              key={feature.title}
              className={`min-h-[180px] border-b border-border px-10 py-10 lg:px-24 ${index === 1 ? "border-l-2 border-l-success" : ""}`}
            >
              <h3 className="text-xl font-semibold text-text-darker">{feature.title}</h3>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-text-secondary">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
