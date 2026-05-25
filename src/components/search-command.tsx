"use client";

import * as React from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { MessageSquare } from "lucide-react";
import { useChatStore } from "@/store/chat-store";

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  
  if (date.toDateString() === now.toDateString()) {
    return "Today";
  }
  
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }
  
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function SearchCommand({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { sessions, switchSession } = useChatStore();

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} className="max-w-2xl">
      <Command>
        <CommandInput placeholder="Search chats..." />
        <CommandList className="max-h-[400px]">
          <CommandEmpty>No results found.</CommandEmpty>
          
          {sessions.length > 0 && (
            <CommandGroup heading="Recent Chats">
              {sessions.map((session) => {
                // Combine title and some message content to make them searchable
                const searchKeywords = [
                  session.title,
                  ...session.messages.map((m) => m.content),
                ].join(" ");

                return (
                  <CommandItem
                    key={session.id}
                    value={searchKeywords}
                    onSelect={() => {
                      switchSession(session.id);
                      onOpenChange(false);
                    }}
                    className="flex items-center justify-between py-3 px-4 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <MessageSquare className="size-4 text-muted-foreground shrink-0" />
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">{session.title}</span>
                        {session.messages.length > 0 && (
                          <span className="text-xs text-muted-foreground line-clamp-1 max-w-[400px]">
                            {session.messages[session.messages.length - 1]?.content || ""}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0 pl-4">
                      {formatTime(session.updatedAt)}
                    </span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}

