"use client";

import { Button } from "@/components/ui/button";
import { type Message } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Check,
  Copy,
  FileText,
  Loader2,
  Paperclip,
  Pencil,
  RotateCcw,
  Sparkles,
  Wrench,
} from "lucide-react";
import { useState } from "react";
import { MessageContent } from "./message-content";

interface MessageBubbleProps {
  message: Message;
  isLoading?: boolean;
  showRetry?: boolean;
  onRetry?: () => void;
}

// Renders a single part of a message based on its type.
// This is the Vercel AI SDK-native way to render messages with parts.
function MessagePart({ part, role }: { part: any; role: string }) {
  const typedRole = role as "user" | "assistant" | "system" | "data" | "tool" | "function";
  // Text part: render markdown
  if (part.type === "text") {
    return <MessageContent content={part.text} role={typedRole} />;
  }

  // Reasoning part (e.g. thinking models)
  if (part.type === "reasoning") {
    return (
      <details className="mb-3 group/reasoning">
        <summary className="cursor-pointer text-xs font-medium text-muted-foreground flex items-center gap-1.5 select-none list-none mb-1">
          <Sparkles className="size-3" />
          <span>Reasoning</span>
          <span className="text-[10px] opacity-60 group-open/reasoning:hidden">(click to expand)</span>
        </summary>
        <div className="text-xs text-muted-foreground bg-muted/40 rounded-xl p-3 border border-border/50 whitespace-pre-wrap leading-relaxed font-mono">
          {part.reasoning}
        </div>
      </details>
    );
  }

  // Tool invocation part
  if (part.type === "tool-invocation") {
    const { toolName, state, result } = part.toolInvocation ?? part;
    const isRunning = state === "call" || state === "partial-call";
    const hasResult = state === "result";

    return (
      <div className="my-2 rounded-xl border border-border/60 bg-muted/30 overflow-hidden text-xs">
        <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 border-b border-border/40">
          <Wrench className="size-3 text-muted-foreground" />
          <span className="font-mono font-medium text-foreground/80">{toolName}</span>
          {isRunning && (
            <Loader2 className="size-3 text-primary animate-spin ml-auto" />
          )}
          {hasResult && (
            <span className="ml-auto text-[10px] text-emerald-500 font-medium">Done</span>
          )}
        </div>
        {hasResult && result != null && (
          <div className="px-3 py-2 text-muted-foreground font-mono whitespace-pre-wrap break-words max-h-40 overflow-y-auto">
            {typeof result === "string" ? result : JSON.stringify(result, null, 2)}
          </div>
        )}
      </div>
    );
  }

  // File part (uploaded by user)
  if (part.type === "file") {
    const isImage = part.mediaType?.startsWith("image/");
    if (isImage) {
      return (
        <div className="rounded-xl border border-border overflow-hidden max-w-sm mb-1">
          <img
            src={`data:${part.mediaType};base64,${part.data}`}
            alt="Attached image"
            className="w-full h-auto object-contain"
          />
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-muted/50 text-xs font-medium mb-1">
        <FileText className="size-3" />
        <span>File attachment</span>
      </div>
    );
  }

  return null;
}

export function MessageBubble({
  message,
  isLoading,
  showRetry,
  onRetry,
}: MessageBubbleProps) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  // Derive text content for clipboard copy from parts or fallback to content
  const textContent = message.parts
    ? message.parts
        .filter((p: any) => p.type === "text")
        .map((p: any) => p.text)
        .join("")
    : message.content;

  const onCopy = () => {
    navigator.clipboard.writeText(textContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Check if message is empty (assistant hasn't started streaming yet)
  const isEmpty = !message.parts?.length && !message.content;

  return (
    <div
      className={cn(
        "flex gap-4 group animate-in fade-in slide-in-from-bottom-2 duration-300",
        isUser ? "flex-row-reverse" : "flex-row",
      )}
    >
      {!isUser && (
        <div className="shrink-0 mt-1">
          <div className="size-6 flex items-center justify-center text-primary">
            <Sparkles className="size-5 fill-current" />
          </div>
        </div>
      )}

      <div
        className={cn(
          "flex flex-col gap-1 min-w-0 flex-1",
          isUser ? "items-end ml-auto max-w-[70%]" : "items-start max-w-none",
        )}
      >
        {/* Legacy attachments (from before SDK migration) */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-1">
            {message.attachments.map((attachment: any, idx: number) =>
              attachment.type.startsWith("image/") ? (
                <div
                  key={idx}
                  className="rounded-xl border border-border overflow-hidden max-w-sm"
                >
                  <img
                    src={attachment.preview}
                    alt={attachment.name}
                    className="w-full h-auto object-contain"
                  />
                </div>
              ) : (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-muted/50 text-xs font-medium"
                >
                  <Paperclip className="size-3" />
                  <span>{attachment.name}</span>
                </div>
              ),
            )}
          </div>
        )}

        <div
          className={cn(
            "text-[15px] leading-relaxed w-full overflow-hidden",
            isUser
              ? "bg-secondary text-foreground px-5 py-3 rounded-[24px] border border-black/[0.03] whitespace-pre-wrap"
              : "text-foreground font-sans text-[16px] tracking-normal",
          )}
        >
          {/* Streaming / loading state: show thinking dots when empty */}
          {!isUser && isEmpty && isLoading ? (
            <div className="flex items-center gap-2 py-1">
              <div className="flex gap-1">
                <span className="size-1.5 rounded-full bg-primary/40 animate-bounce [animation-delay:-0.3s]" />
                <span className="size-1.5 rounded-full bg-primary/40 animate-bounce [animation-delay:-0.15s]" />
                <span className="size-1.5 rounded-full bg-primary/40 animate-bounce" />
              </div>
            </div>
          ) : message.parts && message.parts.length > 0 ? (
            // Render via SDK parts (native streaming / tool calls)
            message.parts.map((part: any, i: number) => (
              <MessagePart key={i} part={part} role={message.role} />
            ))
          ) : (
            // Fallback: render from `content` string (used for user messages or legacy)
            <MessageContent content={message.content} role={message.role as any} />
          )}
        </div>

        {!isLoading && (
          <div
            className={cn(
              "flex items-center gap-3 mt-1 text-muted-foreground text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200",
              isUser ? "flex-row-reverse mr-2" : "ml-0",
            )}
          >
            <span>{formatDate(message.timestamp)}</span>
            <div className="flex items-center gap-1">
              {isUser ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 rounded-full hover:bg-muted/50 text-inherit"
                >
                  <Pencil className="size-3.5" />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={showRetry ? onRetry : undefined}
                  className="size-7 rounded-full hover:bg-muted/50 text-inherit"
                  disabled={!showRetry}
                >
                  <RotateCcw className="size-3.5" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={onCopy}
                className="size-7 rounded-full hover:bg-muted/50 text-inherit"
              >
                {copied ? (
                  <Check className="size-3.5" />
                ) : (
                  <Copy className="size-3.5" />
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
