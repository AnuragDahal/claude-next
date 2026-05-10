import React, { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
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
  };

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 150;
        setShowScrollButton(!isNearBottom);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar relative">
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

      {showScrollButton && (
        <Button
          variant="outline"
          size="icon"
          onClick={scrollToBottom}
          className="fixed bottom-28 md:bottom-32 left-1/2 -translate-x-1/2 size-10 rounded-full bg-background/80 backdrop-blur-sm border-border shadow-md z-20 flex items-center justify-center hover:bg-background transition-all animate-in fade-in zoom-in"
        >
          <ChevronDown className="size-5" />
        </Button>
      )}
    </div>
  );
}
