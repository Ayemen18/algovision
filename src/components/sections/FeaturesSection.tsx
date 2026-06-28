"use client";

import { useRef, useState } from "react";
import {
  Eye,
  Brain,
  Bug,
  BarChart3,
  RefreshCw,
  Lightbulb,
} from "lucide-react";

const FEATURES = [
  {
    icon:        Eye,
    title:       "Step-by-step visualization",
    description: "Every line of code mapped to a live visual. Watch arrays shift, hashmaps fill, and trees traverse — synchronized to each execution step.",
    accent:      "#6366f1",
    accentBg:    "rgba(99,102,241,0.12)",
    accentBorder:"rgba(99,102,241,0.25)",
  },
  {
    icon:        Brain,
    title:       "AI problem intuition",
    description: "Before you look at code, the AI explains the why — the insight that makes the problem click. Build genuine understanding, not pattern matching.",
    accent:      "#a855f7",
    accentBg:    "rgba(168,85,247,0.12)",
    accentBorder:"rgba(168,85,247,0.25)",
  },
  {
    icon:        Bug,
    title:       "Intelligent error analysis",
    description: "Wrong answer? The AI doesn't just say so — it shows exactly where your logic diverges from the expected path, with line-level explanations.",
    accent:      "#ef4444",
    accentBg:    "rgba(239,68,68,0.12)",
    accentBorder:"rgba(239,68,68,0.25)",
  },
  {
    icon:        BarChart3,
    title:       "Complexity breakdown",
    description: "Every solution comes with a time and space complexity analysis. Understand trade-offs and see where your approach can be optimized.",
    accent:      "#00d4ff",
    accentBg:    "rgba(0,212,255,0.12)",
    accentBorder:"rgba(0,212,255,0.25)",
  },
  {
    icon:        RefreshCw,
    title:       "Spaced repetition revision",
    description: "Connect your LeetCode account and the platform builds a revision schedule around what you've solved — resurface problems before you forget them.",
    accent:      "#00ff88",
    accentBg:    "rgba(0,255,136,0.12)",
    accentBorder:"rgba(0,255,136,0.25)",
  },
  {
    icon:        Lightbulb,
    title:       "Personalized insights",
    description: "Your coding history reveals patterns — strong in hash maps, weak in DP. The AI builds a practice plan targeting your actual weak spots.",
    accent:      "#f59e0b",
    accentBg:    "rgba(245,158,11,0.12)",
    accentBorder:"rgba(245,158,11,0.25)",
  },
];

// ─── Single Feature Card ──────────────────────────────────────────────────────

interface FeatureCardProps {
  feature: (typeof FEATURES)[number];
  index:   number;
}

function FeatureCard({ feature, index }: FeatureCardProps) {
  const cardRef                     = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos]     = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered]   = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const Icon = feature.icon;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="
        relative overflow-hidden rounded-2xl
        border border-white/[0.06] bg-[#111118]
        p-6 transition-all duration-300
        hover:border-white/[0.12]
        hover:shadow-[0_0_40px_rgba(0,0,0,0.4)]
        cursor-default
      "
      style={{
        animationDelay: `${index * 80}ms`,
        animation: "fade-in 0.5s ease-out both",
      }}
    >
      {/* Mouse-follow spotlight */}
      {isHovered && (
        <div
          className="pointer-events-none absolute inset-0 opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(280px circle at ${mousePos.x}px ${mousePos.y}px, ${feature.accent}14, transparent 70%)`,
          }}
        />
      )}

      {/* Top accent line */}
      <div
        className="absolute top-0 left-6 right-6 h-px transition-opacity duration-300"
        style={{
          background: `linear-gradient(90deg, transparent, ${feature.accent}60, transparent)`,
          opacity: isHovered ? 1 : 0,
        }}
      />

      {/* Icon */}
      <div
        className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-300"
        style={{
          background:   feature.accentBg,
          borderColor:  feature.accentBorder,
          boxShadow:    isHovered ? `0 0 20px ${feature.accent}30` : "none",
        }}
      >
        <Icon className="h-5 w-5" style={{ color: feature.accent }} />
      </div>

      {/* Content */}
      <h3 className="mb-2 font-display text-[15px] font-semibold text-white">
        {feature.title}
      </h3>
      <p className="text-sm text-[#9898b0] leading-relaxed">
        {feature.description}
      </p>
    </div>
  );
}

// ─── Features Section ─────────────────────────────────────────────────────────

export function FeaturesSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[800px] rounded-full bg-indigo-600/5 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">

        {/* Section header */}
        <div className="max-w-2xl mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-indigo-400 mb-3">
            Everything you need
          </p>
          <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-bold text-white leading-tight tracking-tight mb-4">
            The platform built for{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #818cf8 0%, #c084fc 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              real understanding
            </span>
          </h2>
          <p className="text-[#9898b0] text-lg leading-relaxed">
            Not another problem judge. AlgoVision is the layer between code and comprehension — showing you exactly what your algorithm does, and why.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}