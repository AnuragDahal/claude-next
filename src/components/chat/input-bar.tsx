import { ArrowUp, ChevronDown, Paperclip, Plus, Square, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import React, { useRef, useEffect } from "react";
import { type Attachment } from "@/hooks/use-chat";
import { useChatStore } from "@/store/chat-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check } from "lucide-react";

interface InputBarProps {
  input: string;
  isLoading: boolean;
  isHome: boolean;
  attachments: Attachment[];
  addAttachments: (files: FileList) => void;
  removeAttachment: (index: number) => void;
  handleInput: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSend: () => void;
  cancelActiveRequest: () => void;
}

export function InputBar({
  input,
  isLoading,
  isHome,
  attachments,
  addAttachments,
  removeAttachment,
  handleInput,
  handleSend,
  cancelActiveRequest,
}: InputBarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { selectedModel, setSelectedModel } = useChatStore();

  const models = ["Sonnet 4.5", "Haiku 4.5", "Opus 5.6"];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addAttachments(e.target.files);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 240)}px`;
    }
  }, [input]);

  const renderAttachments = () => (
    <div className="flex flex-wrap gap-2 mb-2 px-2 pt-2">
      {attachments.map((attachment, index) => (
        <div
          key={index}
          className="relative group animate-in zoom-in-95 duration-200"
        >
          {attachment.type.startsWith("image/") ? (
            <div className="size-16 rounded-lg border border-border overflow-hidden bg-muted">
              <img
                src={attachment.preview}
                alt="preview"
                className="size-full object-cover"
              />
            </div>
          ) : (
            <div className="h-8 px-3 rounded-full border border-border bg-muted flex items-center gap-2 text-xs font-medium max-w-[150px]">
              <Paperclip className="size-3 shrink-0" />
              <span className="truncate">{attachment.name}</span>
            </div>
          )}
          <button
            onClick={() => removeAttachment(index)}
            className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-foreground text-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
          >
            <X className="size-3" />
          </button>
        </div>
      ))}
    </div>
  );

  const canSend = input.trim() || attachments.length > 0;

  return (
    <div
      className={cn(
        "w-full transition-all duration-500",
        isHome
          ? "max-w-2xl px-4"
          : "p-4 md:p-6 sticky bottom-0 bg-gradient-to-t from-background via-background to-transparent",
      )}
    >
      <input
        type="file"
        multiple
        hidden
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,.pdf,.txt"
      />
      <div
        className={cn(
          "relative flex flex-col mx-auto transition-all duration-300",
          isHome
            ? "bg-card border border-border rounded-[28px] p-2"
            : "max-w-3xl bg-card border border-border shadow-sm rounded-[2rem] p-1.5",
        )}
      >
        {attachments.length > 0 && renderAttachments()}
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={handleInput}
          placeholder="How can I help you today?"
          className={cn(
            "w-full min-h-[44px] max-h-[240px] overflow-y-auto bg-transparent dark:bg-transparent border-none focus-visible:ring-0 resize-none py-3 px-6 text-base placeholder:text-muted-foreground/40 placeholder:animate-in placeholder:fade-in placeholder:duration-1000 leading-relaxed shadow-none",
            isHome && "min-h-[100px] text-lg py-5",
          )}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (isLoading) {
                cancelActiveRequest();
                return;
              }
              handleSend();
            }
          }}
          disabled={isLoading && !canSend}
          rows={1}
        />
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              className="size-9 rounded-full hover:bg-muted text-muted-foreground"
            >
              <Plus className="size-5" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1.5 rounded-xl px-3 text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
                >
                  <span className="text-xs font-medium">{selectedModel}</span>
                  <ChevronDown className="size-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-[200px] rounded-xl p-1 shadow-2xl"
              >
                {models.map((model) => (
                  <DropdownMenuItem
                    key={model}
                    className="gap-2 py-2 rounded-lg cursor-pointer"
                    onClick={() => setSelectedModel(model)}
                  >
                    <span className="flex-1 text-sm">{model}</span>
                    {selectedModel === model && (
                      <Check className="size-4 text-primary" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="h-4 w-px bg-border/20 mx-1" />

            <Button
              onClick={isLoading ? cancelActiveRequest : handleSend}
              disabled={!isLoading && !canSend}
              variant={canSend ? "default" : "ghost"}
              size="icon"
              className={cn(
                "size-9 rounded-full transition-all duration-200",
                isLoading
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : canSend
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "hover:bg-muted text-muted-foreground",
              )}
            >
              {isLoading ? (
                <Square className="size-4 fill-current" />
              ) : (
                <ArrowUp className="size-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
      {!isHome && (
        <p className="mt-3 text-center text-[11px] text-muted-foreground/60 tracking-tight">
          Claude is AI and can make mistakes. Please double-check responses.
        </p>
      )}
    </div>
  );
}
