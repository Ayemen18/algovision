// ─── App Metadata ─────────────────────────────────────────────────────────────

export const APP_NAME = "AlgoVision";
export const APP_DESCRIPTION =
  "AI-powered algorithm learning platform with interactive visualizations. Master DSA for coding interviews.";
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// ─── Navigation ───────────────────────────────────────────────────────────────

export const NAV_LINKS = [
  { label: "Problems", href: "/problems" },
  { label: "Visualizer", href: "/visualize" },
  { label: "Revision", href: "/revision" },
  { label: "Insights", href: "/insights" },
] as const;

// ─── Difficulty levels ────────────────────────────────────────────────────────

export const DIFFICULTY_COLORS = {
  Easy:   "text-success bg-success/10 border-success/20",
  Medium: "text-warning bg-warning/10 border-warning/20",
  Hard:   "text-error   bg-error/10   border-error/20",
} as const;

export const DIFFICULTY_ORDER = ["Easy", "Medium", "Hard"] as const;

// ─── Programming languages ────────────────────────────────────────────────────

export const SUPPORTED_LANGUAGES = [
  { id: "python",     label: "Python",     monacoId: "python"     },
  { id: "javascript", label: "JavaScript", monacoId: "javascript" },
  { id: "typescript", label: "TypeScript", monacoId: "typescript" },
  { id: "java",       label: "Java",       monacoId: "java"       },
  { id: "cpp",        label: "C++",        monacoId: "cpp"        },
] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]["id"];

// ─── Algorithm categories ─────────────────────────────────────────────────────

export const ALGORITHM_TOPICS = [
  "Array",
  "String",
  "Hash Table",
  "Dynamic Programming",
  "Math",
  "Sorting",
  "Greedy",
  "Depth-First Search",
  "Binary Search",
  "Breadth-First Search",
  "Tree",
  "Matrix",
  "Two Pointers",
  "Bit Manipulation",
  "Stack",
  "Heap (Priority Queue)",
  "Graph",
  "Sliding Window",
  "Backtracking",
  "Linked List",
  "Trie",
  "Recursion",
  "Divide and Conquer",
  "Union Find",
] as const;

export type AlgorithmTopic = (typeof ALGORITHM_TOPICS)[number];

// ─── API Routes ───────────────────────────────────────────────────────────────

export const API_ROUTES = {
  problems:   "/api/problems",
  problem:    (slug: string) => `/api/problems/${slug}`,
  solve:      "/api/solve",
  visualize:  "/api/visualize",
  explain:    "/api/explain",
  revision:   "/api/revision",
  insights:   "/api/insights",
} as const;

// ─── Local Storage Keys ───────────────────────────────────────────────────────

export const STORAGE_KEYS = {
  language:       "algovision:preferred-language",
  editorTheme:    "algovision:editor-theme",
  fontSize:       "algovision:editor-font-size",
} as const;