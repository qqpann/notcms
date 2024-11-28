"use client";
import { CheckIcon, ClipboardIcon } from "lucide-react";
import { PrismAsyncLight as SyntaxHighlighter } from "react-syntax-highlighter";
import shell from "react-syntax-highlighter/dist/esm/languages/prism/shell-session";
import tsx from "react-syntax-highlighter/dist/esm/languages/prism/tsx";
import ts from "react-syntax-highlighter/dist/esm/languages/prism/typescript";
import style from "react-syntax-highlighter/dist/esm/styles/prism/nord";

import { Button } from "./ui/button";

SyntaxHighlighter.registerLanguage("typescript", ts);
SyntaxHighlighter.registerLanguage("tsx", tsx);
SyntaxHighlighter.registerLanguage("shell", shell);

interface CodeBlockProps {
  language: "tsx" | "typescript" | "shell";
  content: string;
}
export function CodeBlock({ language, content }: CodeBlockProps) {
  return (
    <div className="relative shiki">
      <SyntaxHighlighter language={language} style={style} wrapLongLines>
        {content}
      </SyntaxHighlighter>
    </div>
  );
}
