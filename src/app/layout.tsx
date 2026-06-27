import type { Metadata, Viewport } from "next";

import { fontDisplay, fontMono, fontVariables } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { APP_DESCRIPTION, APP_NAME, APP_URL } from "@/lib/constants";

import "./globals.css";

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),

  title: {
    default: APP_NAME,
    template: `%s — ${APP_NAME}`,
  },

  description: APP_DESCRIPTION,

  keywords: [
    "algorithm visualization",
    "data structures",
    "coding interview",
    "leetcode",
    "DSA practice",
    "AI learning",
    "interactive coding",
  ],

  authors: [{ name: APP_NAME }],

  openGraph: {
    type: "website",
    locale: "en_US",
    url: APP_URL,
    title: APP_NAME,
    description: APP_DESCRIPTION,
    siteName: APP_NAME,
  },

  twitter: {
    card: "summary_large_image",
    title: APP_NAME,
    description: APP_DESCRIPTION,
  },

  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
  width: "device-width",
  initialScale: 1,
};

// ─── Root Layout ──────────────────────────────────────────────────────────────

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className="dark"
      suppressHydrationWarning
    >
      <body
        className={cn(
          fontVariables,
          "font-sans antialiased",
          "bg-surface-base text-text-primary",
          "min-h-screen"
        )}
      >
        {/* 
          Future phases will wrap children with:
          <ClerkProvider>       ← Phase 2 (auth)
          <ThemeProvider>       ← Phase 2
          <QueryClientProvider> ← Phase 3 (data fetching)
          For now, children render directly.
        */}
        {children}
      </body>
    </html>
  );
}