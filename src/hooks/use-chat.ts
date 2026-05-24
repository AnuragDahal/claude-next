import React, { useState, useCallback, useEffect, useRef } from "react";
import { type Message } from "@/lib/types";
import { useChatStore } from "@/store/chat-store";
import api from "@/lib/axios";
import { useAuth } from "@/context/auth-context";

export interface Attachment {
  file: File;
  preview: string;
  type: string;
  name: string;
}

export function useChat() {
  const {
    addMessage,
    updateMessage,
    updateMessageStatus,
    removeMessage,
    getActiveSession,
    sessions,
  } = useChatStore();

  const activeSession = getActiveSession();
  const messages = activeSession?.messages || [];
  const { user } = useAuth();

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
      attachments.forEach((a) => URL.revokeObjectURL(a.preview));
    };
  }, [attachments]);

  const isAbortError = useCallback((error: unknown) => {
    if (!error || typeof error !== "object") return false;

    const name = "name" in error ? String(error.name) : "";
    const code = "code" in error ? String(error.code) : "";
    const message = "message" in error ? String(error.message) : "";

    return (
      name === "CanceledError" ||
      name === "AbortError" ||
      code === "ERR_CANCELED" ||
      message.toLowerCase().includes("cancel")
    );
  }, []);

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value);
      e.target.style.height = "auto";
      e.target.style.height = `${Math.min(e.target.scrollHeight, 300)}px`;
    },
    [],
  );

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

  const resetComposer = useCallback(() => {
    setInput("");
    setAttachments([]);

    setTimeout(() => {
      const textareas = document.querySelectorAll("textarea");
      textareas.forEach((t) => (t.style.height = ""));
    }, 0);
  }, []);

  const cancelActiveRequest = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  const sendMessage = useCallback(
    async (messageContent: string, messageAttachments: Attachment[] = []) => {
      if (
        (!messageContent.trim() && messageAttachments.length === 0) ||
        isLoading
      )
        return;

      const totalUserMessages = sessions.reduce(
        (acc, s) => acc + s.messages.filter((m) => m.role === "user").length,
        0,
      );

      if (!user && totalUserMessages >= 5) {
        window.location.href = "/login";
        return;
      }

      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: messageContent,
        attachments:
          messageAttachments.length > 0
            ? messageAttachments.map((attachment) => ({
                preview: attachment.preview,
                type: attachment.type,
                name: attachment.name,
              }))
            : undefined,
        timestamp: Date.now(),
      };

      addMessage(userMessage);
      resetComposer();

      const assistantId = (Date.now() + 1).toString();
      addMessage({
        id: assistantId,
        role: "assistant",
        content: "",
        timestamp: Date.now(),
        status: "streaming",
      });

      const requestMessages = [...messages, userMessage];
      const controller = new AbortController();
      abortControllerRef.current = controller;
      setIsLoading(true);

      try {
        await api.post(
          "/api/chat",
          {
            messages: requestMessages,
          },
          {
            responseType: "text",
            signal: controller.signal,
            onDownloadProgress: (progressEvent) => {
              const content = progressEvent.event.target.responseText;
              updateMessage(assistantId, content);
            },
          },
        );

        updateMessageStatus(assistantId, "idle");
      } catch (error) {
        const currentAssistant = getActiveSession()?.messages.find(
          (m) => m.id === assistantId,
        );

        if (isAbortError(error)) {
          if (!currentAssistant?.content) {
            updateMessage(assistantId, "Generation cancelled.");
          }
          updateMessageStatus(assistantId, "cancelled");
        } else {
          if (!currentAssistant?.content) {
            updateMessage(
              assistantId,
              "Sorry, I encountered an error. Please try again.",
            );
          }
          updateMessageStatus(assistantId, "error");
        }
      } finally {
        abortControllerRef.current = null;
        setIsLoading(false);
      }
    },
    [
      addMessage,
      getActiveSession,
      isAbortError,
      isLoading,
      messages,
      resetComposer,
      sessions,
      updateMessage,
      updateMessageStatus,
      user,
    ],
  );

  const handleSend = useCallback(() => {
    sendMessage(input, attachments);
  }, [attachments, input, sendMessage]);

  const retryLastResponse = useCallback(() => {
    const activeSession = getActiveSession();
    if (!activeSession) return;

    const lastAssistant = [...activeSession.messages]
      .reverse()
      .find((message) => message.role === "assistant");
    if (
      !lastAssistant ||
      (lastAssistant.status !== "error" && lastAssistant.status !== "cancelled")
    ) {
      return;
    }

    const lastUser = [...activeSession.messages]
      .reverse()
      .find((message) => message.role === "user");
    if (!lastUser) return;

    removeMessage(lastAssistant.id);
    sendMessage(lastUser.content);
  }, [getActiveSession, removeMessage, sendMessage]);

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
    cancelActiveRequest,
    retryLastResponse,
  };
}
