import React, { useState, useCallback } from "react";
import { type Message } from "@/lib/types";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 300)}px`;
  }, []);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Reset textarea heights after sending
    setTimeout(() => {
      const textareas = document.querySelectorAll("textarea");
      textareas.forEach((t) => (t.style.height = ""));
    }, 0);

    setIsLoading(true);

    // TODO: Replace this block with your LLM API call (Anthropic SDK, Vercel AI SDK, etc.)
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
    handleInput,
    handleSend,
  };
}
