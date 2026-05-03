import { ArrowUp, AudioLines, ChevronDown, Plus, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface InputBarProps {
  input: string;
  isLoading: boolean;
  isHome: boolean;
  handleInput: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSend: () => void;
}

export function InputBar({ input, isLoading, isHome, handleInput, handleSend }: InputBarProps) {
  if (isHome) {
    return (
      <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
        <div className="relative group bg-card border border-border rounded-[28px] p-1.5 transition-all hover:border-border/80 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/5">
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
                className="size-9 rounded-full hover:bg-muted text-muted-foreground"
              >
                <Plus className="size-5" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              {/* // TODO: Wire this to your available models list */}
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
                variant={input.trim() ? "default" : "ghost"}
                size="icon"
                className={cn(
                  "size-9 rounded-full transition-all duration-200",
                  input.trim()
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "hover:bg-muted text-muted-foreground",
                )}
              >
                {input.trim() ? (
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
    <div className="p-4 md:p-6 bg-background animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-3xl mx-auto relative">
        <div className="relative flex items-end gap-2 p-2 bg-muted/30 border border-border rounded-2xl focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
          <Button
            variant="ghost"
            size="icon"
            className="size-9 rounded-xl text-muted-foreground hover:text-foreground"
          >
            <Plus className="size-5" />
          </Button>
          <Textarea
            value={input}
            onChange={handleInput}
            placeholder="Message Claude..."
            className="flex-1 min-h-[80px] max-h-[300px] overflow-y-auto bg-transparent border-none focus-visible:ring-0 resize-none py-3 px-1 text-base md:text-lg placeholder:text-muted-foreground/60 leading-relaxed shadow-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={isLoading}
            rows={1}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="size-9 rounded-xl shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:bg-muted"
          >
            {isLoading ? (
              <div className="size-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
          </Button>
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Claude can make mistakes. Please double-check responses.
        </p>
      </div>
    </div>
  );
}
