import type { Config } from "tailwindcss";

const config: Config = {
  // Only scan files that actually use Tailwind classes
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  // Dark mode via class (we'll toggle this programmatically)
  darkMode: "class",

  theme: {
    extend: {
      // ─── Custom font families ──────────────────────────────────────────
      fontFamily: {
        // Display / headings — sharp, technical, memorable
        display: ["var(--font-display)", "sans-serif"],
        // Body — clean, readable
        sans: ["var(--font-sans)", "sans-serif"],
        // Code — monospace for the editor & code snippets
        mono: ["var(--font-mono)", "monospace"],
      },

      // ─── Design token colors ───────────────────────────────────────────
      colors: {
        // Brand colors — deep space aesthetic
        brand: {
          50: "#f0f4ff",
          100: "#e0e9ff",
          200: "#c7d7fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",   // Primary accent
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
          950: "#1e1b4b",
        },
        // Neon accent — for highlights, active states
        neon: {
          green:  "#00ff88",
          blue:   "#00d4ff",
          purple: "#bf5af2",
          orange: "#ff9f0a",
        },
        // Surface colors — dark theme
        surface: {
          base:    "#0a0a0f",   // Deepest background
          raised:  "#111118",   // Cards
          overlay: "#1a1a24",   // Modals, dropdowns
          border:  "#2a2a3d",   // Borders
          muted:   "#3a3a50",   // Muted borders
        },
        // Text hierarchy
        text: {
          primary:   "#f1f1f5",
          secondary: "#9898b0",
          muted:     "#555570",
          inverse:   "#0a0a0f",
        },
        // Semantic colors
        success: {
          DEFAULT: "#22c55e",
          bg: "#052e16",
        },
        warning: {
          DEFAULT: "#f59e0b",
          bg: "#1c1500",
        },
        error: {
          DEFAULT: "#ef4444",
          bg: "#2d0a0a",
        },
        info: {
          DEFAULT: "#3b82f6",
          bg: "#0c1d3d",
        },
      },

      // ─── Spacing additions ─────────────────────────────────────────────
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
      },

      // ─── Border radius ─────────────────────────────────────────────────
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },

      // ─── Typography scale ──────────────────────────────────────────────
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
      },

      // ─── Box shadows ───────────────────────────────────────────────────
      boxShadow: {
        "glow-sm":     "0 0 12px rgba(99, 102, 241, 0.3)",
        "glow-md":     "0 0 24px rgba(99, 102, 241, 0.4)",
        "glow-lg":     "0 0 48px rgba(99, 102, 241, 0.5)",
        "glow-neon":   "0 0 20px rgba(0, 255, 136, 0.4)",
        "card":        "0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)",
        "card-hover":  "0 4px 24px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.3)",
      },

      // ─── Animation ─────────────────────────────────────────────────────
      keyframes: {
        "fade-in": {
          "0%":   { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-up": {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0.5" },
        },
        "spin-slow": {
          "0%":   { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "fade-in":      "fade-in 0.3s ease-out",
        "fade-in-up":   "fade-in-up 0.5s ease-out",
        "fade-in-slow": "fade-in 0.6s ease-out",
        shimmer:        "shimmer 2s linear infinite",
        "pulse-slow":   "pulse 3s ease-in-out infinite",
        "spin-slow":    "spin-slow 8s linear infinite",
      },

      // ─── Background patterns ───────────────────────────────────────────
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px)",
        "dot-pattern":
          "radial-gradient(circle, rgba(99,102,241,0.15) 1px, transparent 1px)",
        "brand-gradient":
          "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)",
        "dark-gradient":
          "linear-gradient(180deg, #0a0a0f 0%, #111118 100%)",
      },
      backgroundSize: {
        "grid":  "32px 32px",
        "dots":  "24px 24px",
      },
    },
  },

  plugins: [],
};

export default config;