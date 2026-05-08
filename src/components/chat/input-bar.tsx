import { ArrowUp, AudioLines, ChevronDown, Paperclip, Plus, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import React, { useRef } from "react";
import { type Attachment } from "@/hooks/use-chat";

interface InputBarProps {
  input: string;
  isLoading: boolean;
  isHome: boolean;
  attachments: Attachment[];
  addAttachments: (files: FileList) => void;
  removeAttachment: (index: number) => void;
  handleInput: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSend: () => void;
}

export function InputBar({ 
  input, 
  isLoading, 
  isHome, 
  attachments,
  addAttachments,
  removeAttachment,
  handleInput, 
  handleSend 
}: InputBarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addAttachments(e.target.files);
    }
  };

  const renderAttachments = () => (
    <div className="flex flex-wrap gap-2 mb-2 px-2">
      {attachments.map((attachment, index) => (
        <div key={index} className="relative group animate-in zoom-in-95 duration-200">
          {attachment.type.startsWith("image/") ? (
            <div className="size-16 rounded-lg border border-border overflow-hidden bg-muted">
              <img src={attachment.preview} alt="preview" className="size-full object-cover" />
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

  if (isHome) {
    return (
      <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
        <input 
          type="file" 
          multiple 
          hidden 
          ref={fileInputRef} 
          onChange={handleFileChange}
          accept="image/*,.pdf,.txt"
        />
        <div className="relative group bg-card border border-border rounded-[28px] p-1.5 transition-all hover:border-border/80 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/5">
          {attachments.length > 0 && renderAttachments()}
          <Textarea
            value={input}
            onChange={handleInput}
            placeholder="How can I help you today?"
            className="w-full min-h-[100px] max-h-[300px] overflow-y-auto bg-transparent border-none focus-visible:ring-0 resize-none py-5 px-6 text-base md:text-lg placeholder:text-muted-foreground/60 leading-relaxed shadow-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={isLoading}
            rows={1}
          />
          <div className="flex items-center justify-between px-4 py-2 border-t border-border/5">
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
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 rounded-xl px-3 text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <span className="text-xs font-medium">Sonnet 3.5</span>
                <ChevronDown className="size-3.5" />
              </Button>
              <div className="h-4 w-px bg-border/10 mx-1" />
              <Button
                onClick={handleSend}
                variant={input.trim() || attachments.length > 0 ? "default" : "ghost"}
                size="icon"
                className={cn(
                  "size-9 rounded-full transition-all duration-200",
                  (input.trim() || attachments.length > 0)
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "hover:bg-muted text-muted-foreground",
                )}
              >
                {(input.trim() || attachments.length > 0) ? (
                  <ArrowUp className="size-5" />
                ) : (
                  <AudioLines className="size-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-transparent animate-in fade-in slide-in-from-bottom-4 duration-500">
      <input 
        type="file" 
        multiple 
        hidden 
        ref={fileInputRef} 
        onChange={handleFileChange}
        accept="image/*,.pdf,.txt"
      />
      <div className="max-w-3xl mx-auto relative">
        <div className="relative flex flex-col bg-card border border-border shadow-sm rounded-[2rem] p-1.5 transition-all hover:border-border/80 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/5">
          {attachments.length > 0 && renderAttachments()}
          <Textarea
            value={input}
            onChange={handleInput}
            placeholder="Reply to Claude..."
            className="w-full min-h-[44px] max-h-[300px] overflow-y-auto bg-transparent border-none focus-visible:ring-0 resize-none py-3 px-6 text-base placeholder:text-muted-foreground/60 leading-relaxed shadow-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={isLoading}
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
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 rounded-xl px-3 text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <span className="text-xs font-medium">Sonnet 4.6</span>
                <ChevronDown className="size-3.5" />
              </Button>
              <div className="h-4 w-px bg-border/20 mx-1" />
              <Button
                onClick={handleSend}
                disabled={(!input.trim() && attachments.length === 0) || isLoading}
                variant={input.trim() || attachments.length > 0 ? "default" : "ghost"}
                size="icon"
                className={cn(
                  "size-9 rounded-full transition-all duration-200",
                  (input.trim() || attachments.length > 0)
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "hover:bg-muted text-muted-foreground",
                )}
              >
                {isLoading ? (
                  <div className="size-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                ) : (input.trim() || attachments.length > 0) ? (
                  <ArrowUp className="size-5" />
                ) : (
                  <AudioLines className="size-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
        <p className="mt-3 text-center text-[11px] text-muted-foreground/60 tracking-tight">
          Claude is AI and can make mistakes. Please double-check responses.
        </p>
      </div>
    </div>
  );
}
