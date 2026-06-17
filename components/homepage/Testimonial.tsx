import Image from "next/image";

export function Testimonial() {
  return (
    <section className="bg-surface py-20">
      <div className="max-w-2xl mx-auto px-8 text-center">
        <blockquote className="text-xl font-medium text-text-primary leading-relaxed mb-8">
          "I used to spend my evenings copy-pasting resumes. Now I open my
          dashboard to see interviews waiting. It feels like cheating. Had 3
          offers on the table simultaneously."
        </blockquote>
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-border">
            <Image
              src="/images/user-icon.png"
              alt="Sarah Chen"
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">Sarah Chen</p>
            <p className="text-xs text-text-muted">Senior Frontend Engineer</p>
          </div>
        </div>
      </div>
    </section>
  );
}
