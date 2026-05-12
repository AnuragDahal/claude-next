"use client";

import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

interface MessageContentProps {
  content: string;
  role?: "user" | "assistant";
}

export function MessageContent({
  content,
  role = "assistant",
}: MessageContentProps) {
  if (role === "user") {
    return <div className="whitespace-pre-wrap">{content}</div>;
  }

  return (
    <div className="prose prose-stone dark:prose-invert max-w-none break-words prose-p:leading-relaxed prose-pre:p-0 prose-pre:bg-transparent first:prose-p:mt-0 last:prose-p:mb-0">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          a: ({ node, ...props }) => (
            <a
              {...props}
              className="text-[#d97757] underline underline-offset-4 hover:opacity-80 transition-opacity"
              target="_blank"
              rel="noopener noreferrer"
            />
          ),
          // Changed p to div to avoid "div cannot be a descendant of p" hydration error
          // when code blocks (which are divs) are rendered.
          p: ({ node, ...props }) => (
            <div className="mb-4 last:mb-0" {...props} />
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
              className="list-disc pl-6 mb-4 gap-2 flex flex-col"
              {...props}
            />
          ),
          ol: ({ node, ...props }) => (
            <ol
              className="list-decimal pl-6 mb-4 gap-2 flex flex-col"
              {...props}
            />
          ),
          li: ({ node, ...props }) => <li className="pl-1" {...props} />,
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-[#d97757]/30 pl-4 py-1 my-4 italic text-muted-foreground"
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
          code: ({ node, inline, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || "");
            const isCodeBlock = !inline;

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
                className="bg-[#f3f1ec] dark:bg-[#2a2824] px-1.5 py-0.5 rounded-md text-[0.9em] font-mono text-foreground border border-black/[0.05]"
                {...props}
              >
                {children}
              </code>
            );
          },
        }}
      >
        {content}
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
    <div className="relative my-6 rounded-xl overflow-hidden bg-[#1e1e1e] border border-white/5 group">
      <div className="flex items-center justify-between px-4 py-2 bg-white/[0.03] border-b border-white/[0.05]">
        <span className="text-xs font-mono text-zinc-500 font-medium lowercase">
          {language}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCopy}
          className="h-7 px-2 rounded text-zinc-500 hover:text-zinc-200 hover:bg-white/5 text-[11px] font-medium transition-all"
        >
          {copied ? "Copied!" : "Copy"}
        </Button>
      </div>
      <pre className="p-4 overflow-x-auto text-[13px] leading-relaxed text-zinc-200 scrollbar-none">
        <code className={`language-${language} font-mono`}>{children}</code>
      </pre>
    </div>
  );
}
