import { useRef } from "react";
import { type Message } from "@/lib/types";

export function useScroll(messages: Message[]) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  return messagesEndRef;
}
