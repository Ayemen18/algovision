"use client";

import { useState } from "react";
import { useEditorStore, LANGUAGE_CONFIG, type Language } from "@/store/editorStore";

export function LanguageSelector() {
  const { language, setLanguage } = useEditorStore();
  const [open, setOpen] = useState(false);

  const current = LANGUAGE_CONFIG[language];

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "6px 12px", borderRadius: 8,
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "#f1f1f5", fontSize: 13, fontWeight: 600,
          cursor: "pointer", transition: "all 0.15s",
          fontFamily: "'Cabinet Grotesk', sans-serif",
        }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)")}
        onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
      >
        <span>{current.label}</span>
        <svg
          width="12" height="12" viewBox="0 0 24 24"
          fill="none" stroke="#9898b0" strokeWidth="2"
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
        >
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            style={{ position: "fixed", inset: 0, zIndex: 10 }}
            onClick={() => setOpen(false)}
          />
          {/* Dropdown */}
          <div style={{
            position: "absolute", top: "calc(100% + 6px)", left: 0,
            minWidth: 160, zIndex: 20,
            background: "#1a1a24",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 10, overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          }}>
            {(Object.entries(LANGUAGE_CONFIG) as [Language, typeof LANGUAGE_CONFIG[Language]][]).map(([lang, cfg]) => (
              <button
                key={lang}
                onClick={() => { setLanguage(lang); setOpen(false); }}
                style={{
                  width: "100%", padding: "10px 16px",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  background: lang === language ? "rgba(99,102,241,0.15)" : "transparent",
                  border: "none", cursor: "pointer",
                  fontSize: 13, fontWeight: 500,
                  color: lang === language ? "#818cf8" : "#9898b0",
                  textAlign: "left", transition: "background 0.1s",
                  fontFamily: "'Cabinet Grotesk', sans-serif",
                }}
                onMouseEnter={e => { if (lang !== language) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
                onMouseLeave={e => { if (lang !== language) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <span>{cfg.label}</span>
                {lang === language && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2.5">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}