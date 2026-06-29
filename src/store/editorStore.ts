import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Language = "python" | "javascript" | "typescript" | "java" | "cpp";

export const LANGUAGE_CONFIG: Record<Language, {
  label:     string;
  monacoId:  string;
  extension: string;
}> = {
  python:     { label: "Python",     monacoId: "python",     extension: ".py"  },
  javascript: { label: "JavaScript", monacoId: "javascript", extension: ".js"  },
  typescript: { label: "TypeScript", monacoId: "typescript", extension: ".ts"  },
  java:       { label: "Java",       monacoId: "java",       extension: ".java"},
  cpp:        { label: "C++",        monacoId: "cpp",        extension: ".cpp" },
};

// Map LeetCode langSlug → our Language type
export const LC_LANG_MAP: Record<string, Language> = {
  python3:    "python",
  python:     "python",
  javascript: "javascript",
  typescript: "typescript",
  java:       "java",
  cpp:        "cpp",
};

interface EditorStore {
  // Current state
  language:     Language;
  code:         string;
  fontSize:     number;

  // Per-problem code cache: { [slug:lang]: code }
  codeCache:    Record<string, string>;

  // Actions
  setLanguage:  (lang: Language) => void;
  setCode:      (code: string) => void;
  setFontSize:  (size: number) => void;
  loadCode:     (slug: string, starterCode: string) => void;
  saveCode:     (slug: string) => void;
  resetCode:    (starterCode: string) => void;
}

export const useEditorStore = create<EditorStore>()(
  persist(
    (set, get) => ({
      language:  "python",
      code:      "",
      fontSize:  14,
      codeCache: {},

      setLanguage: (language) => set({ language }),
      setCode:     (code)     => set({ code }),
      setFontSize: (fontSize) => set({ fontSize }),

      loadCode: (slug, starterCode) => {
        const { language, codeCache } = get();
        const cacheKey = `${slug}:${language}`;
        const cached   = codeCache[cacheKey];
        set({ code: cached || starterCode });
      },

      saveCode: (slug) => {
        const { language, code, codeCache } = get();
        const cacheKey = `${slug}:${language}`;
        set({ codeCache: { ...codeCache, [cacheKey]: code } });
      },

      resetCode: (starterCode) => set({ code: starterCode }),
    }),
    {
      name:    "algovision-editor",
      // Only persist language preference and code cache — not current code
      partialize: (s) => ({
        language:  s.language,
        fontSize:  s.fontSize,
        codeCache: s.codeCache,
      }),
    }
  )
);