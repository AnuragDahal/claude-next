"use client";

import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import "highlight.js/styles/github-dark.css";

interface MessageContentProps {
  content: string;
  role?: "user" | "assistant" | "system" | "data" | "tool" | "function";
}

export function MessageContent({
  content,
  role = "assistant",
}: MessageContentProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (role === "user") {
    return <div className="whitespace-pre-wrap">{content}</div>;
  }

  if (!mounted) {
    return <div className="min-h-[20px]" />;
  }

  // Pre-process content to fix common markdown formatting issues from LLMs
  const processedContent = content
    .replace(/^\s*\d+\.\s*/gm, "- ") // Convert numbering "1. " to bullets "- "
    .replace(/\n{3,}/g, "\n\n"); // Normalize excessive newlines

  return (
    <div className="prose prose-stone dark:prose-invert max-w-none break-words prose-p:leading-normal prose-pre:p-0 prose-pre:bg-transparent first:prose-p:mt-0 last:prose-p:mb-0 min-w-0 w-full prose-headings:mt-6 prose-headings:mb-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          a: ({ node, ...props }) => (
            <a
              {...props}
              className="text-primary underline underline-offset-4 hover:opacity-80 transition-opacity"
              target="_blank"
              rel="noopener noreferrer"
            />
          ),
          // Changed p to div to avoid "div cannot be a descendant of p" hydration error
          p: ({ node, ...props }) => (
            <div className="mb-3 last:mb-0 leading-normal" {...props} />
          ),
          h1: ({ node, ...props }) => (
            <h1 className="text-2xl font-semibold mb-2 mt-6" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-xl font-semibold mb-2 mt-5" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-lg font-semibold mb-2 mt-4" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul
              className="list-disc pl-5 mb-3 space-y-1"
              {...props}
            />
          ),
          ol: ({ node, ...props }) => (
            <ol
              className="list-decimal pl-5 mb-3 space-y-1"
              {...props}
            />
          ),
          li: ({ node, ...props }) => (
            <li className="leading-normal mb-1.5 last:mb-0 text-foreground" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-primary/30 pl-4 py-1 my-4 italic text-muted-foreground"
              {...props}
            />
          ),
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto mb-6 border border-border rounded-xl">
              <table className="w-full border-collapse" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead className="bg-muted/50" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th
              className="px-4 py-2 border border-border font-semibold text-left"
              {...props}
            />
          ),
          td: ({ node, ...props }) => (
            <td className="px-4 py-2 border border-border" {...props} />
          ),
          tr: ({ node, ...props }) => (
            <tr className="even:bg-muted/30 transition-colors" {...props} />
          ),
          strong: ({ node, ...props }) => (
            <strong className="font-semibold text-foreground" {...props} />
          ),
          code: ({ node, inline, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || "");
            
            // Safer code-block check: check if it has a class like language-* or contains newlines
            const rawContent = String(children);
            const isCodeBlock = !inline && (match || rawContent.includes("\n"));

            if (isCodeBlock) {
              // Extract text content safely even if children is a tree (from rehype-highlight)
              const getRawCode = (nodes: any): string => {
                if (typeof nodes === "string") return nodes;
                if (Array.isArray(nodes)) return nodes.map(getRawCode).join("");
                if (nodes?.props?.children)
                  return getRawCode(nodes.props.children);
                return "";
              };

              const rawCode = getRawCode(children).replace(/\n$/, "");
              return (
                <CodeBlock language={match ? match[1] : "text"} value={rawCode}>
                  {children}
                </CodeBlock>
              );
            }

            return (
              <code
                className="bg-muted px-1.5 py-0.5 rounded-md text-[0.85em] font-mono text-foreground font-medium"
                {...props}
              >
                {children}
              </code>
            );
          },
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}

interface CodeBlockProps {
  language: string;
  value: string;
  children: React.ReactNode;
}

function CodeBlock({ language, value, children }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-6 rounded-xl overflow-hidden bg-[var(--code-bg)] border border-[var(--code-border)] group max-w-full min-w-0">
      <div className="flex items-center justify-between px-4 py-2 bg-[var(--code-header-bg)] border-b border-[var(--code-border)]">
        <span className="text-xs font-mono text-zinc-500 font-medium lowercase">
          {language}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCopy}
          className="h-7 px-2 rounded text-zinc-500 hover:text-zinc-200 hover:bg-[var(--code-header-bg)] text-[11px] font-medium transition-all"
        >
          {copied ? "Copied!" : "Copy"}
        </Button>
      </div>
      <pre className="p-4 overflow-x-auto text-[13px] leading-relaxed text-zinc-200 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <code className={`language-${language} font-mono whitespace-pre`}>
          {children}
        </code>
      </pre>
    </div>
  );
}
