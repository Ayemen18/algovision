// ─── Problem Types ─────────────────────────────────────────────────────────────

export type Difficulty = "Easy" | "Medium" | "Hard";

export interface Problem {
  id: string;
  titleSlug: string;
  title: string;
  difficulty: Difficulty;
  topics: string[];
  content: string;           // HTML problem description
  examples: Example[];
  constraints: string[];
  hints?: string[];
  acceptanceRate?: number;
  totalSubmissions?: number;
}

export interface Example {
  input: string;
  output: string;
  explanation?: string;
}

// ─── Solution Types ────────────────────────────────────────────────────────────

export type Language = "python" | "javascript" | "typescript" | "java" | "cpp";

export interface Solution {
  id: string;
  problemId: string;
  userId: string;
  code: string;
  language: Language;
  status: SolutionStatus;
  runtime?: number;           // ms
  memory?: number;            // MB
  submittedAt: Date;
}

export type SolutionStatus =
  | "accepted"
  | "wrong_answer"
  | "time_limit_exceeded"
  | "runtime_error"
  | "compile_error";

// ─── Visualization Types ───────────────────────────────────────────────────────

export interface ExecutionStep {
  stepIndex: number;
  lineNumber: number;
  variables: Record<string, unknown>;
  arrays?: ArrayState[];
  hashmaps?: HashmapState[];
  stack?: StackState;
  explanation: string;
  highlight?: number[];       // array indices to highlight
}

export interface ArrayState {
  name: string;
  values: (number | string | null)[];
  pointers?: Record<string, number>;  // pointer name → index
}

export interface HashmapState {
  name: string;
  entries: [string, unknown][];
}

export interface StackState {
  name: string;
  frames: string[];
}

export interface VisualizationData {
  steps: ExecutionStep[];
  totalSteps: number;
  complexity: ComplexityAnalysis;
}

// ─── Complexity Types ──────────────────────────────────────────────────────────

export interface ComplexityAnalysis {
  time: string;              // e.g. "O(n log n)"
  space: string;             // e.g. "O(n)"
  timeExplanation: string;
  spaceExplanation: string;
}

// ─── Error Analysis Types ──────────────────────────────────────────────────────

export interface ErrorAnalysis {
  type: ErrorType;
  line?: number;
  description: string;
  explanation: string;
  suggestion: string;
}

export type ErrorType =
  | "wrong_logic"
  | "off_by_one"
  | "boundary_condition"
  | "infinite_loop"
  | "wrong_data_structure"
  | "recursion_error"
  | "inefficient_approach"
  | "runtime_error";

// ─── User Types ────────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  clerkId: string;
  username: string;
  email: string;
  avatarUrl?: string;
  leetcodeUsername?: string;
  createdAt: Date;
  stats: UserStats;
}

export interface UserStats {
  solved: number;
  attempted: number;
  streak: number;
  lastActive: Date;
  byDifficulty: {
    easy:   number;
    medium: number;
    hard:   number;
  };
  weakTopics:   string[];
  strongTopics: string[];
}

// ─── Revision Types ────────────────────────────────────────────────────────────

export interface RevisionItem {
  problemId: string;
  problem: Problem;
  lastSolvedAt: Date;
  nextReviewAt: Date;
  interval: number;          // days
  easeFactor: number;        // spaced repetition multiplier
  repetitions: number;
}

// ─── API Response Types ────────────────────────────────────────────────────────

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: string;
  code?: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;