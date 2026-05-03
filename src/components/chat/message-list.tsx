import { ScrollArea } from "@/components/ui/scroll-area";
import { type Message } from "@/lib/types";
import { MessageBubble } from "./message-bubble";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export function MessageList({ messages, isLoading, messagesEndRef }: MessageListProps) {
  return (
    <ScrollArea className="flex-1 px-4 md:px-0">
      <div className="max-w-3xl mx-auto py-8 flex flex-col gap-10">
        {messages.map((message) => (
          <MessageBubble 
            key={message.id} 
            message={message} 
            isLoading={isLoading} 
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}
