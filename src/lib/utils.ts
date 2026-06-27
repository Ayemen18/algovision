import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * cn() — merge Tailwind classes intelligently.
 * Resolves conflicts (e.g. p-2 + p-4 → p-4, not both).
 *
 * Usage:
 *   cn("px-4 py-2", isActive && "bg-brand-500", className)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Sleep helper for animations / fake loading states in dev
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Capitalize first letter
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Format a difficulty level to a consistent string
 */
export function formatDifficulty(
  difficulty: "Easy" | "Medium" | "Hard"
): string {
  return capitalize(difficulty);
}

/**
 * Truncate text to a max length with ellipsis
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength).trimEnd() + "…";
}

/**
 * Format a number with commas (e.g. 1234567 → "1,234,567")
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

/**
 * Get initials from a full name (e.g. "John Doe" → "JD")
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Generate a consistent color class from a string (for avatars, tags, etc.)
 */
export function stringToColor(str: string): string {
  const colors = [
    "bg-brand-500",
    "bg-purple-500",
    "bg-cyan-500",
    "bg-emerald-500",
    "bg-orange-500",
    "bg-rose-500",
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}