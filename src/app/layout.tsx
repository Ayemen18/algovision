import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

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
};

export const viewport: Viewport = {
  themeColor:   "#0a0a0f",
  width:        "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          // Match AlgoVision's dark design system
          colorPrimary:            "#6366f1",
          colorBackground:         "#111118",
          colorText:               "#f1f1f5",
          colorTextSecondary:      "#9898b0",
          colorNeutral:            "#9898b0",
          borderRadius:            "0.75rem",
          fontFamily:              "'Cabinet Grotesk', sans-serif",
        },
        elements: {
          // Card wrapper
          card: {
            background:   "#111118",
            border:       "1px solid rgba(255,255,255,0.08)",
            boxShadow:    "0 0 80px rgba(99,102,241,0.1)",
            borderRadius: "1rem",
          },
          // Header
          headerTitle: {
            color:      "#f1f1f5",
            fontWeight: "800",
          },
          headerSubtitle: { color: "#9898b0" },
          // Social buttons (Google, GitHub)
          socialButtonsBlockButton: {
            background:   "#1a1a24",
            border:       "1px solid rgba(255,255,255,0.08)",
            color:        "#f1f1f5",
            borderRadius: "0.75rem",
          },
          socialButtonsBlockButton__hover: {
            background: "rgba(255,255,255,0.06)",
          },
          // Divider
          dividerLine:  { background: "rgba(255,255,255,0.08)" },
          dividerText:  { color: "#555570" },
          // Form inputs
          formFieldInput: {
            background:   "#1a1a24",
            border:       "1px solid rgba(255,255,255,0.08)",
            color:        "#f1f1f5",
            borderRadius: "0.75rem",
          },
          formFieldLabel:   { color: "#9898b0" },
          formFieldHintText:{ color: "#555570" },
          // Submit button
          formButtonPrimary: {
            background:   "#6366f1",
            borderRadius: "0.75rem",
            fontWeight:   "700",
            boxShadow:    "0 0 20px rgba(99,102,241,0.4)",
          },
          // Footer links
          footerActionLink: { color: "#818cf8" },
          identityPreviewText:  { color: "#f1f1f5" },
          identityPreviewEditButton: { color: "#818cf8" },
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body style={{
          backgroundColor: "#0a0a0f",
          color: "#f1f1f5",
          fontFamily: "'Cabinet Grotesk', sans-serif",
          overflowX: "hidden",
        }}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}