const TESTIMONIALS = [
  {
    quote:    "I've solved 300+ LeetCode problems but never truly understood BST traversal. AlgoVision showed me the call stack evolving in real-time. That was the moment it clicked.",
    name:     "Priya Sharma",
    role:     "SWE Intern → Google",
    initials: "PS",
    color:    "#6366f1",
  },
  {
    quote:    "The error analysis is what sets it apart. Instead of 'wrong answer', it told me exactly where my two-pointer logic collapsed and why. That feedback loop is invaluable.",
    name:     "Marcus Chen",
    role:     "CS Student, Stanford",
    initials: "MC",
    color:    "#00d4ff",
  },
  {
    quote:    "I was using 5 different tools — editor, visualizer, AI chat, spaced rep app, complexity checker. AlgoVision replaced all of them in a single workflow.",
    name:     "Aisha Williams",
    role:     "Backend Engineer, Stripe",
    initials: "AW",
    color:    "#00ff88",
  },
];

export function TestimonialsSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-px w-full max-w-4xl bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-xl mx-auto mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-indigo-400 mb-3">
            From the community
          </p>
          <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-bold text-white leading-tight tracking-tight">
            Engineers who got it
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.name}
              className="relative rounded-2xl border border-white/[0.06] bg-[#111118] p-6 flex flex-col gap-5 hover:border-white/[0.12] transition-colors duration-300"
              style={{
                animation: "fade-in 0.5s ease-out both",
                animationDelay: `${i * 100}ms`,
              }}
            >
              {/* Quote mark */}
              <span
                className="font-display text-5xl font-bold leading-none"
                style={{ color: `${t.color}40` }}
                aria-hidden
              >
                "
              </span>

              <p className="text-sm text-[#9898b0] leading-relaxed -mt-4 flex-1">
                {t.quote}
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
                <div
                  className="h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: `${t.color}30`, border: `1px solid ${t.color}40` }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-[#555570]">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}