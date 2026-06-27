import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "neon";
type ButtonSize = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

// ─── Variant Styles ───────────────────────────────────────────────────────────

const variants: Record<ButtonVariant, string> = {
  primary: cn(
    "bg-brand-500 text-white",
    "hover:bg-brand-600",
    "shadow-glow-sm hover:shadow-glow-md",
    "border border-brand-400/30"
  ),
  secondary: cn(
    "bg-white/5 text-text-primary",
    "hover:bg-white/10",
    "border border-white/10 hover:border-white/20"
  ),
  ghost: cn(
    "bg-transparent text-text-secondary",
    "hover:bg-white/5 hover:text-text-primary",
    "border border-transparent"
  ),
  danger: cn(
    "bg-error/10 text-error",
    "hover:bg-error/20",
    "border border-error/20 hover:border-error/40"
  ),
  neon: cn(
    "bg-transparent text-neon-green",
    "hover:bg-neon-green/10",
    "border border-neon-green/30 hover:border-neon-green/60",
    "shadow-glow-neon"
  ),
};

const sizes: Record<ButtonSize, string> = {
  sm:   "h-8  px-3    text-xs  gap-1.5",
  md:   "h-10 px-4    text-sm  gap-2",
  lg:   "h-12 px-6    text-base gap-2.5",
  icon: "h-10 w-10",
};

// ─── Component ────────────────────────────────────────────────────────────────

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          // Base
          "inline-flex items-center justify-center",
          "rounded-lg font-medium",
          "transition-all duration-150",
          "select-none cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base",
          // Active press
          "active:scale-[0.97]",
          // Disabled
          "disabled:pointer-events-none disabled:opacity-40",
          // Variant + Size
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <LoadingSpinner />
            {children && <span className="opacity-70">{children}</span>}
          </>
        ) : (
          <>
            {leftIcon && <span aria-hidden>{leftIcon}</span>}
            {children}
            {rightIcon && <span aria-hidden>{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

// ─── Loading Spinner ──────────────────────────────────────────────────────────

function LoadingSpinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}