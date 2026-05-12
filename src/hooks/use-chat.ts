import React, { useState, useCallback, useEffect } from "react";
import { type Message } from "@/lib/types";
import { useChatStore } from "@/store/chat-store";
import api from "@/lib/axios";

export interface Attachment {
  file: File;
  preview: string;
  type: string;
  name: string;
}

export function useChat() {
  const { addMessage, updateMessage, getActiveSession } = useChatStore();
  const activeSession = getActiveSession();
  const messages = activeSession?.messages || [];
  
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      attachments.forEach((a) => URL.revokeObjectURL(a.preview));
    };
  }, [attachments]);

  const handleInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 300)}px`;
  }, []);

  const addAttachments = useCallback((files: FileList) => {
    const newAttachments: Attachment[] = [];
    Array.from(files).forEach((file) => {
      const preview = URL.createObjectURL(file);
      newAttachments.push({
        file,
        preview,
        type: file.type,
        name: file.name,
      });
    });
    setAttachments((prev) => [...prev, ...newAttachments]);
  }, []);

  const removeAttachment = useCallback((index: number) => {
    setAttachments((prev) => {
      const newAttachments = [...prev];
      URL.revokeObjectURL(newAttachments[index].preview);
      newAttachments.splice(index, 1);
      return newAttachments;
    });
  }, []);

  const handleSend = useCallback(async () => {
    if ((!input.trim() && attachments.length === 0) || isLoading) return;

    // TODO: Upload file to storage (Supabase, S3, etc.) before sending to LLM
    const messageAttachments = attachments.map(a => ({
      preview: a.preview,
      type: a.type,
      name: a.name
    }));

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      attachments: messageAttachments.length > 0 ? messageAttachments : undefined,
      timestamp: Date.now(),
    };

    addMessage(userMessage);
    setInput("");
    setAttachments([]);

    // Reset textarea heights after sending
    setTimeout(() => {
      const textareas = document.querySelectorAll("textarea");
      textareas.forEach((t) => (t.style.height = ""));
    }, 0);

    setIsLoading(true);

    try {
      // TODO: Switch model or provider here — swap Gemini for Anthropic/OpenAI if needed
      const assistantId = (Date.now() + 1).toString();
      const assistantMessage: Message = {
        id: assistantId,
        role: "assistant",
        content: "",
        timestamp: Date.now(),
      };

      addMessage(assistantMessage);

      await api.post("/api/chat", { 
        messages: [...messages, userMessage],
      }, {
        responseType: "text",
        onDownloadProgress: (progressEvent) => {
          const content = progressEvent.event.target.responseText;
          updateMessage(assistantId, content);
        }
      });
    } catch (error) {
      console.error("Streaming error:", error);
      // Fallback message
      const errorId = (Date.now() + 2).toString();
      addMessage({
        id: errorId,
        role: "assistant",
        content: "Sorry, I encountered an error. Please make sure your GEMINI_API_KEY is set in .env.local.",
        timestamp: Date.now(),
      });
    } finally {
      setIsLoading(false);
    }
  }, [input, attachments, isLoading, messages, addMessage, updateMessage]);

  return {
    messages,
    input,
    setInput,
    isLoading,
    attachments,
    addAttachments,
    removeAttachment,
    handleInput,
    handleSend,
  };
}
