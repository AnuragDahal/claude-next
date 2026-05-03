import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css"; // Optional, but usually nice for code blocks

interface MessageContentProps {
  content: string;
}

export function MessageContent({ content }: MessageContentProps) {
  return (
    <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none break-words">
      {/* // TODO: Customize markdown components to match your design system */}
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          a: ({ node, ...props }) => (
            <a {...props} className="text-primary underline underline-offset-4 hover:opacity-80" target="_blank" rel="noopener noreferrer" />
          ),
          p: ({ node, ...props }) => <p className="mb-4 last:mb-0" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-4" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal pl-4 mb-4" {...props} />,
          code: ({ node, inline, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || "");
            if (!inline && match) {
              return (
                <div className="relative my-4 rounded-xl overflow-hidden bg-zinc-950 border border-border/50">
                  <div className="flex items-center justify-between px-4 py-1.5 bg-zinc-900 border-b border-border/50">
                    <span className="text-xs font-mono text-zinc-400">{match[1]}</span>
                  </div>
                  <pre className="p-4 overflow-x-auto text-sm bg-transparent">
                    <code className={className} {...props}>
                      {children}
                    </code>
                  </pre>
                </div>
              );
            }
            return (
              <code className="bg-muted px-1.5 py-0.5 rounded-md text-sm font-mono text-foreground" {...props}>
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
