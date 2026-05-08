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

    // TODO: Switch model or provider here — swap Gemini for Anthropic/OpenAI if needed
    // Simulate thinking delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const assistantId = (Date.now() + 1).toString();
    const assistantMessage: Message = {
      id: assistantId,
      role: "assistant",
      content: "",
    };

    setMessages((prev) => [...prev, assistantMessage]);

    const fullResponse =
      "I'm a Claude clone UI built with shadcn and Next.js. I've been updated to support simulated streaming and a more dynamic interface! How can I help you further today?";

    let currentText = "";
    const words = fullResponse.split(" ");

    for (let i = 0; i < words.length; i++) {
      currentText += (i === 0 ? "" : " ") + words[i];
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantId ? { ...msg, content: currentText } : msg,
        ),
      );
      await new Promise((resolve) =>
        setTimeout(resolve, 50 + Math.random() * 50),
      );
    }

    setIsLoading(false);
  }, [input, isLoading]);

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
