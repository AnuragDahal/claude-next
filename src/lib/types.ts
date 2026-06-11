import type { UIMessage as AIMessage } from "ai";


export type MessageStatus = "idle" | "streaming" | "error" | "cancelled";

export type Message = AIMessage & {
  content: string;
  attachments?: { preview: string; type: string; name: string }[];
  timestamp?: number;
  status?: MessageStatus;
};

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}
