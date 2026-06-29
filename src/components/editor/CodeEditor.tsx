"use client";

import { useRef, useEffect } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import { useEditorStore, LANGUAGE_CONFIG } from "@/store/editorStore";

interface CodeEditorProps {
  slug:        string;
  starterCode: string;
}

export function CodeEditor({ slug, starterCode }: CodeEditorProps) {
  const { language, code, fontSize, setCode, loadCode, saveCode } = useEditorStore();
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);

  // Load code for this problem + language
  useEffect(() => {
    loadCode(slug, starterCode);
  }, [slug, language, starterCode, loadCode]);

  // Auto-save every 2s
  useEffect(() => {
    const t = setTimeout(() => saveCode(slug), 2000);
    return () => clearTimeout(t);
  }, [code, slug, saveCode]);

  const handleMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // AlgoVision dark theme
    monaco.editor.defineTheme("algovision-dark", {
      base:    "vs-dark",
      inherit: true,
      rules: [
        { token: "comment",         foreground: "555570", fontStyle: "italic" },
        { token: "keyword",         foreground: "818cf8"  },
        { token: "string",          foreground: "86efac"  },
        { token: "number",          foreground: "fb923c"  },
        { token: "type",            foreground: "67e8f9"  },
        { token: "function",        foreground: "c084fc"  },
        { token: "variable",        foreground: "f1f1f5"  },
        { token: "operator",        foreground: "818cf8"  },
      ],
      colors: {
        "editor.background":            "#0f0f16",
        "editor.foreground":            "#f1f1f5",
        "editor.lineHighlightBackground":"#1a1a2a",
        "editor.selectionBackground":   "#6366f140",
        "editorCursor.foreground":      "#818cf8",
        "editorLineNumber.foreground":  "#3a3a50",
        "editorLineNumber.activeForeground": "#818cf8",
        "editor.findMatchBackground":   "#6366f140",
        "editor.findMatchHighlightBackground": "#6366f120",
        "editorIndentGuide.background1":"#2a2a3d",
        "editorIndentGuide.activeBackground1": "#6366f150",
        "scrollbarSlider.background":   "#2a2a3d80",
        "scrollbarSlider.hoverBackground": "#3a3a5080",
      },
    });

    monaco.editor.setTheme("algovision-dark");

    // Key binding: Ctrl+S / Cmd+S → save
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
      () => saveCode(slug)
    );
  };

  const monacoLanguage = LANGUAGE_CONFIG[language].monacoId;

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Editor
        height="100%"
        language={monacoLanguage}
        value={code}
        onChange={(val) => setCode(val || "")}
        onMount={handleMount}
        theme="algovision-dark"
        options={{
          fontSize,
          fontFamily:             "'DM Mono', 'Fira Code', monospace",
          fontLigatures:          true,
          lineHeight:             1.7,
          padding:                { top: 20, bottom: 20 },
          minimap:                { enabled: false },
          scrollBeyondLastLine:   false,
          wordWrap:               "on",
          tabSize:                4,
          automaticLayout:        true,
          smoothScrolling:        true,
          cursorBlinking:         "smooth",
          cursorSmoothCaretAnimation: "on",
          renderLineHighlight:    "line",
          bracketPairColorization:{ enabled: true },
          guides:                 { bracketPairs: true, indentation: true },
          suggest:                { showKeywords: true, showSnippets: true },
          quickSuggestions:       true,
          formatOnPaste:          true,
          scrollbar: {
            verticalScrollbarSize:   6,
            horizontalScrollbarSize: 6,
          },
        }}
        loading={
          <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f0f16" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <div style={{ width: 32, height: 32, border: "2px solid rgba(99,102,241,0.3)", borderTopColor: "#6366f1", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
              <span style={{ fontSize: 13, color: "#555570" }}>Loading editor...</span>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        }
      />
    </div>
  );
}