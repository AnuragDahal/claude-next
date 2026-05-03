"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { type Message } from "@/lib/types";

interface ChatContextType {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  resetChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);

  const resetChat = useCallback(() => {
    setMessages([]);
    // TODO: Replace with your persistence layer (localStorage, Supabase, Postgres, etc.)
  }, []);

  return (
    <ChatContext.Provider value={{ messages, setMessages, resetChat }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
}
