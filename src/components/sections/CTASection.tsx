import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";

export function CTASection() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative rounded-3xl overflow-hidden border border-indigo-500/20 bg-[#111118]">

          {/* Background glow */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 h-[400px] w-[600px] rounded-full bg-indigo-600/15 blur-[100px]" />
            <div className="absolute -bottom-1/2 left-1/4 h-[300px] w-[400px] rounded-full bg-violet-600/10 blur-[80px]" />
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.06)_1px,transparent_1px)] bg-[size:32px_32px]" />
            {/* Top edge line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-3/4 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
          </div>

          <div className="relative z-10 flex flex-col items-center text-center px-6 py-20 gap-8">

            {/* Icon */}
            <div className="h-16 w-16 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-[0_0_40px_rgba(99,102,241,0.5)]">
              <Zap className="h-8 w-8 text-white fill-white" />
            </div>

            {/* Headline */}
            <div className="max-w-2xl">
              <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-bold text-white leading-tight tracking-tight mb-4">
                Ready to actually{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #f472b6 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  understand algorithms?
                </span>
              </h2>
              <p className="text-lg text-[#9898b0] leading-relaxed">
                Join engineers who stopped memorizing and started truly understanding. Free to start. No credit card required.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/sign-up"
                className="
                  group inline-flex items-center gap-2
                  px-8 py-4 rounded-xl
                  font-semibold text-base text-white
                  bg-indigo-500 hover:bg-indigo-400
                  shadow-[0_0_32px_rgba(99,102,241,0.45)]
                  hover:shadow-[0_0_48px_rgba(99,102,241,0.65)]
                  border border-indigo-400/30
                  transition-all duration-200
                "
              >
                Start for free
                <ArrowRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform duration-150" />
              </Link>

              <Link
                href="/problems"
                className="
                  inline-flex items-center gap-2
                  px-8 py-4 rounded-xl
                  font-semibold text-base text-[#9898b0]
                  bg-white/[0.04] hover:bg-white/[0.08] hover:text-white
                  border border-white/[0.08] hover:border-white/[0.16]
                  transition-all duration-200
                "
              >
                Browse problems
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-6 text-xs text-[#555570]">
              {[
                "Free tier — 20 problems",
                "No credit card needed",
                "5 languages supported",
                "Cancel anytime",
              ].map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-indigo-500" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}