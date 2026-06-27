import { cn } from "@/lib/utils";
import type { Difficulty } from "@/types";

// ─── Generic Badge ────────────────────────────────────────────────────────────

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "brand";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  const variants = {
    default: "bg-white/5 text-text-secondary border-white/10",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    danger:  "bg-rose-500/10 text-rose-400 border-rose-500/20",
    info:    "bg-blue-500/10 text-blue-400 border-blue-500/20",
    brand:   "bg-brand-500/10 text-brand-300 border-brand-500/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1",
        "rounded-full border px-2.5 py-0.5",
        "text-xs font-medium",
        "whitespace-nowrap",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

// ─── Difficulty Badge ─────────────────────────────────────────────────────────

interface DifficultyBadgeProps {
  difficulty: Difficulty;
  className?: string;
}

export function DifficultyBadge({ difficulty, className }: DifficultyBadgeProps) {
  const variantMap: Record<Difficulty, BadgeProps["variant"]> = {
    Easy:   "success",
    Medium: "warning",
    Hard:   "danger",
  };

  return (
    <Badge variant={variantMap[difficulty]} className={className}>
      {difficulty}
    </Badge>
  );
}