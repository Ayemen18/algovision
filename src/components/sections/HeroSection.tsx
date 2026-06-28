"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Play, Star } from "lucide-react";

// ─── Animated visualizer preview ─────────────────────────────────────────────

const STEPS = [
  {
    line:    1,
    code:    "def two_sum(nums, target):",
    vars:    { i: "—", j: "—", found: "—" },
    active:  [] as number[],
    comment: "Define function",
  },
  {
    line:    2,
    code:    "    seen = {}",
    vars:    { seen: "{}", i: "—", diff: "—" },
    active:  [] as number[],
    comment: "Init hashmap",
  },
  {
    line:    3,
    code:    "    for i, num in enumerate(nums):",
    vars:    { i: 0, num: 2, diff: "—" },
    active:  [0],
    comment: "i=0, num=2",
  },
  {
    line:    4,
    code:    "        diff = target - num",
    vars:    { i: 0, num: 2, diff: 7 },
    active:  [0],
    comment: "diff = 9 - 2 = 7",
  },
  {
    line:    5,
    code:    "        if diff in seen:",
    vars:    { i: 1, num: 7, diff: 2 },
    active:  [0, 1],
    comment: "Check seen",
  },
  {
    line:    6,
    code:    "            return [seen[diff], i]",
    vars:    { result: "[0, 1]" },
    active:  [0, 1],
    comment: "✓ Found!",
  },
];

const ARRAY = [2, 7, 11, 15];

function VisualizerPreview() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setStep((s) => (s + 1) % STEPS.length);
    }, 1400);
    return () => clearInterval(t);
  }, []);

  const current = STEPS[step];

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-white/[0.08] bg-[#111118] shadow-[0_0_80px_rgba(99,102,241,0.12)]">

      {/* Window chrome */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-[#0f0f16]">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 text-xs font-mono text-[#555570]">two_sum.py — AlgoVision</span>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="text-xs font-mono text-[#555570]">Step {step + 1}/{STEPS.length}</span>
          <div className="h-1.5 w-20 rounded-full bg-white/[0.06] overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-700"
              style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5">

        {/* Code panel */}
        <div className="col-span-3 p-4 font-mono text-[13px] border-r border-white/[0.06]">
          {STEPS.map((s, i) => (
            <div
              key={i}
              className={`
                flex gap-3 px-2 py-0.5 rounded transition-all duration-300
                ${i === step
                  ? "bg-indigo-500/[0.12] border-l-2 border-indigo-500"
                  : i < step
                  ? "opacity-40"
                  : "opacity-20"
                }
              `}
            >
              <span className="w-4 shrink-0 text-right text-[#555570] select-none">{i + 1}</span>
              <span className={i === step ? "text-[#c7d7fe]" : "text-[#9898b0]"}>
                {s.code}
              </span>
            </div>
          ))}

          {/* Explanation bubble */}
          <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
            <div className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse shrink-0" />
            <span className="text-xs text-indigo-300 font-mono">{current.comment}</span>
          </div>
        </div>

        {/* Right panel */}
        <div className="col-span-2 p-4 flex flex-col gap-4">

          {/* Array visualization */}
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#555570] mb-2">Array</p>
            <div className="flex gap-1.5">
              {ARRAY.map((val, idx) => (
                <div
                  key={idx}
                  className={`
                    flex-1 h-10 rounded-md flex flex-col items-center justify-center
                    border transition-all duration-500
                    ${current.active.includes(idx)
                      ? "bg-indigo-500/20 border-indigo-500/60 shadow-[0_0_12px_rgba(99,102,241,0.3)]"
                      : "bg-white/[0.03] border-white/[0.06]"
                    }
                  `}
                >
                  <span className={`text-xs font-mono font-bold transition-colors duration-300 ${current.active.includes(idx) ? "text-indigo-300" : "text-[#9898b0]"}`}>
                    {val}
                  </span>
                  <span className="text-[9px] text-[#555570] mt-0.5">[{idx}]</span>
                </div>
              ))}
            </div>
          </div>

          {/* Variables */}
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#555570] mb-2">Variables</p>
            <div className="space-y-1">
              {Object.entries(current.vars).map(([key, val]) => (
                <div key={key} className="flex items-center justify-between px-2 py-1 rounded bg-white/[0.03] border border-white/[0.04]">
                  <span className="text-[11px] font-mono text-[#818cf8]">{key}</span>
                  <span className="text-[11px] font-mono text-[#00ff88]">{String(val)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scanline shimmer */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent animate-[shimmer_3s_ease-in-out_infinite]" />
    </div>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-24 pb-16 overflow-hidden">

      {/* Background layers */}
      <div className="pointer-events-none absolute inset-0">
        {/* Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.04)_1px,transparent_1px)] bg-[size:44px_44px]" />
        {/* Radial glow — top center */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[600px] w-[800px] rounded-full bg-indigo-600/10 blur-[120px]" />
        {/* Secondary glow — bottom right */}
        <div className="absolute bottom-0 right-0 h-[400px] w-[600px] rounded-full bg-violet-600/8 blur-[100px]" />
        {/* Neon dot — accent */}
        <div className="absolute top-1/3 right-1/4 h-1 w-1 rounded-full bg-[#00ff88] shadow-[0_0_20px_6px_rgba(0,255,136,0.3)]" />
        <div className="absolute bottom-1/3 left-1/5 h-1 w-1 rounded-full bg-indigo-400 shadow-[0_0_20px_6px_rgba(99,102,241,0.4)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Left: Copy ── */}
          <div className="flex flex-col gap-6">

            {/* Eyebrow badge */}
            <div
              className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full border border-indigo-500/25 bg-indigo-500/8 animate-[fade-in_0.5s_ease-out_both]"
              style={{ animationDelay: "0ms" }}
            >
              <Star className="h-3 w-3 fill-indigo-400 text-indigo-400" />
              <span className="text-xs font-medium text-indigo-300">
                AI-Powered Algorithm Learning
              </span>
            </div>

            {/* Headline */}
            <h1
              className="font-display text-[clamp(2.5rem,5.5vw,4rem)] font-bold leading-[1.08] tracking-tight animate-[fade-in_0.5s_ease-out_both]"
              style={{ animationDelay: "80ms" }}
            >
              <span className="text-white">Stop memorizing.</span>
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #818cf8 0%, #c084fc 45%, #f472b6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Start understanding.
              </span>
            </h1>

            {/* Subheading */}
            <p
              className="text-lg text-[#9898b0] leading-relaxed max-w-lg animate-[fade-in_0.5s_ease-out_both]"
              style={{ animationDelay: "160ms" }}
            >
              AlgoVision visualizes every step of your algorithm — live. See variables
              change, pointers move, and data structures evolve. Know{" "}
              <em className="text-white not-italic">why</em> your code works, not just if it does.
            </p>

            {/* Stats row */}
            <div
              className="flex items-center gap-6 animate-[fade-in_0.5s_ease-out_both]"
              style={{ animationDelay: "240ms" }}
            >
              {[
                { value: "150+", label: "Problems" },
                { value: "10k+", label: "Learners" },
                { value: "4.9★", label: "Rating"   },
              ].map(({ value, label }) => (
                <div key={label} className="flex flex-col">
                  <span className="text-xl font-bold font-display text-white">{value}</span>
                  <span className="text-xs text-[#555570]">{label}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div
              className="flex flex-wrap gap-3 animate-[fade-in_0.5s_ease-out_both]"
              style={{ animationDelay: "320ms" }}
            >
              <Link
                href="/sign-up"
                className="
                  group inline-flex items-center gap-2
                  px-6 py-3 rounded-xl
                  font-semibold text-sm text-white
                  bg-indigo-500 hover:bg-indigo-400
                  shadow-[0_0_28px_rgba(99,102,241,0.4)]
                  hover:shadow-[0_0_40px_rgba(99,102,241,0.6)]
                  border border-indigo-400/30
                  transition-all duration-200
                "
              >
                Start for free
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-150" />
              </Link>

              <Link
                href="/problems"
                className="
                  inline-flex items-center gap-2
                  px-6 py-3 rounded-xl
                  font-semibold text-sm text-[#9898b0]
                  bg-white/[0.04] hover:bg-white/[0.08] hover:text-white
                  border border-white/[0.08] hover:border-white/[0.16]
                  transition-all duration-200
                "
              >
                <Play className="h-4 w-4 fill-current" />
                Watch demo
              </Link>
            </div>

            {/* Trust line */}
            <p
              className="text-xs text-[#555570] animate-[fade-in_0.5s_ease-out_both]"
              style={{ animationDelay: "400ms" }}
            >
              No credit card required · Free tier includes 20 problems
            </p>
          </div>

          {/* ── Right: Visualizer preview ── */}
          <div
            className="animate-[fade-in_0.6s_ease-out_both]"
            style={{ animationDelay: "200ms" }}
          >
            {/* Floating wrapper */}
            <div className="relative" style={{ animation: "float 4s ease-in-out infinite" }}>
              {/* Glow behind card */}
              <div className="absolute -inset-4 rounded-3xl bg-indigo-500/10 blur-2xl" />
              <VisualizerPreview />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}