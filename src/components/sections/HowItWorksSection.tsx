import { Search, Code2, Play, TrendingUp } from "lucide-react";

const STEPS = [
  {
    number: "01",
    icon:   Search,
    title:  "Find your problem",
    body:   "Search any LeetCode problem by name or topic. The AI explains the intuition and observations before you touch any code.",
    accent: "#6366f1",
  },
  {
    number: "02",
    icon:   Code2,
    title:  "Write your solution",
    body:   "Use the integrated Monaco editor — the same engine as VS Code. Supports Python, JavaScript, TypeScript, Java, and C++.",
    accent: "#a855f7",
  },
  {
    number: "03",
    icon:   Play,
    title:  "Watch it execute",
    body:   "Submit and AlgoVision plays back your exact execution — variables, pointers, data structures — one step at a time.",
    accent: "#00d4ff",
  },
  {
    number: "04",
    icon:   TrendingUp,
    title:  "Get smarter over time",
    body:   "The revision engine tracks what you've solved and resurfaces problems at the right moment. Insights reveal your weak spots.",
    accent: "#00ff88",
  },
];

export function HowItWorksSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Subtle side glow */}
      <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-[600px] w-[400px] rounded-full bg-violet-600/6 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-indigo-400 mb-3">
            How it works
          </p>
          <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-bold text-white leading-tight tracking-tight">
            From problem to mastery in four steps
          </h2>
        </div>

        {/* Steps */}
        <div className="relative grid md:grid-cols-4 gap-0">
          {/* Connector line — desktop only */}
          <div className="hidden md:block absolute top-10 left-[calc(12.5%+24px)] right-[calc(12.5%+24px)] h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative flex flex-col items-center text-center px-4 py-6"
                style={{
                  animation: "fade-in 0.5s ease-out both",
                  animationDelay: `${i * 100}ms`,
                }}
              >
                {/* Step circle */}
                <div className="relative mb-6 z-10">
                  <div
                    className="h-14 w-14 rounded-2xl flex items-center justify-center border"
                    style={{
                      background:  `${step.accent}18`,
                      borderColor: `${step.accent}35`,
                      boxShadow:   `0 0 24px ${step.accent}20`,
                    }}
                  >
                    <Icon className="h-6 w-6" style={{ color: step.accent }} />
                  </div>
                  {/* Number tag */}
                  <span
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full text-[10px] font-bold font-mono flex items-center justify-center border"
                    style={{
                      background:  step.accent,
                      borderColor: `${step.accent}80`,
                      color:       "#fff",
                    }}
                  >
                    {i + 1}
                  </span>
                </div>

                <h3 className="font-display text-[15px] font-semibold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-[#9898b0] leading-relaxed">
                  {step.body}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}