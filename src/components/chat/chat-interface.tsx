"use client";

import { Sparkles, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getGreeting } from "@/lib/utils/greeting";
import { useChat } from "@/hooks/use-chat";
import { useScroll } from "@/hooks/use-scroll";
import { InputBar } from "@/components/chat/input-bar";
import { MessageList } from "@/components/chat/message-list";
import { SidebarTrigger } from "../ui/sidebar";
import { cn } from "@/lib/utils";

export function ChatInterface() {
  const { 
    messages, 
    input, 
    isLoading, 
    attachments,
    addAttachments,
    removeAttachment,
    handleInput, 
    handleSend 
  } = useChat();
  const messagesEndRef = useScroll(messages);
  const greeting = getGreeting();
  const isHome = messages.length === 0;

  return (
    <div className="flex flex-col h-screen w-full bg-background transition-colors duration-500 overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-transparent sticky top-0 z-30 min-h-[56px]">
        <SidebarTrigger />
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
          <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground">
            <MoreHorizontal className="size-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {isHome ? (
          <div className="flex-1 flex flex-col items-center justify-center px-4 -mt-20">
            <div className="flex flex-col items-center gap-8 mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <div className="size-14 bg-[#d97757] rounded-2xl flex items-center justify-center shadow-xl shadow-[#d97757]/10">
                <Sparkles className="size-8 text-white fill-current" />
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-medium tracking-tight text-center">
                {greeting}, Anurag
              </h1>
            </div>
            <InputBar
              input={input}
              isLoading={isLoading}
              isHome={true}
              attachments={attachments}
              addAttachments={addAttachments}
              removeAttachment={removeAttachment}
              handleInput={handleInput}
              handleSend={handleSend}
            />
          </div>
        ) : (
          <>
            <MessageList
              messages={messages}
              isLoading={isLoading}
              messagesEndRef={messagesEndRef}
            />
            <InputBar
              input={input}
              isLoading={isLoading}
              isHome={false}
              attachments={attachments}
              addAttachments={addAttachments}
              removeAttachment={removeAttachment}
              handleInput={handleInput}
              handleSend={handleSend}
            />
          </>
        )}
      </main>
    </div>
  );
}
