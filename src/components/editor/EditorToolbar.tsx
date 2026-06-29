"use client";

import Link from "next/link";
import { useEditorStore } from "@/store/editorStore";
import { LanguageSelector } from "./LanguageSelector";

interface EditorToolbarProps {
  slug:        string;
  title:       string;
  starterCode: string;
}

export function EditorToolbar({ slug, title, starterCode }: EditorToolbarProps) {
  const { fontSize, setFontSize, resetCode, saveCode } = useEditorStore();

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "10px 16px",
      background: "#0f0f16",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      gap: 12, flexShrink: 0,
    }}>
      {/* Left: breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
        <Link href={`/problems/${slug}`} style={{ fontSize: 12, color: "#555570", textDecoration: "none", flexShrink: 0 }}>
          ← {title}
        </Link>
        <span style={{ color: "#3a3a50", fontSize: 12, flexShrink: 0 }}>/</span>
        <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: "#555570", flexShrink: 0 }}>
          solution
        </span>
      </div>

      {/* Right: controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
        {/* Font size */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button
            onClick={() => setFontSize(Math.max(10, fontSize - 1))}
            style={{ width: 24, height: 24, borderRadius: 6, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#9898b0", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}
          >−</button>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "#555570", minWidth: 24, textAlign: "center" }}>
            {fontSize}
          </span>
          <button
            onClick={() => setFontSize(Math.min(22, fontSize + 1))}
            style={{ width: 24, height: 24, borderRadius: 6, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#9898b0", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}
          >+</button>
        </div>

        {/* Language */}
        <LanguageSelector />

        {/* Reset */}
        <button
          onClick={() => { if (confirm("Reset to starter code?")) resetCode(starterCode); }}
          title="Reset to starter code"
          style={{ padding: "6px 10px", borderRadius: 8, background: "transparent", border: "1px solid rgba(255,255,255,0.08)", color: "#555570", cursor: "pointer", fontSize: 12, transition: "all 0.15s" }}
          onMouseEnter={e => { (e.currentTarget.style.color = "#fb7185"); (e.currentTarget.style.borderColor = "rgba(251,113,133,0.3)"); }}
          onMouseLeave={e => { (e.currentTarget.style.color = "#555570"); (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"); }}
        >
          Reset
        </button>

        {/* Save indicator */}
        <button
          onClick={() => saveCode(slug)}
          style={{ padding: "6px 12px", borderRadius: 8, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", color: "#818cf8", cursor: "pointer", fontSize: 12, fontWeight: 600, transition: "all 0.15s", fontFamily: "'Cabinet Grotesk',sans-serif" }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(99,102,241,0.2)")}
          onMouseLeave={e => (e.currentTarget.style.background = "rgba(99,102,241,0.1)")}
        >
          Save
        </button>
      </div>
    </div>
  );
}