import React from "react";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {cn} from "@/lib/utils";
import {type Message} from "@/lib/types";
import {MessageContent} from "./message-content";
import {Paperclip, Sparkles, User} from "lucide-react";

interface MessageBubbleProps {
  message: Message;
  isLoading?: boolean;
}

export function MessageBubble({message, isLoading}: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300",
        isUser ? "flex-row-reverse" : "flex-row",
      )}
    >
      {!isUser && (
        <div className="shrink-0 mt-1">
          <div className="size-6 flex items-center justify-center text-[#d97757]">
            <Sparkles className="size-5 fill-current" />
          </div>
        </div>
      )}
      
      <div
        className={cn(
          "flex flex-col gap-2",
          isUser ? "items-end ml-auto max-w-[70%]" : "items-start max-w-none flex-1",
        )}
      >
        {message.attachments && message.attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-1">
            {message.attachments.map((attachment, idx) => (
              attachment.type.startsWith("image/") ? (
                <div key={idx} className="rounded-xl border border-border overflow-hidden max-w-sm">
                  <img src={attachment.preview} alt={attachment.name} className="w-full h-auto object-contain" />
                </div>
              ) : (
                <div key={idx} className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-muted/50 text-xs font-medium">
                  <Paperclip className="size-3" />
                  <span>{attachment.name}</span>
                </div>
              )
            ))}
          </div>
        )}
        <div
          className={cn(
            "text-[15px] leading-relaxed whitespace-pre-wrap",
            isUser
              ? "bg-[#f3f1ec] dark:bg-[#2a2824] text-foreground px-5 py-3 rounded-[24px] border border-black/[0.03]"
              : "text-foreground font-sans text-[16px] tracking-normal",
          )}
        >
          {!isUser &&
          message.content === "" &&
          isLoading ? (
            <div className="flex items-center gap-2 py-1">
              <div className="flex gap-1">
                <span className="size-1.5 rounded-full bg-[#d97757]/40 animate-bounce [animation-delay:-0.3s]"></span>
                <span className="size-1.5 rounded-full bg-[#d97757]/40 animate-bounce [animation-delay:-0.15s]"></span>
                <span className="size-1.5 rounded-full bg-[#d97757]/40 animate-bounce"></span>
              </div>
            </div>
          ) : (
            <MessageContent content={message.content} role={message.role} />
          )}
        </div>
      </div>
    </div>
  );
}
