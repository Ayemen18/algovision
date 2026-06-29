/**
 * LeetCode GraphQL API client.
 * LeetCode exposes a public GraphQL endpoint — no auth required for problem data.
 */

const LEETCODE_API = "https://leetcode.com/graphql";

// ─── GraphQL queries ──────────────────────────────────────────────────────────

const PROBLEMS_LIST_QUERY = `
  query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
    problemsetQuestionList: questionList(
      categorySlug: $categorySlug
      limit: $limit
      skip: $skip
      filters: $filters
    ) {
      total: totalNum
      questions: data {
        acRate
        difficulty
        freqBar
        frontendQuestionId: questionFrontendId
        isFavor
        paidOnly: isPaidOnly
        status
        title
        titleSlug
        topicTags {
          name
          id
          slug
        }
        hasSolution
        hasVideoSolution
      }
    }
  }
`;

const PROBLEM_DETAIL_QUERY = `
  query questionData($titleSlug: String!) {
    question(titleSlug: $titleSlug) {
      questionId
      questionFrontendId
      title
      titleSlug
      content
      difficulty
      likes
      dislikes
      isLiked
      similarQuestions
      exampleTestcases
      topicTags {
        name
        slug
      }
      codeSnippets {
        lang
        langSlug
        code
      }
      stats
      hints
      solution {
        id
        canSeeDetail
        paidOnly
        hasVideoSolution
        paidOnlyVideo
      }
      status
      sampleTestCase
      metaData
      judgerAvailable
      judgeType
      mysqlSchemas
      enableRunCode
      enableTestMode
      enableDebugger
      envInfo
      libraryUrl
      adminUrl
      challengeQuestion {
        id
        date
        incompleteChallengeCount
        streakCount
        type
      }
      note
    }
  }
`;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LCTopicTag {
  name: string;
  slug: string;
  id?:  string;
}

export interface LCProblemListItem {
  acRate:               number;
  difficulty:           "Easy" | "Medium" | "Hard";
  frontendQuestionId:   string;
  paidOnly:             boolean;
  title:                string;
  titleSlug:            string;
  topicTags:            LCTopicTag[];
  hasSolution:          boolean;
  status:               string | null;
}

export interface LCProblemDetail {
  questionId:           string;
  questionFrontendId:   string;
  title:                string;
  titleSlug:            string;
  content:              string;   // HTML
  difficulty:           "Easy" | "Medium" | "Hard";
  likes:                number;
  dislikes:             number;
  topicTags:            LCTopicTag[];
  hints:                string[];
  exampleTestcases:     string;
  codeSnippets: {
    lang:     string;
    langSlug: string;
    code:     string;
  }[];
  stats:                string;   // JSON string
}

export interface LCProblemsResponse {
  total:     number;
  questions: LCProblemListItem[];
}

// ─── API helpers ──────────────────────────────────────────────────────────────

async function fetchLeetCode<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const res = await fetch(LEETCODE_API, {
    method: "POST",
    headers: {
      "Content-Type":   "application/json",
      "Referer":        "https://leetcode.com",
      "Origin":         "https://leetcode.com",
      "User-Agent":     "Mozilla/5.0 (compatible; AlgoVision/1.0)",
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!res.ok) {
    throw new Error(`LeetCode API error: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();

  if (json.errors) {
    throw new Error(`GraphQL error: ${json.errors[0]?.message}`);
  }

  return json.data as T;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function fetchProblems({
  limit      = 50,
  skip       = 0,
  difficulty,
  tags,
  search,
}: {
  limit?:      number;
  skip?:       number;
  difficulty?: string;
  tags?:       string[];
  search?:     string;
} = {}): Promise<LCProblemsResponse> {
  const filters: Record<string, unknown> = {};

  if (difficulty)              filters.difficulty = difficulty.toUpperCase();
  if (tags && tags.length > 0) filters.tags       = tags;
  if (search)                  filters.searchKeywords = search;

  const data = await fetchLeetCode<{
    problemsetQuestionList: LCProblemsResponse;
  }>(PROBLEMS_LIST_QUERY, {
    categorySlug: "all-code-essentials",
    limit,
    skip,
    filters,
  });

  return data.problemsetQuestionList;
}

export async function fetchProblemDetail(titleSlug: string): Promise<LCProblemDetail> {
  const data = await fetchLeetCode<{ question: LCProblemDetail }>(
    PROBLEM_DETAIL_QUERY,
    { titleSlug }
  );
  return data.question;
}