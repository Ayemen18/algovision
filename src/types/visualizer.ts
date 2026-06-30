// ─── Core visualization types ──────────────────────────────────────────────────

export interface VizVariable {
  name:  string;
  value: string | number | boolean | null;
  changed?: boolean;
}

export interface VizArrayState {
  id:        string;
  label:     string;
  values:    (number | string)[];
  highlight?: number[];
  success?:   number[];
  pointers?:  Record<string, number>;
}

export interface VizHashMapState {
  id:      string;
  label:   string;
  entries: [string, string | number][];
  highlightKey?: string;
}

export interface VizStackFrame {
  label:     string;
  detail?:   string;
  active?:   boolean;
}

export interface VizStackState {
  id:     string;
  label:  string;
  frames: VizStackFrame[];
}

export interface VizStep {
  stepIndex:   number;
  line:        number;
  explanation: string;
  variables?:  VizVariable[];
  array?:      VizArrayState[];
  hashmap?:    VizHashMapState[];
  stack?:      VizStackState;
  kind?: "normal" | "compare" | "success" | "error";
}

export interface VizTrace {
  problemSlug: string;
  language:    string;
  code:        string[];
  steps:       VizStep[];
  complexity: {
    time:    string;
    space:   string;
    timeExplanation:  string;
    spaceExplanation: string;
  };
}