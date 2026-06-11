import React, { useState, useCallback, useEffect } from "react";
import { type Message } from "@/lib/types";
import { useChatStore } from "@/store/chat-store";
import { useAuth } from "@/context/auth-context";
import { useChat as useAiChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

export interface Attachment {
  file: File;
  preview: string;
  type: string;
  name: string;
}

export function useChat() {
  const { getActiveSession, sessions, syncMessages } = useChatStore();

  const activeSession = getActiveSession();
  const { user } = useAuth();
  
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  useEffect(() => {
    return () => {
      attachments.forEach((a) => URL.revokeObjectURL(a.preview));
    };
  }, [attachments]);

  const {
    messages: rawMessages,
    setMessages,
    sendMessage,
    stop,
    regenerate,
    error,
    status
  } = useAiChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
    id: activeSession?.id || "default",
    messages: activeSession?.messages || [],
  });

  const getMessageContent = useCallback((m: any): string => {
    if (m.content !== undefined) return m.content;
    if (m.parts && Array.isArray(m.parts)) {
      return m.parts
        .filter((part: any) => part.type === "text")
        .map((part: any) => part.text)
        .join("");
    }
    return "";
  }, []);

  const messages: Message[] = React.useMemo(() => {
    return rawMessages.map((m) => ({
      ...m,
      content: getMessageContent(m),
    }));
  }, [rawMessages, getMessageContent]);

  const isLoading = status === "streaming" || status === "submitted";

  // Sync to chat-store when messages update
  useEffect(() => {
    if (activeSession?.id && messages.length > 0) {
      syncMessages(activeSession.id, messages);
    }
  }, [messages, activeSession?.id, syncMessages]);

  // Handle active session switch to load correct messages
  useEffect(() => {
    if (activeSession) {
      setMessages(activeSession.messages || []);
    } else {
      setMessages([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSession?.id, setMessages]);

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value);
      e.target.style.height = "auto";
      e.target.style.height = `${Math.min(e.target.scrollHeight, 300)}px`;
    },
    [setInput],
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
  }, [setInput]);

  const handleSend = useCallback(async () => {
    if ((!input.trim() && attachments.length === 0) || isLoading) return;

    const totalUserMessages = sessions.reduce(
      (acc, s) => acc + s.messages.filter((m) => m.role === "user").length,
      0,
    );

    if (!user && totalUserMessages >= 5) {
      window.location.href = "/login";
      return;
    }

    // Build a FileList from the File[] for sendMessage
    const currentInput = input;
    let fileList: FileList | undefined;
    if (attachments.length > 0) {
      const dt = new DataTransfer();
      attachments.forEach((a) => dt.items.add(a.file));
      fileList = dt.files;
    }

    resetComposer();

    await sendMessage({
      text: currentInput,
      ...(fileList && fileList.length > 0 && { files: fileList }),
    });
  }, [input, attachments, isLoading, user, sessions, sendMessage, resetComposer]);

  const cancelActiveRequest = useCallback(() => {
    stop();
  }, [stop]);

  const retryLastResponse = useCallback(() => {
    regenerate();
  }, [regenerate]);

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

