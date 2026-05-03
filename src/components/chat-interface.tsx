"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  ArrowUp,
  AudioLines,
  ChevronDown,
  MoreHorizontal,
  Plus,
  Send,
  Sparkles,
  User,
} from "lucide-react";
import React from "react";

import { getGreeting } from "@/lib/utils/greeting";

import { useChat } from "@/hooks/use-chat";

export function ChatInterface() {
  const {
    messages,
    setMessages,
    input,
    setInput,
    isLoading,
    handleInput,
    handleSend,
  } = useChat();

  const greeting = getGreeting();

  React.useEffect(() => {
    const handleReset = () => {
      setMessages([]);
      setInput("");
      const textareas = document.querySelectorAll("textarea");
      textareas.forEach((t) => (t.style.height = ""));
    };
    window.addEventListener("reset-chat", handleReset);
    return () => window.removeEventListener("reset-chat", handleReset);
  }, [setMessages, setInput]);

  const isHome = messages.length === 0;

  return (
    <div className="flex flex-col h-screen w-full bg-background transition-colors duration-500">
      {/* Header */}
      <header className="flex items-center justify-end px-4 py-3 bg-transparent sticky top-0 z-10 min-h-[56px]">
        <div className="flex items-center gap-2">
          {isHome && (
            <Button
              variant="outline"
              size="sm"
              className="rounded-full bg-muted/50 border-border/50 text-xs font-medium"
            >
              Get Pro
            </Button>
          )}
          <Button variant="ghost" size="icon" className="rounded-full">
            <MoreHorizontal className="size-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {isHome ? (
          /* Welcome Screen */
          <div className="flex-1 flex flex-col items-center justify-center px-4 -mt-20">
            <div className="flex items-center gap-4 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="size-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                <Sparkles className="size-8 text-primary-foreground" />
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-medium tracking-tight">
                {greeting}, Anurag
              </h1>
            </div>

            <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
              <div className="relative group bg-card border border-border rounded-[28px] p-1.5 transition-all hover:border-border/80 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/5">
                <Textarea
                  value={input}
                  onChange={handleInput}
                  placeholder="How can I help you today?"
                  className="w-full min-h-[100px] max-h-[300px] overflow-y-auto bg-transparent border-none focus-visible:ring-0 resize-none py-5 px-6 text-base md:text-lg placeholder:text-muted-foreground/60 leading-relaxed shadow-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  disabled={isLoading}
                  rows={1}
                />
                <div className="flex items-center justify-between px-4 py-2 border-t border-border/5">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-9 rounded-full hover:bg-muted text-muted-foreground"
                    >
                      <Plus className="size-5" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 gap-1.5 rounded-xl px-3 text-muted-foreground hover:text-foreground hover:bg-muted"
                    >
                      <span className="text-xs font-medium">Sonnet 3.5</span>
                      <ChevronDown className="size-3.5" />
                    </Button>
                    <div className="h-4 w-px bg-border/10 mx-1" />
                    <Button
                      onClick={handleSend}
                      variant={input.trim() ? "default" : "ghost"}
                      size="icon"
                      className={cn(
                        "size-9 rounded-full transition-all duration-200",
                        input.trim()
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "hover:bg-muted text-muted-foreground",
                      )}
                    >
                      {input.trim() ? (
                        <ArrowUp className="size-5" />
                      ) : (
                        <AudioLines className="size-5" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Message List */
          <ScrollArea className="flex-1 px-4 md:px-0">
            <div className="max-w-3xl mx-auto py-8 flex flex-col gap-10">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300",
                    message.role === "user" ? "flex-row-reverse" : "flex-row",
                  )}
                >
                  <div className="shrink-0">
                    <Avatar
                      className={cn(
                        "size-8 border border-border shadow-sm",
                        message.role === "assistant"
                          ? "bg-primary"
                          : "bg-secondary",
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
                        message.content
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        {/* Input for Active Chat */}
        {!isHome && (
          <div className="p-4 md:p-6 bg-background animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="max-w-3xl mx-auto relative">
              <div className="relative flex items-end gap-2 p-2 bg-muted/30 border border-border rounded-2xl focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9 rounded-xl text-muted-foreground hover:text-foreground"
                >
                  <Plus className="size-5" />
                </Button>
                <Textarea
                  value={input}
                  onChange={handleInput}
                  placeholder="Message Claude..."
                  className="flex-1 min-h-[80px] max-h-[300px] overflow-y-auto bg-transparent border-none focus-visible:ring-0 resize-none py-3 px-1 text-base md:text-lg placeholder:text-muted-foreground/60 leading-relaxed shadow-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  disabled={isLoading}
                  rows={1}
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  size="icon"
                  className="size-9 rounded-xl shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:bg-muted"
                >
                  {isLoading ? (
                    <div className="size-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                  ) : (
                    <Send className="size-4" />
                  )}
                </Button>
              </div>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Claude can make mistakes. Please double-check responses.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
