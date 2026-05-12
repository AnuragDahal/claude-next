import React, { useState, useEffect, useRef } from "react";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Message } from "@/lib/types";
import { MessageBubble } from "./message-bubble";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export function MessageList({ messages, isLoading, messagesEndRef }: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowScrollButton(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        // Threshold of 50px for better precision
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 50;
        setShowScrollButton(!isNearBottom);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      // Initial check
      handleScroll();
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  useEffect(() => {
    if (containerRef.current && messages.length > 0) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 150;
      const lastMessageIsUser = messages[messages.length - 1].role === "user";

      // Auto-scroll if near bottom or if the user just sent a message
      if (isNearBottom || lastMessageIsUser) {
        // Use "auto" for streaming updates to make it feel more responsive
        // and "smooth" for new user messages.
        const behavior = lastMessageIsUser ? "smooth" : "auto";
        messagesEndRef.current?.scrollIntoView({ behavior });
      }
    }
  }, [messages, messagesEndRef]);

  return (
    <div className="flex-1 relative flex flex-col min-h-0 overflow-hidden">
      <div 
        ref={containerRef} 
        className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar"
      >
        <div className="max-w-3xl mx-auto pt-16 pb-10 px-4 md:px-0 flex flex-col gap-10">
          {messages.map((message, index) => (
            <MessageBubble 
              key={message.id} 
              message={message} 
              isLoading={isLoading && index === messages.length - 1} 
            />
          ))}
          
          <div ref={messagesEndRef} className="h-32 shrink-0" />
        </div>
      </div>

      {showScrollButton && (
        <Button
          variant="outline"
          size="icon"
          onClick={scrollToBottom}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 size-9 rounded-full bg-background border-border shadow-lg z-20 flex items-center justify-center hover:bg-background transition-all animate-in fade-in zoom-in"
        >
          <ArrowDown className="size-4 text-muted-foreground" />
        </Button>
      )}
    </div>
  );
}
