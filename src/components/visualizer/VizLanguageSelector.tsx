"use client";

import { useState } from "react";
import type { VizLanguage } from "@/types/visualizer";

const LANGS: { id: VizLanguage; label: string }[] = [
  { id: "python",     label: "Python"     },
  { id: "javascript", label: "JavaScript" },
  { id: "typescript", label: "TypeScript" },
  { id: "java",       label: "Java"       },
  { id: "cpp",        label: "C++"        },
];

interface VizLanguageSelectorProps {
  current:    VizLanguage;
  available:  VizLanguage[];   // languages that have code ready (curated traces have all 5; AI traces have only the requested one)
  onChange:   (lang: VizLanguage) => void;
  isLoading?: boolean;
}

export function VizLanguageSelector({ current, available, onChange, isLoading }: VizLanguageSelectorProps) {
  const [open, setOpen] = useState(false);
  const currentLabel = LANGS.find(l => l.id === current)?.label || current;

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        disabled={isLoading}
        style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "6px 12px", borderRadius: 8,
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "#f1f1f5", fontSize: 13, fontWeight: 600,
          cursor: isLoading ? "wait" : "pointer",
          opacity: isLoading ? 0.6 : 1,
          fontFamily: "'Cabinet Grotesk',sans-serif",
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/></svg>
        <span>{currentLabel}</span>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#9898b0" strokeWidth="2" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>

      {open && (
        <>
          <div style={{ position: "fixed", inset: 0, zIndex: 10 }} onClick={() => setOpen(false)} />
          <div style={{
            position: "absolute", top: "calc(100% + 6px)", right: 0,
            minWidth: 170, zIndex: 20,
            background: "#1a1a24", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 10, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          }}>
            {LANGS.map(l => {
              const isAvailable = available.includes(l.id);
              const isActive    = l.id === current;
              return (
                <button
                  key={l.id}
                  disabled={!isAvailable && isActive === false && available.length > 0 && !available.includes(l.id) && false}
                  onClick={() => { onChange(l.id); setOpen(false); }}
                  style={{
                    width: "100%", padding: "10px 16px",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    background: isActive ? "rgba(99,102,241,0.15)" : "transparent",
                    border: "none", cursor: "pointer",
                    fontSize: 13, fontWeight: 500,
                    color: isActive ? "#818cf8" : "#9898b0",
                    textAlign: "left", fontFamily: "'Cabinet Grotesk',sans-serif",
                  }}
                  onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
                  onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {l.label}
                    {isAvailable && !isActive && (
                      <span style={{ fontSize: 9, color: "#00ff88" }}>●</span>
                    )}
                  </span>
                  {isActive && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                  )}
                </button>
              );
            })}
            <div style={{ padding: "8px 16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <span style={{ fontSize: 10, color: "#555570" }}>● cached · others generate via AI</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}