"use client";

type SubmitState = "idle" | "loading" | "done" | "error";

interface SubmitButtonProps {
  state:    SubmitState;
  onSubmit: () => void;
}

const STATE_CONFIG = {
  idle: {
    label:  "Submit solution",
    bg:     "rgba(0,255,136,0.12)",
    border: "rgba(0,255,136,0.3)",
    color:  "#00ff88",
    shadow: "0 0 16px rgba(0,255,136,0.2)",
  },
  loading: {
    label:  "Analyzing...",
    bg:     "rgba(99,102,241,0.12)",
    border: "rgba(99,102,241,0.3)",
    color:  "#818cf8",
    shadow: "none",
  },
  done: {
    label:  "Re-analyze",
    bg:     "rgba(0,212,255,0.1)",
    border: "rgba(0,212,255,0.25)",
    color:  "#00d4ff",
    shadow: "none",
  },
  error: {
    label:  "Retry",
    bg:     "rgba(251,113,133,0.1)",
    border: "rgba(251,113,133,0.25)",
    color:  "#fb7185",
    shadow: "none",
  },
};

export function SubmitButton({ state, onSubmit }: SubmitButtonProps) {
  const cfg = STATE_CONFIG[state];

  return (
    <button
      onClick={onSubmit}
      disabled={state === "loading"}
      style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "8px 18px", borderRadius: 8,
        fontSize: 13, fontWeight: 700,
        background:   cfg.bg,
        border:       `1px solid ${cfg.border}`,
        color:        cfg.color,
        cursor:       state === "loading" ? "wait" : "pointer",
        transition:   "all 0.2s",
        boxShadow:    cfg.shadow,
        fontFamily:   "'Cabinet Grotesk',sans-serif",
        whiteSpace:   "nowrap",
      }}
    >
      {state === "loading" ? (
        <>
          <div style={{
            width: 14, height: 14, border: "2px solid rgba(129,140,248,0.3)",
            borderTopColor: "#818cf8", borderRadius: "50%",
            animation: "spin 0.7s linear infinite",
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          {cfg.label}
        </>
      ) : (
        <>
          {state === "done"  && <span style={{ fontSize: 14 }}>↺</span>}
          {state === "error" && <span style={{ fontSize: 14 }}>!</span>}
          {state === "idle"  && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          )}
          {cfg.label}
        </>
      )}
    </button>
  );
}