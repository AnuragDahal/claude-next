import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  type Message,
  type ChatSession,
  type MessageStatus,
} from "@/lib/types";

interface ChatState {
  sessions: ChatSession[];
  activeSessionId: string | null;
  createSession: () => string;
  switchSession: (id: string) => void;
  deleteSession: (id: string) => void;
  addMessage: (message: Message) => void;
  updateMessage: (id: string, content: string) => void;
  updateMessageStatus: (id: string, status: MessageStatus) => void;
  removeMessage: (id: string) => void;
  updateSessionTitle: (id: string, title: string) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  getActiveSession: () => ChatSession | null;
  clearSessions: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      sessions: [],
      activeSessionId: null,
      selectedModel: "Sonnet 4.5",

      setSelectedModel: (model) => {
        set({ selectedModel: model });
      },

      createSession: () => {
        const newSession: ChatSession = {
          id: Math.random().toString(36).substring(7),
          title: "Untitled",
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set((state) => ({
          sessions: [newSession, ...state.sessions],
          activeSessionId: newSession.id,
        }));
        return newSession.id;
      },

      switchSession: (id) => {
        set({ activeSessionId: id });
      },

      deleteSession: (id) => {
        set((state) => {
          const filtered = state.sessions.filter((s) => s.id !== id);
          let nextActiveId = state.activeSessionId;

          if (state.activeSessionId === id) {
            nextActiveId = filtered.length > 0 ? filtered[0].id : null;
          }

          return {
            sessions: filtered,
            activeSessionId: nextActiveId,
          };
        });

        if (get().sessions.length === 0) {
          get().createSession();
        }
      },

      addMessage: (message) => {
        let activeId = get().activeSessionId;
        if (!activeId) {
          activeId = get().createSession();
        }

        set((state) => {
          const sessionIndex = state.sessions.findIndex(
            (s) => s.id === activeId,
          );
          if (sessionIndex === -1) return state;

          const session = state.sessions[sessionIndex];
          const newMessages = [...session.messages, message];

          let newTitle = session.title;
          if (session.title === "Untitled" && message.role === "user") {
            newTitle = message.content.substring(0, 40);
          }

          const updatedSessions = [...state.sessions];
          updatedSessions[sessionIndex] = {
            ...session,
            messages: newMessages,
            title: newTitle,
            updatedAt: Date.now(),
          };

          return { sessions: updatedSessions };
        });
      },

      updateMessage: (id, content) => {
        const activeId = get().activeSessionId;
        if (!activeId) return;

        set((state) => {
          const sessionIndex = state.sessions.findIndex(
            (s) => s.id === activeId,
          );
          if (sessionIndex === -1) return state;

          const session = state.sessions[sessionIndex];
          const updatedMessages = session.messages.map((m) =>
            m.id === id ? { ...m, content } : m,
          );

          const updatedSessions = [...state.sessions];
          updatedSessions[sessionIndex] = {
            ...session,
            messages: updatedMessages,
            updatedAt: Date.now(),
          };

          return { sessions: updatedSessions };
        });
      },

      updateMessageStatus: (id, status) => {
        const activeId = get().activeSessionId;
        if (!activeId) return;

        set((state) => {
          const sessionIndex = state.sessions.findIndex(
            (s) => s.id === activeId,
          );
          if (sessionIndex === -1) return state;

          const session = state.sessions[sessionIndex];
          const updatedMessages = session.messages.map((m) =>
            m.id === id ? { ...m, status } : m,
          );

          const updatedSessions = [...state.sessions];
          updatedSessions[sessionIndex] = {
            ...session,
            messages: updatedMessages,
            updatedAt: Date.now(),
          };

          return { sessions: updatedSessions };
        });
      },

      removeMessage: (id) => {
        const activeId = get().activeSessionId;
        if (!activeId) return;

        set((state) => {
          const sessionIndex = state.sessions.findIndex(
            (s) => s.id === activeId,
          );
          if (sessionIndex === -1) return state;

          const session = state.sessions[sessionIndex];
          const updatedMessages = session.messages.filter((m) => m.id !== id);

          const updatedSessions = [...state.sessions];
          updatedSessions[sessionIndex] = {
            ...session,
            messages: updatedMessages,
            updatedAt: Date.now(),
          };

          return { sessions: updatedSessions };
        });
      },

      updateSessionTitle: (id, title) => {
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === id ? { ...s, title, updatedAt: Date.now() } : s,
          ),
        }));
      },

      getActiveSession: () => {
        const { sessions, activeSessionId } = get();
        return sessions.find((s) => s.id === activeSessionId) || null;
      },

      clearSessions: () => {
        set({ sessions: [], activeSessionId: null });
      },
    }),
    {
      name: "claude-sessions",
    },
  ),
);
