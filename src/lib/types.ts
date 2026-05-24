export type MessageStatus = "idle" | "streaming" | "error" | "cancelled";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  attachments?: { preview: string; type: string; name: string }[];
  timestamp?: number;
  status?: MessageStatus;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}
