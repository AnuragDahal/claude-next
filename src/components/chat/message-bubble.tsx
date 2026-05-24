import { Button } from "@/components/ui/button";
import { type Message } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Check,
  Copy,
  Paperclip,
  Pencil,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { MessageContent } from "./message-content";

interface MessageBubbleProps {
  message: Message;
  isLoading?: boolean;
  showRetry?: boolean;
  onRetry?: () => void;
}

export function MessageBubble({
  message,
  isLoading,
  showRetry,
  onRetry,
}: MessageBubbleProps) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(message.content);
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
        {message.attachments && message.attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-1">
            {message.attachments.map((attachment, idx) =>
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
            "text-[15px] leading-relaxed whitespace-pre-wrap w-full overflow-hidden",
            isUser
              ? "bg-secondary text-foreground px-5 py-3 rounded-[24px] border border-black/[0.03]"
              : "text-foreground font-sans text-[16px] tracking-normal",
          )}
        >
          {!isUser && message.content === "" && isLoading ? (
            <div className="flex items-center gap-2 py-1">
              <div className="flex gap-1">
                <span className="size-1.5 rounded-full bg-primary/40 animate-bounce [animation-delay:-0.3s]"></span>
                <span className="size-1.5 rounded-full bg-primary/40 animate-bounce [animation-delay:-0.15s]"></span>
                <span className="size-1.5 rounded-full bg-primary/40 animate-bounce"></span>
              </div>
            </div>
          ) : (
            <MessageContent content={message.content} role={message.role} />
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
