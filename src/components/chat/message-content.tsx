"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Check, Copy } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

// Note: Highlight.js styles are imported in globals.css for dynamic switching

interface MessageContentProps {
  content: string;
  role?: "user" | "assistant";
}

export function MessageContent({ content, role = "assistant" }: MessageContentProps) {
  if (role === "user") {
    return <div className="whitespace-pre-wrap">{content}</div>;
  }

  return (
    <div className="prose prose-stone dark:prose-invert max-w-none break-words prose-p:leading-relaxed prose-p:my-1 prose-headings:mt-3 prose-headings:mb-1 prose-ul:my-1 prose-li:my-0 prose-pre:p-0 prose-pre:bg-transparent first:prose-p:mt-0 last:prose-p:mb-0">
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
          p: ({ node, ...props }) => <p className="mb-4 last:mb-0" {...props} />,
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto mb-4 border border-border rounded-xl">
              <table className="w-full border-collapse" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => <thead className="bg-muted/50" {...props} />,
          th: ({ node, ...props }) => (
            <th className="px-4 py-2 border border-border font-semibold text-left" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="px-4 py-2 border border-border" {...props} />
          ),
          tr: ({ node, ...props }) => (
            <tr className="even:bg-muted/30 transition-colors" {...props} />
          ),
          code: ({ node, inline, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || "");
            const isCodeBlock = !inline && match;

            if (isCodeBlock) {
              // Extract raw text for copying
              const rawCode = String(node.children[0]?.value || children).replace(/\n$/, "");
              return (
                <CodeBlock language={match[1]} value={rawCode}>
                  {children}
                </CodeBlock>
              );
            }

            return (
              <code
                className="bg-muted/80 px-1.5 py-0.5 rounded-md text-sm font-mono text-foreground border border-border/50"
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
    <div className="relative my-6 rounded-2xl overflow-hidden bg-[#0d1117] border border-white/10 group shadow-2xl">
      <div className="flex items-center justify-between px-5 py-2.5 bg-white/5 border-b border-white/10">
        <span className="text-xs font-mono text-zinc-400 font-medium uppercase tracking-wider">
          {language}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={onCopy}
          className="size-8 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-white/10 transition-all"
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
        </Button>
      </div>
      <pre className="p-5 overflow-x-auto text-[13px] leading-relaxed text-zinc-100 scrollbar-thin scrollbar-thumb-white/10">
        <code className={`language-${language} font-mono`}>{children}</code>
      </pre>
    </div>
  );
}
