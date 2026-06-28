"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Zap } from "lucide-react";

const NAV_LINKS = [
  { label: "Problems",   href: "/problems"  },
  { label: "Visualizer", href: "/visualize" },
  { label: "Revision",   href: "/revision"  },
  { label: "Insights",   href: "/insights"  },
];

export function Navbar() {
  const [scrolled,     setScrolled]     = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`
          fixed top-0 left-0 right-0 z-50
          transition-all duration-300
          ${scrolled
            ? "bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/[0.06] py-3"
            : "bg-transparent py-5"
          }
        `}
      >
        <nav className="mx-auto max-w-7xl px-6 flex items-center justify-between">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative h-8 w-8 flex items-center justify-center">
              <div className="absolute inset-0 rounded-lg bg-indigo-500 opacity-20 group-hover:opacity-40 transition-opacity duration-300 blur-sm" />
              <div className="relative h-8 w-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-[0_0_16px_rgba(99,102,241,0.5)]">
                <Zap className="h-4 w-4 text-white fill-white" />
              </div>
            </div>
            <span className="font-display text-[17px] font-bold tracking-tight text-white">
              Algo<span className="text-indigo-400">Vision</span>
            </span>
          </Link>

          {/* ── Desktop links ── */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="
                  px-4 py-2 rounded-lg
                  text-sm font-medium text-[#9898b0]
                  hover:text-white hover:bg-white/[0.06]
                  transition-all duration-150
                "
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* ── Desktop CTAs ── */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/sign-in"
              className="
                px-4 py-2 rounded-lg text-sm font-medium
                text-[#9898b0] hover:text-white
                transition-colors duration-150
              "
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="
                px-4 py-2 rounded-lg text-sm font-semibold
                bg-indigo-500 text-white
                hover:bg-indigo-400
                shadow-[0_0_20px_rgba(99,102,241,0.35)]
                hover:shadow-[0_0_28px_rgba(99,102,241,0.55)]
                transition-all duration-200
                border border-indigo-400/30
              "
            >
              Get started
            </Link>
          </div>

          {/* ── Mobile hamburger ── */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-[#9898b0] hover:text-white hover:bg-white/[0.06] transition-all"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
      </header>

      {/* ── Mobile menu ── */}
      <div
        className={`
          fixed inset-x-0 top-0 z-40 pt-20
          bg-[#0a0a0f]/95 backdrop-blur-xl
          border-b border-white/[0.06]
          transition-all duration-300 ease-in-out
          md:hidden
          ${mobileOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}
        `}
      >
        <div className="px-6 pb-6 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="
                px-4 py-3 rounded-lg text-sm font-medium
                text-[#9898b0] hover:text-white hover:bg-white/[0.06]
                transition-all duration-150
              "
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-3 pt-3 border-t border-white/[0.06] flex flex-col gap-2">
            <Link
              href="/sign-in"
              className="px-4 py-3 rounded-lg text-sm font-medium text-[#9898b0] hover:text-white hover:bg-white/[0.06] transition-all"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="px-4 py-3 rounded-lg text-sm font-semibold text-center bg-indigo-500 text-white hover:bg-indigo-400 transition-all shadow-[0_0_20px_rgba(99,102,241,0.35)]"
            >
              Get started free
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}