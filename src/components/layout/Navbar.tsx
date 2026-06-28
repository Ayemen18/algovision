"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth, UserButton } from "@clerk/nextjs";

const NAV_LINKS = [
  { label: "Problems",   href: "/problems"  },
  { label: "Visualizer", href: "/visualize" },
  { label: "Revision",   href: "/revision"  },
  { label: "Insights",   href: "/insights"  },
];

export function Navbar() {
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isSignedIn, isLoaded }    = useAuth();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        transition: "all 0.3s",
        background:    scrolled ? "rgba(10,10,15,0.85)" : "transparent",
        backdropFilter:scrolled ? "blur(20px)" : "none",
        borderBottom:  scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
        padding:       scrolled ? "12px 0" : "20px 0",
      }}>
        <nav style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>

          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: "#6366f1", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 16px rgba(99,102,241,0.5)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            </div>
            <span style={{ fontFamily: "'Cabinet Grotesk',sans-serif", fontSize: 17, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>
              Algo<span style={{ color: "#818cf8" }}>Vision</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }} className="hidden md:flex">
            {NAV_LINKS.map(l => (
              <Link key={l.href} href={l.href} style={{ padding: "8px 16px", borderRadius: 8, fontSize: 14, fontWeight: 500, color: "#9898b0", textDecoration: "none", transition: "all 0.15s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#fff"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#9898b0"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >{l.label}</Link>
            ))}
          </div>

          {/* Desktop auth area */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }} className="hidden md:flex">
            {!isLoaded ? (
              // Loading skeleton
              <div style={{ width: 80, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.05)", animation: "pulse 2s infinite" }} />
            ) : isSignedIn ? (
              // Signed in — show dashboard link + Clerk UserButton
              <>
                <Link href="/dashboard" style={{ padding: "8px 16px", borderRadius: 8, fontSize: 14, fontWeight: 500, color: "#9898b0", textDecoration: "none", transition: "color 0.15s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#9898b0")}
                >
                  Dashboard
                </Link>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: {
                        width:  36,
                        height: 36,
                        border: "2px solid rgba(99,102,241,0.4)",
                      },
                    },
                  }}
                />
              </>
            ) : (
              // Signed out — show sign in + get started
              <>
                <Link href="/sign-in" style={{ padding: "8px 16px", fontSize: 14, fontWeight: 500, color: "#9898b0", textDecoration: "none" }}>
                  Sign in
                </Link>
                <Link href="/sign-up" style={{
                  padding: "8px 18px", borderRadius: 8, fontSize: 14, fontWeight: 600,
                  background: "#6366f1", color: "#fff", textDecoration: "none",
                  boxShadow: "0 0 20px rgba(99,102,241,0.4)",
                  border: "1px solid rgba(129,140,248,0.3)",
                  transition: "all 0.2s",
                }}>
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 8, color: "#9898b0" }}
          >
            {mobileOpen
              ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
            }
          </button>
        </nav>
      </header>

      {/* Mobile menu */}
      <div style={{
        position: "fixed", inset: "0 0 auto 0", zIndex: 40,
        paddingTop: 80,
        background: "rgba(10,10,15,0.97)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        transition: "all 0.3s",
        opacity: mobileOpen ? 1 : 0,
        transform: mobileOpen ? "translateY(0)" : "translateY(-8px)",
        pointerEvents: mobileOpen ? "auto" : "none",
      }}>
        <div style={{ padding: "0 24px 24px", display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV_LINKS.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)} style={{ padding: "12px 16px", borderRadius: 8, fontSize: 14, fontWeight: 500, color: "#9898b0", textDecoration: "none" }}>
              {l.label}
            </Link>
          ))}
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", gap: 8 }}>
            {isSignedIn ? (
              <Link href="/dashboard" style={{ padding: "12px 16px", borderRadius: 8, fontSize: 14, fontWeight: 600, background: "#6366f1", color: "#fff", textDecoration: "none", textAlign: "center" }}>
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/sign-in" style={{ padding: "12px 16px", borderRadius: 8, fontSize: 14, fontWeight: 500, color: "#9898b0", textDecoration: "none", textAlign: "center" }}>
                  Sign in
                </Link>
                <Link href="/sign-up" style={{ padding: "12px 16px", borderRadius: 8, fontSize: 14, fontWeight: 600, background: "#6366f1", color: "#fff", textDecoration: "none", textAlign: "center" }}>
                  Get started free
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}