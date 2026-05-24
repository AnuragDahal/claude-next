"use client";

import { InputBar } from "@/components/chat/input-bar";
import { MessageList } from "@/components/chat/message-list";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { useChat } from "@/hooks/use-chat";
import { useScroll } from "@/hooks/use-scroll";
import { getGreeting } from "@/lib/utils/greeting";
import { SidebarTrigger } from "../ui/sidebar";
import { MoreHorizontal, Sparkles } from "lucide-react";
import { useChatStore } from "@/store/chat-store";
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
    handleSend,
    cancelActiveRequest,
    retryLastResponse,
  } = useChat();
  const messagesEndRef = useScroll(messages);
  const { user } = useAuth();
  const { sessions } = useChatStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex flex-col h-screen w-full bg-background transition-colors duration-500 overflow-hidden">
        <header className="flex items-center justify-between md:justify-end px-4 py-3 bg-transparent sticky top-0 z-30 min-h-[56px]">
          <SidebarTrigger className="md:hidden" />
        </header>
        <main className="flex-1 flex flex-col relative overflow-hidden" />
      </div>
    );
  }

  const greeting = getGreeting();
  const isHome = messages.length === 0;
  const userName = user?.name?.split(" ")[0] || "Guest";

  const totalUserMessages = sessions.reduce(
    (acc, s) => acc + s.messages.filter((m) => m.role === "user").length,
    0,
  );
  const isLimitReached = !user && totalUserMessages >= 5;

  const renderLimitBanner = (isHomeLayout: boolean) => (
    <div
      className={cn(
        "w-full transition-all duration-500 flex flex-col items-center",
        isHomeLayout
          ? "max-w-2xl px-4"
          : "p-4 md:p-6 sticky bottom-0 bg-gradient-to-t from-background via-background to-transparent",
      )}
    >
      <div
        className={cn(
          "w-full bg-card/60 backdrop-blur-xl border border-primary/20 rounded-3xl p-6 text-center shadow-xl flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500",
          isHomeLayout ? "" : "max-w-3xl",
        )}
      >
        <div className="size-12 bg-primary/10 rounded-full flex items-center justify-center">
          <Sparkles className="size-6 text-primary" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">
          You've reached the free limit
        </h3>
        <p className="text-sm text-muted-foreground max-w-md">
          To continue this conversation and unlock advanced reasoning features,
          please sign in to your account.
        </p>
        <Button
          onClick={() => (window.location.href = "/login")}
          className="rounded-xl px-8 py-2 bg-primary hover:bg-primary/95 text-primary-foreground font-medium transition-all"
        >
          Sign in to continue
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen w-full bg-background transition-colors duration-500 overflow-hidden">
      <header className="flex items-center justify-between md:justify-end px-4 py-3 bg-transparent sticky top-0 z-30 min-h-[56px]">
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
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-muted-foreground hover:text-foreground"
          >
            <MoreHorizontal className="size-5" />
          </Button>
        </div>
      </header>

      <main className="flex-1 flex flex-col relative overflow-hidden">
        {isHome ? (
          <div className="flex-1 flex flex-col items-center justify-center px-4 -mt-20">
            <div className="flex flex-col items-center gap-8 mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <div className="size-14 bg-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/10">
                <Sparkles className="size-8 text-white fill-current" />
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-medium tracking-tight text-center">
                {greeting}, {userName}
              </h1>
            </div>
            {isLimitReached ? (
              renderLimitBanner(true)
            ) : (
              <InputBar
                input={input}
                isLoading={isLoading}
                isHome={true}
                attachments={attachments}
                addAttachments={addAttachments}
                removeAttachment={removeAttachment}
                handleInput={handleInput}
                handleSend={handleSend}
                cancelActiveRequest={cancelActiveRequest}
              />
            )}
          </div>
        ) : (
          <>
            <MessageList
              messages={messages}
              isLoading={isLoading}
              messagesEndRef={messagesEndRef}
              onRetry={retryLastResponse}
            />
            {isLimitReached ? (
              renderLimitBanner(false)
            ) : (
              <InputBar
                input={input}
                isLoading={isLoading}
                isHome={false}
                attachments={attachments}
                addAttachments={addAttachments}
                removeAttachment={removeAttachment}
                handleInput={handleInput}
                handleSend={handleSend}
                cancelActiveRequest={cancelActiveRequest}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
