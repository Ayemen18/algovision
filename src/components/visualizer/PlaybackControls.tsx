"use client";

import { useEffect, useRef } from "react";
import { useVisualizerStore } from "@/store/visualizerStore";

export function PlaybackControls() {
  const {
    trace, currentStep, isPlaying, speed,
    nextStep, prevStep, togglePlay, goToStep, setSpeed,
  } = useVisualizerStore();

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-advance when playing
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        nextStep();
      }, speed);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, speed, nextStep]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === "Space")      { e.preventDefault(); togglePlay(); }
      if (e.code === "ArrowRight") { e.preventDefault(); nextStep(); }
      if (e.code === "ArrowLeft")  { e.preventDefault(); prevStep(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [togglePlay, nextStep, prevStep]);

  if (!trace) return null;

  const total     = trace.steps.length;
  const progress  = ((currentStep + 1) / total) * 100;
  const isAtEnd   = currentStep === total - 1;
  const isAtStart = currentStep === 0;

  return (
    <div style={{
      padding: "16px 24px", borderTop: "1px solid rgba(255,255,255,0.06)",
      background: "#0f0f16", flexShrink: 0,
    }}>
      {/* Progress bar / scrubber */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "#555570" }}>
            Step {currentStep + 1} / {total}
          </span>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "#555570" }}>
            {Math.round(progress)}%
          </span>
        </div>
        <div
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pct  = (e.clientX - rect.left) / rect.width;
            goToStep(Math.round(pct * (total - 1)));
          }}
          style={{
            height: 6, borderRadius: 3, background: "rgba(255,255,255,0.06)",
            cursor: "pointer", position: "relative", overflow: "hidden",
          }}
        >
          <div style={{
            height: "100%", borderRadius: 3, background: "#6366f1",
            width: `${progress}%`, transition: "width 0.25s ease",
          }} />
          {/* Step markers */}
          {trace.steps.map((_, i) => (
            <div key={i} onClick={(e) => { e.stopPropagation(); goToStep(i); }} style={{
              position: "absolute", top: "50%", left: `${(i / (total - 1)) * 100}%`,
              transform: "translate(-50%, -50%)",
              width: 8, height: 8, borderRadius: "50%",
              background: i <= currentStep ? "#818cf8" : "rgba(255,255,255,0.15)",
              border: i === currentStep ? "2px solid #fff" : "none",
              cursor: "pointer", transition: "all 0.2s",
            }} />
          ))}
        </div>
      </div>

      {/* Controls row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>

        {/* Step buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={() => goToStep(0)} disabled={isAtStart} style={ctrlBtnStyle(isAtStart)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 19l-7-7 7-7M18 19l-7-7 7-7"/></svg>
          </button>
          <button onClick={prevStep} disabled={isAtStart} style={ctrlBtnStyle(isAtStart)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 19l-7-7 7-7"/></svg>
          </button>

          {/* Play/pause — primary button */}
          <button onClick={togglePlay} style={{
            width: 44, height: 44, borderRadius: "50%",
            background: "#6366f1", border: "1px solid rgba(129,140,248,0.4)",
            color: "#fff", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 20px rgba(99,102,241,0.4)",
            transition: "all 0.15s",
          }}>
            {isPlaying ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: 2 }}><path d="M8 5v14l11-7z"/></svg>
            )}
          </button>

          <button onClick={nextStep} disabled={isAtEnd} style={ctrlBtnStyle(isAtEnd)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5l7 7-7 7"/></svg>
          </button>
          <button onClick={() => goToStep(total - 1)} disabled={isAtEnd} style={ctrlBtnStyle(isAtEnd)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 5l7 7-7 7M6 5l7 7-7 7"/></svg>
          </button>
        </div>

        {/* Speed control */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: "#555570" }}>Speed</span>
          {[
            { label: "0.5x", val: 3000 },
            { label: "1x",   val: 1500 },
            { label: "2x",   val: 750  },
            { label: "4x",   val: 375  },
          ].map(s => (
            <button key={s.label} onClick={() => setSpeed(s.val)} style={{
              padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600,
              background: speed === s.val ? "rgba(99,102,241,0.2)" : "transparent",
              border: `1px solid ${speed === s.val ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.08)"}`,
              color: speed === s.val ? "#818cf8" : "#555570",
              cursor: "pointer", transition: "all 0.15s",
            }}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Keyboard hint */}
      <div style={{ textAlign: "center", marginTop: 10 }}>
        <span style={{ fontSize: 10, color: "#3a3a50" }}>
          Space to play/pause · ← → to step
        </span>
      </div>
    </div>
  );
}

function ctrlBtnStyle(disabled: boolean): React.CSSProperties {
  return {
    width: 32, height: 32, borderRadius: 8,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: disabled ? "#3a3a50" : "#9898b0",
    cursor: disabled ? "not-allowed" : "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    opacity: disabled ? 0.4 : 1,
    transition: "all 0.15s",
  };
}