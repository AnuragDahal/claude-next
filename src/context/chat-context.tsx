"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { type Message, type ChatSession } from "@/lib/types";

interface ChatContextType {
  messages: Message[];
  setMessages: (messages: Message[] | ((prev: Message[]) => Message[])) => void;
  sessions: ChatSession[];
  activeSessionId: string | null;
  createSession: () => void;
  switchSession: (id: string) => void;
  deleteSession: (id: string) => void;
  updateSessionTitle: (id: string, title: string) => void;
  resetChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("claude-sessions");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSessions(parsed);
        if (parsed.length > 0) {
          setActiveSessionId(parsed[0].id);
        }
      } catch (e) {
        console.error("Failed to parse sessions", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever sessions change
  useEffect(() => {
    if (isLoaded) {
      // TODO: Replace localStorage with your database (Supabase, Prisma, etc.)
      localStorage.setItem("claude-sessions", JSON.stringify(sessions));
    }
  }, [sessions, isLoaded]);

  const activeSession = sessions.find((s) => s.id === activeSessionId);
  const messages = activeSession?.messages || [];

  const createSession = useCallback(() => {
    const newSession: ChatSession = {
      id: Math.random().toString(36).substring(7),
      title: "Untitled",
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  }, []);

  const setMessages = useCallback((updater: Message[] | ((prev: Message[]) => Message[])) => {
    setSessions((prev) => {
      let currentActiveId = activeSessionId;
      let currentSessions = [...prev];
      
      // If no active session, create one
      if (!currentActiveId) {
        const newId = Math.random().toString(36).substring(7);
        const newSession: ChatSession = {
          id: newId,
          title: "Untitled",
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        currentSessions = [newSession, ...currentSessions];
        currentActiveId = newId;
        setActiveSessionId(newId);
      }

      const sessionIndex = currentSessions.findIndex((s) => s.id === currentActiveId);
      if (sessionIndex === -1) return prev;

      const session = currentSessions[sessionIndex];
      const newMessages = typeof updater === 'function' ? updater(session.messages) : updater;
      
      let newTitle = session.title;
      if (session.title === "Untitled" && newMessages.length > 0) {
        const firstUserMessage = newMessages.find(m => m.role === 'user');
        if (firstUserMessage) {
          newTitle = firstUserMessage.content.substring(0, 40);
        }
      }

      currentSessions[sessionIndex] = {
        ...session,
        messages: newMessages,
        title: newTitle,
        updatedAt: Date.now(),
      };
      
      return currentSessions;
    });
  }, [activeSessionId]);

  const switchSession = useCallback((id: string) => {
    setActiveSessionId(id);
  }, []);

  const deleteSession = useCallback((id: string) => {
    setSessions((prev) => {
      const filtered = prev.filter((s) => s.id !== id);
      return filtered;
    });
    setActiveSessionId((prev) => {
      if (prev === id) {
        const remaining = sessions.filter(s => s.id !== id);
        return remaining.length > 0 ? remaining[0].id : null;
      }
      return prev;
    });
  }, [activeSessionId, sessions]);

  const updateSessionTitle = useCallback((id: string, title: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, title, updatedAt: Date.now() } : s))
    );
  }, []);

  const resetChat = useCallback(() => {
    createSession();
  }, [createSession]);

  return (
    <ChatContext.Provider 
      value={{ 
        messages, 
        setMessages, 
        sessions, 
        activeSessionId, 
        createSession, 
        switchSession, 
        deleteSession, 
        updateSessionTitle,
        resetChat 
      }}
    >
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
