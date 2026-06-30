"use client";

import { useEffect, useRef } from "react";
import { useVisualizerStore } from "@/store/visualizerStore";

const KIND_DOT_COLOR: Record<string, string> = {
  normal: "#818cf8", compare: "#fbbf24", success: "#4ade80", error: "#fb7185",
};

export function PlaybackControls() {
  const {
    trace, currentStep, isPlaying, speed,
    nextStep, prevStep, togglePlay, goToStep, setSpeed,
  } = useVisualizerStore();

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => { nextStep(); }, speed);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, speed, nextStep]);

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
    <div style={{ padding: "16px 24px", borderTop: "1px solid rgba(255,255,255,0.06)", background: "#0c0c12", flexShrink: 0 }}>

      {/* Progress bar / scrubber */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "#666680" }}>
            Step {currentStep + 1} / {total}
          </span>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "#666680" }}>
            {Math.round(progress)}%
          </span>
        </div>

        <div style={{ position: "relative", height: 20, display: "flex", alignItems: "center" }}>
          {/* Track */}
          <div
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pct  = (e.clientX - rect.left) / rect.width;
              goToStep(Math.round(pct * (total - 1)));
            }}
            style={{
              position: "absolute", left: 0, right: 0, height: 5, borderRadius: 3,
              background: "rgba(255,255,255,0.06)", cursor: "pointer",
            }}
          >
            <div style={{
              height: "100%", borderRadius: 3, background: "linear-gradient(90deg, #6366f1, #818cf8)",
              width: `${progress}%`, transition: "width 0.25s ease",
            }} />
          </div>

          {/* Step markers — positioned absolutely, color-coded by step kind */}
          {trace.steps.map((s, i) => {
            const leftPct = total === 1 ? 0 : (i / (total - 1)) * 100;
            const isDone  = i <= currentStep;
            const isNow   = i === currentStep;
            const dotColor = isDone ? (KIND_DOT_COLOR[s.kind || "normal"] || "#818cf8") : "rgba(255,255,255,0.15)";
            return (
              <div
                key={i}
                onClick={() => goToStep(i)}
                title={s.explanation.slice(0, 40)}
                style={{
                  position: "absolute", left: `${leftPct}%`, top: "50%",
                  transform: "translate(-50%, -50%)",
                  width: isNow ? 12 : 8, height: isNow ? 12 : 8,
                  borderRadius: "50%", background: dotColor,
                  border: isNow ? "2px solid #fff" : "none",
                  boxShadow: isNow ? `0 0 10px ${dotColor}` : "none",
                  cursor: "pointer", transition: "all 0.2s ease",
                  zIndex: isNow ? 3 : 2,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Controls row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={() => goToStep(0)} disabled={isAtStart} style={ctrlBtnStyle(isAtStart)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 19l-7-7 7-7M18 19l-7-7 7-7"/></svg>
          </button>
          <button onClick={prevStep} disabled={isAtStart} style={ctrlBtnStyle(isAtStart)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 19l-7-7 7-7"/></svg>
          </button>

          <button onClick={togglePlay} style={{
            width: 46, height: 46, borderRadius: "50%",
            background: "linear-gradient(145deg, #6366f1, #4f46e5)",
            border: "1px solid rgba(129,140,248,0.5)", color: "#fff", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 24px rgba(99,102,241,0.45), inset 0 1px 0 rgba(255,255,255,0.15)",
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

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: "#666680" }}>Speed</span>
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
              color: speed === s.val ? "#a5b4fc" : "#666680",
              cursor: "pointer", transition: "all 0.15s",
            }}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: 10 }}>
        <span style={{ fontSize: 10, color: "#34344a" }}>Space to play/pause · ← → to step</span>
      </div>
    </div>
  );
}

function ctrlBtnStyle(disabled: boolean): React.CSSProperties {
  return {
    width: 32, height: 32, borderRadius: 8,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: disabled ? "#34344a" : "#9898b0",
    cursor: disabled ? "not-allowed" : "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    opacity: disabled ? 0.4 : 1,
    transition: "all 0.15s",
  };
}