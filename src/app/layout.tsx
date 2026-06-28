import type { Metadata, Viewport } from "next";
import { DM_Mono } from "next/font/google";
import "./globals.css";

// Cabinet Grotesk via @import in globals.css (Google Fonts CDN)
// DM Mono via next/font for performance
const dmMono = DM_Mono({
  subsets:  ["latin"],
  variable: "--font-mono",
  weight:   ["300", "400", "500"],
  display:  "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://algovision-alpha.vercel.app"
  ),
  title: {
    default:  "AlgoVision — AI Algorithm Learning",
    template: "%s · AlgoVision",
  },
  description:
    "Stop memorizing. Start understanding. AlgoVision visualizes algorithm execution step-by-step with AI-powered explanations, error analysis, and personalized revision.",
  keywords: [
    "algorithm visualization", "DSA", "leetcode", "coding interview",
    "data structures", "AI learning", "interactive coding",
  ],
  openGraph: {
    type:        "website",
    locale:      "en_US",
    url:         "https://algovision-alpha.vercel.app",
    title:       "AlgoVision — AI Algorithm Learning",
    description: "Stop memorizing. Start understanding.",
    siteName:    "AlgoVision",
  },
  twitter: {
    card:        "summary_large_image",
    title:       "AlgoVision",
    description: "AI-powered algorithm learning with interactive visualization.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor:   "#0a0a0f",
  width:        "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={dmMono.variable} suppressHydrationWarning>
      <body className="bg-[#0a0a0f] text-white antialiased font-display">
        {children}
      </body>
    </html>
  );
}