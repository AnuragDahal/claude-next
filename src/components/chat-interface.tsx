"use client";

import * as React from "react";
import { Send, User, Sparkles, Paperclip, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Plus,
  ChevronDown,
  AudioLines,
  GraduationCap,
  Pencil,
  Code2,
  Coffee,
  Lightbulb,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function ChatInterface() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I'm a Claude clone UI built with shadcn and Next.js. I look pretty good, don't I?",
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 1000);
  };

  const isHome = messages.length === 0;

  return (
    <div className="flex flex-col h-screen w-full bg-background transition-colors duration-500">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-transparent sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <SidebarTrigger />
        </div>
        {!isHome && (
          <div className="flex items-center gap-2">
            <div className="size-6 bg-primary rounded-md flex items-center justify-center">
              <Sparkles className="size-4 text-primary-foreground" />
            </div>
            <h2 className="text-lg font-semibold tracking-tight">
              Claude Clone
            </h2>
          </div>
        )}
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
                Good evening, Anurag
              </h1>
            </div>

            <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
              <div className="relative group bg-card border border-border shadow-2xl rounded-[32px] p-2 transition-all hover:border-border/80 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/5">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="How can I help you today?"
                  className="w-full min-h-[120px] bg-transparent border-none focus-visible:ring-0 resize-none py-6 px-6 text-xl placeholder:text-muted-foreground/60 leading-relaxed shadow-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
                <div className="flex items-center justify-between px-4 py-2 border-t border-border/10">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-10 rounded-full hover:bg-muted text-muted-foreground"
                    >
                      <Plus className="size-5" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 gap-1.5 rounded-xl px-3 text-muted-foreground hover:text-foreground hover:bg-muted"
                    >
                      <span className="text-sm font-medium">Sonnet 3.5</span>
                      <ChevronDown className="size-4" />
                    </Button>
                    <div className="h-4 w-px bg-border/20 mx-1" />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-10 rounded-full hover:bg-muted text-muted-foreground"
                    >
                      <AudioLines className="size-5" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
                <QuickActionButton
                  icon={<GraduationCap className="size-4" />}
                  label="Learn"
                />
                <QuickActionButton
                  icon={<Pencil className="size-4" />}
                  label="Write"
                />
                <QuickActionButton
                  icon={<Code2 className="size-4" />}
                  label="Code"
                />
                <QuickActionButton
                  icon={<Coffee className="size-4" />}
                  label="Life stuff"
                />
                <QuickActionButton
                  icon={<Lightbulb className="size-4" />}
                  label="Claude's choice"
                />
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
                        "rounded-2xl px-5 py-3 text-[15px] leading-relaxed shadow-sm",
                        message.role === "user"
                          ? "bg-muted text-foreground"
                          : "bg-card border border-border text-foreground",
                      )}
                    >
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        {/* Input for Active Chat */}
        {!isHome && (
          <div className="p-4 md:p-6 bg-background border-t border-border animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="max-w-3xl mx-auto relative">
              <div className="relative flex items-end gap-2 p-2 bg-muted/50 border border-border rounded-2xl focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9 rounded-xl text-muted-foreground hover:text-foreground"
                >
                  <Paperclip className="size-5" />
                </Button>
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Message Claude..."
                  className="flex-1 min-h-[44px] max-h-[200px] bg-transparent border-none focus-visible:ring-0 resize-none py-3 px-1 text-base shadow-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  size="icon"
                  className="size-9 rounded-xl shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:bg-muted"
                >
                  <Send className="size-4" />
                </Button>
              </div>
              <p className="mt-2 text-center text-[10px] text-muted-foreground">
                Claude can make mistakes. Please double-check responses.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function QuickActionButton({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Button
      variant="outline"
      size="sm"
      className="h-10 px-4 rounded-xl bg-muted/30 border-border/50 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted hover:border-border transition-all"
    >
      <span className="mr-2 text-muted-foreground/70">{icon}</span>
      {label}
    </Button>
  );
}
