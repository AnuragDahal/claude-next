"use client";

import { Sparkles, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getGreeting } from "@/lib/utils/greeting";
import { useChat } from "@/hooks/use-chat";
import { useScroll } from "@/hooks/use-scroll";
import { InputBar } from "@/components/chat/input-bar";
import { MessageList } from "@/components/chat/message-list";
import { SidebarTrigger } from "../ui/sidebar";

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
    <div className="flex flex-col h-screen w-full bg-background transition-colors duration-500">
      {/* Header */}
      <header className="flex items-center justify-between md:justify-end px-4 py-3 bg-transparent sticky top-0 z-10 min-h-[56px]">
        <SidebarTrigger className="md:hidden" />
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
          /* Message List */
          <MessageList
            messages={messages}
            isLoading={isLoading}
            messagesEndRef={messagesEndRef}
          />
        )}

        {/* Input for Active Chat */}
        {!isHome && (
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
        )}
      </main>
    </div>
  );
}
