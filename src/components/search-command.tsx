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
import { MessageSquare, Folder, Clock } from "lucide-react";

export function SearchCommand({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} className="max-w-2xl">
      <Command>
        <CommandInput placeholder="Search chats and projects" />
        <CommandList className="max-h-[400px]">
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Recent">
          {[
            { title: "How to use Claude", type: "project", time: "Enter" },
            { title: "Untitled conversation", type: "chat", time: "Today" },
            { title: "Electromagnetics question paper analysis", type: "chat", time: "Today" },
            { title: "Claude-code UI clone idea", type: "chat", time: "Yesterday" },
            { title: "Creating monitoring solutions", type: "chat", time: "Yesterday" },
            { title: "Frontend development for backend project", type: "chat", time: "Yesterday" },
            { title: "Optimizing document analysis with Gemini API token limits", type: "chat", time: "Past week" },
          ].map((item, i) => (
            <CommandItem key={i} className="flex items-center justify-between py-3 px-4">
              <div className="flex items-center gap-3">
                {item.type === "project" && (
                  <Folder className="size-4 text-muted-foreground" />
                )}
                <span className="font-medium">{item.title}</span>
              </div>
              <span className="text-xs text-muted-foreground">{item.time}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
      </Command>
    </CommandDialog>
  );
}
