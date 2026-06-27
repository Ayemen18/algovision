import { DM_Mono, Outfit } from "next/font/google";

/**
 * Outfit — geometric, technical, has personality.
 * Used for headings and the brand wordmark.
 * Different from the overused Space Grotesk / Inter.
 */
export const fontDisplay = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

/**
 * DM Mono — monospace for code, editor, and technical content.
 * Clean, readable, feels at home in a dev tool.
 */
export const fontMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["300", "400", "500"],
  display: "swap",
});

/**
 * Combined class string for layout.tsx
 */
export const fontVariables = `${fontDisplay.variable} ${fontMono.variable}`;