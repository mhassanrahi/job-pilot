import Image from "next/image";

export function Testimonial() {
  return (
    <section className="flex min-h-[520px] flex-col items-center justify-center bg-surface px-8 py-24 text-center">
      <p className="text-sm font-medium uppercase tracking-[0.12em] text-accent">Success Stories</p>
      <blockquote className="mt-10 max-w-5xl text-3xl font-medium leading-[1.45] tracking-[-0.02em] text-text-darker md:text-[40px]">
        “I used to spend my evenings copy-pasting resumes. Now I open my dashboard to see interviews waiting. It feels like cheating. Had 3 offers on the table simultaneously.”
      </blockquote>
      <div className="mt-10 flex items-center gap-4 text-left">
        <Image
          src="/images/user-icon.png"
          alt="Tom Wilson"
          width={64}
          height={64}
          className="rounded-lg"
        />
        <div>
          <p className="text-lg font-semibold text-text-black">Tom Wilson</p>
          <p className="mt-1 text-base text-text-secondary">Junior Developer</p>
        </div>
      </div>
    </section>
  );
}
