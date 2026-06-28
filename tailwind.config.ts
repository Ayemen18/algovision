import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ["Cabinet Grotesk", "sans-serif"],
        mono:    ["DM Mono", "monospace"],
      },
      colors: {
        brand: {
          DEFAULT: "#6366f1",
          light:   "#818cf8",
          dark:    "#4338ca",
        },
        surface: {
          base:    "#0a0a0f",
          raised:  "#111118",
          overlay: "#1a1a24",
        },
        neon: {
          green:  "#00ff88",
          blue:   "#00d4ff",
          purple: "#bf5af2",
        },
      },
      animation: {
        "fade-in":  "fade-in 0.5s ease-out both",
        float:      "float 4s ease-in-out infinite",
        shimmer:    "shimmer 2s ease-in-out infinite",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to:   { opacity: "1", transform: "translateY(0)"    },
        },
        float: {
          "0%,100%": { transform: "translateY(0)"    },
          "50%":     { transform: "translateY(-10px)"},
        },
        shimmer: {
          "0%,100%": { opacity: "0.4" },
          "50%":     { opacity: "1"   },
        },
      },
    },
  },
  plugins: [],
};

export default config;