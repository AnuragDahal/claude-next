import React, { useState, useCallback, useEffect } from "react";
import { type Message } from "@/lib/types";
import { useChatContext } from "@/context/chat-context";

export interface Attachment {
  file: File;
  preview: string;
  type: string;
  name: string;
}

export function useChat() {
  const { messages, setMessages } = useChatContext();
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
    };

    setMessages((prev) => [...prev, userMessage]);
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
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: [...messages, userMessage],
          // attachments are handled locally for now
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to get response from AI");
      }

      const assistantId = (Date.now() + 1).toString();
      const assistantMessage: Message = {
        id: assistantId,
        role: "assistant",
        content: "",
      };

      setMessages((prev) => [...prev, assistantMessage]);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value, { stream: true });
          accumulatedContent += chunk;

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantId ? { ...msg, content: accumulatedContent } : msg,
            ),
          );
        }
      }
    } catch (error) {
      console.error("Streaming error:", error);
      // Fallback message
      const errorId = (Date.now() + 2).toString();
      setMessages((prev) => [...prev, {
        id: errorId,
        role: "assistant",
        content: "Sorry, I encountered an error. Please make sure your GEMINI_API_KEY is set in .env.local."
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, attachments, isLoading, messages, setMessages]);

  return {
    messages,
    setMessages,
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
