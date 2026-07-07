// ─── User Progress Types ──────────────────────────────────────────────────────

export type SolveStatus = "attempted" | "solved" | "reviewed";

export interface ProblemAttempt {
  _id?:        string;
  userId:      string;           // Clerk user ID
  slug:        string;           // LeetCode titleSlug
  title:       string;
  difficulty:  "Easy" | "Medium" | "Hard";
  topics:      string[];

  status:      SolveStatus;
  language:    string;
  attempts:    number;

  // Analysis results
  analysisStatus?: "correct" | "incorrect" | "inefficient";
  errorType?:      string;

  // Timestamps
  firstAttemptAt:  Date;
  lastAttemptAt:   Date;
  solvedAt?:       Date;
}

// ─── Spaced Repetition (SM-2 algorithm) ──────────────────────────────────────

export interface RevisionItem {
  _id?:        string;
  userId:      string;
  slug:        string;
  title:       string;
  difficulty:  "Easy" | "Medium" | "Hard";
  topics:      string[];

  // SM-2 fields
  interval:    number;           // days until next review
  repetitions: number;           // successful reviews in a row
  easeFactor:  number;           // 2.5 by default, adjusted by performance
  nextReviewAt: Date;
  lastReviewAt?: Date;
}

/**
 * SM-2 spaced repetition algorithm.
 * quality: 0-5 (0=complete blackout, 5=perfect recall)
 */
export function sm2(
  item: Pick<RevisionItem, "interval" | "repetitions" | "easeFactor">,
  quality: number
): Pick<RevisionItem, "interval" | "repetitions" | "easeFactor"> {
  let { interval, repetitions, easeFactor } = item;

  if (quality >= 3) {
    // Correct recall
    if (repetitions === 0)      interval = 1;
    else if (repetitions === 1) interval = 6;
    else                        interval = Math.round(interval * easeFactor);
    repetitions += 1;
  } else {
    // Incorrect — reset
    repetitions = 0;
    interval    = 1;
  }

  // Update ease factor (min 1.3)
  easeFactor = Math.max(
    1.3,
    easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)
  );

  return { interval, repetitions, easeFactor };
}

// ─── User Stats ───────────────────────────────────────────────────────────────

export interface UserStats {
  totalSolved:    number;
  totalAttempted: number;
  streak:         number;
  lastActiveDate: string;   // ISO date string
  byDifficulty: {
    easy:   number;
    medium: number;
    hard:   number;
  };
  recentTopics:  string[];
  weakTopics:    string[];
  dueForReview:  number;
}