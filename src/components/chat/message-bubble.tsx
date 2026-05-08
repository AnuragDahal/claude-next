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
    <>
      <div
        className={cn(
          "flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300",
          message.role === "user" ? "flex-row-reverse" : "flex-row",
        )}
      >
        <div className="shrink-0">
          <Avatar
            className={cn(
              "size-8 border border-border shadow-sm",
              message.role === "assistant" ? "bg-primary" : "bg-secondary",
            )}
          >
            {message.role === "assistant" ? (
              <AvatarFallback className="bg-primary text-primary-foreground">
                <Sparkles className="size-4" />
              </AvatarFallback>
            ) : (
              <AvatarFallback className="bg-secondary text-secondary-foreground">
                <User className="size-4" />
              </AvatarFallback>
            )}
          </Avatar>
        </div>
        <div
          className={cn(
            "flex flex-col gap-2 max-w-[85%]",
            message.role === "user" ? "items-end" : "items-start",
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
              "rounded-2xl px-5 py-3 text-[15px] leading-relaxed shadow-sm whitespace-pre-wrap",
              message.role === "user"
                ? "bg-muted text-foreground"
                : "bg-card border border-border text-foreground",
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
              <MessageContent content={message.content} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
