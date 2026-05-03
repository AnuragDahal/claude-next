import { useEffect, useRef } from "react";
import { type Message } from "@/lib/types";

export function useScroll(messages: Message[]) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return messagesEndRef;
}
