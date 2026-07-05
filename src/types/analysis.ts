// ─── Error Analysis Types ─────────────────────────────────────────────────────

export type ErrorType =
  | "wrong_logic"
  | "off_by_one"
  | "boundary_condition"
  | "infinite_loop"
  | "wrong_data_structure"
  | "recursion_error"
  | "inefficient_approach"
  | "runtime_error"
  | "correct";

export interface ErrorAnnotation {
  line:        number;
  severity:    "error" | "warning" | "info";
  message:     string;
}

export interface CodeFix {
  description: string;
  before:      string;   // the problematic code snippet
  after:       string;   // the corrected version
}

export interface AnalysisResult {
  status:       "correct" | "incorrect" | "inefficient";
  errorType:    ErrorType;

  // Core explanation — 3-part structure
  what:         string;   // What went wrong (1-2 sentences)
  why:          string;   // Why it went wrong — the conceptual gap
  how:          string;   // How to fix it — concrete direction without giving it away

  // Supporting details
  annotations:  ErrorAnnotation[];   // line-level error markers
  fix?:         CodeFix;             // before/after code snippet
  hint:         string;              // a nudge in the right direction

  // Test case that exposes the bug
  failingCase?: {
    input:    string;
    expected: string;
    got:      string;
  };

  // For inefficient but correct solutions
  complexity?: {
    current:  string;
    optimal:  string;
    note:     string;
  };
}