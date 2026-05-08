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
  return (
    <div
      className={cn(
        "flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300",
        message.role === "user" ? "flex-row-reverse" : "flex-row",
      )}
    >
      {message.role === "assistant" && (
        <div className="shrink-0">
          <Avatar className="size-8 border border-border shadow-sm bg-primary">
            <AvatarFallback className="bg-primary text-primary-foreground">
              <Sparkles className="size-4" />
            </AvatarFallback>
          </Avatar>
        </div>
      )}
      
      <div
        className={cn(
          "flex flex-col gap-2 max-w-[85%]",
          message.role === "user" ? "items-end ml-auto" : "items-start",
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
            message.role === "user"
              ? "bg-[#f3f1ec] dark:bg-[#2a2824] text-foreground px-5 py-3 rounded-2xl border border-black/[0.03]"
              : "text-foreground font-serif text-[17px] tracking-tight",
          )}
        >
          {message.role === "assistant" &&
          message.content === "" &&
          isLoading ? (
            <div className="flex items-center gap-2 py-1">
              <div className="flex gap-1">
                <span className="size-1.5 rounded-full bg-primary/40 animate-bounce [animation-delay:-0.3s]"></span>
                <span className="size-1.5 rounded-full bg-primary/40 animate-bounce [animation-delay:-0.15s]"></span>
                <span className="size-1.5 rounded-full bg-primary/40 animate-bounce"></span>
              </div>
              <span className="text-sm italic text-muted-foreground animate-pulse">
                Claude is thinking...
              </span>
            </div>
          ) : (
            <MessageContent content={message.content} role={message.role} />
          )}
        </div>
      </div>
    </div>
  );
}
