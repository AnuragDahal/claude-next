import React from "react";
import { Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type Message } from "@/lib/types";
import { MessageBubble } from "./message-bubble";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export function MessageList({ messages, isLoading, messagesEndRef }: MessageListProps) {
  const lastMessage = messages[messages.length - 1];
  const isThinking = isLoading && (lastMessage?.role === "user" || (lastMessage?.role === "assistant" && !lastMessage.content));

  return (
    <div className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar">
      <div className="max-w-3xl mx-auto py-10 px-4 md:px-0 flex flex-col gap-8">
        {messages.map((message) => (
          <MessageBubble 
            key={message.id} 
            message={message} 
            isLoading={isLoading} 
          />
        ))}
        
        {isThinking && (
          <div className="flex items-start gap-4 md:gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
              <Sparkles className="size-4 text-primary animate-pulse" />
            </div>
            <div className="flex-1 py-1">
              <div className="text-muted-foreground text-[15px] italic animate-pulse">
                Claude is thinking...
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} className="h-32 shrink-0" />
      </div>
    </div>
  );
}
