"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  ArrowUpCircle,
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  Download,
  Globe,
  HelpCircle,
  Info,
  LogOut,
  MessageSquare,
  Moon,
  PanelLeft,
  Plus,
  Search,
  Settings,
  Sun,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { SearchCommand } from "./search-command";
import { useChatStore } from "@/store/chat-store";
import { useAuth } from "@/context/auth-context";

export function ChatSidebar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const { state, toggleSidebar } = useSidebar();
  const {
    sessions,
    activeSessionId,
    switchSession,
    deleteSession,
    createSession,
  } = useChatStore();
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  if (!mounted) {
    return (
      <Sidebar collapsible="icon" className="border-r border-border bg-sidebar">
        <SidebarHeader
          className={cn(
            "pt-6 pb-0 flex flex-row items-center gap-4 px-2 justify-center",
          )}
        >
          <div className="size-8 rounded-lg bg-sidebar-accent animate-pulse" />
        </SidebarHeader>
        <SidebarContent className="scrollbar-none pt-2" />
      </Sidebar>
    );
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-border bg-sidebar">
      <SearchCommand open={searchOpen} onOpenChange={setSearchOpen} />

      <SidebarHeader
        className={cn(
          "pt-6 pb-0 flex flex-row items-center gap-4",
          state === "expanded" ? "px-4 justify-between" : "px-2 justify-center",
        )}
      >
        {state === "expanded" && (
          <h1
            className="text-2xl font-serif font-medium tracking-tight cursor-pointer hover:opacity-80 transition-opacity"
            onClick={createSession}
          >
            Claude
          </h1>
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
              onClick={toggleSidebar}
            >
              <PanelLeft className="size-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            {state === "expanded" ? "Close sidebar" : "Open sidebar"}
          </TooltipContent>
        </Tooltip>
      </SidebarHeader>

      <SidebarContent className="scrollbar-none pt-2">
        <SidebarGroup className={state === "expanded" ? "px-4" : "px-2"}>
          <SidebarMenu
            className={cn(state === "expanded" ? "" : "items-center", "gap-1")}
          >
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="New chat"
                onClick={createSession}
                className="h-10 gap-3 rounded-xl hover:bg-sidebar-accent px-2 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center cursor-pointer"
              >
                <div className="w-6 flex items-center justify-center shrink-0">
                  <div className="size-6 rounded-full border border-border flex items-center justify-center bg-sidebar shadow-sm shrink-0">
                    <Plus className="size-3.5" />
                  </div>
                </div>
                <span className="font-medium group-data-[collapsible=icon]:hidden">
                  New chat
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Search"
                onClick={() => setSearchOpen(true)}
                className="h-10 gap-3 rounded-xl hover:bg-sidebar-accent px-2 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center cursor-pointer"
              >
                <div className="w-6 flex items-center justify-center shrink-0">
                  <Search className="size-5 shrink-0" />
                </div>
                <span className="font-medium text-muted-foreground/80 group-data-[collapsible=icon]:hidden">
                  Search
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Chats"
                className="h-10 gap-3 rounded-xl hover:bg-sidebar-accent px-2 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center cursor-pointer"
              >
                <div className="w-6 flex items-center justify-center shrink-0">
                  <MessageSquare className="size-5" />
                </div>
                <span className="font-medium text-muted-foreground/80 group-data-[collapsible=icon]:hidden">
                  Chats
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup
          className={cn("mt-4 px-4", state === "collapsed" && "hidden")}
        >
          <SidebarGroupLabel className="px-0 text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider">
            Recents
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {sessions.map((session) => (
                <SidebarMenuItem key={session.id} className="group/item">
                  <SidebarMenuButton
                    tooltip={session.title}
                    onClick={() => switchSession(session.id)}
                    isActive={activeSessionId === session.id}
                    className="h-9 px-2 rounded-lg cursor-pointer"
                  >
                    <span className="truncate flex-1">{session.title}</span>
                  </SidebarMenuButton>
                  <SidebarMenuAction
                    showOnHover
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSession(session.id);
                    }}
                    className="size-5"
                  >
                    <X className="size-3" />
                    <span className="sr-only">Delete chat</span>
                  </SidebarMenuAction>
                </SidebarMenuItem>
              ))}
              {sessions.length === 0 && (
                <div className="px-2 py-4 text-xs text-muted-foreground/60 text-center italic">
                  No recent chats
                </div>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <div className="mt-auto">
        <Separator
          className={cn("bg-border/50", state === "collapsed" && "hidden")}
        />
        <SidebarFooter
          className={cn(
            "flex flex-col",
            state === "expanded" ? "p-4" : "p-2 gap-4",
          )}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div
                className={cn(
                  "cursor-pointer hover:bg-sidebar-accent/50 rounded-xl transition-colors",
                  state === "expanded"
                    ? "flex items-center justify-between w-full p-2 -m-2"
                    : "flex flex-col items-center justify-center p-2",
                )}
              >
                <div className="flex items-center gap-3">
                  <Avatar
                    className={cn(
                      "border border-border",
                      state === "expanded" ? "size-10" : "size-8",
                    )}
                  >
                    {user?.image && (
                      <AvatarImage src={user.image} alt={user.name || "User"} />
                    )}
                    <AvatarFallback className="bg-foreground text-background font-bold text-base">
                      {user?.name?.[0] || "A"}
                    </AvatarFallback>
                  </Avatar>
                  {state === "expanded" && (
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold truncate max-w-[120px]">
                        {user?.name || "Anurag"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Free plan
                      </span>
                    </div>
                  )}
                </div>
                {state === "expanded" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 rounded-lg text-muted-foreground"
                  >
                    <ChevronsUpDown className="size-4" />
                  </Button>
                )}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              side="top"
              className="w-[280px] rounded-2xl p-2 shadow-2xl"
            >
              <div className="px-3 py-2 text-xs font-medium text-muted-foreground truncate">
                {user?.email || "079bct010@ioepc.edu.np"}
              </div>

              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-3 py-2.5 rounded-xl">
                <Settings className="size-4" />
                <span className="flex-1 font-medium">Settings</span>
                <span className="text-[10px] text-muted-foreground">
                  ↑Ctrl,
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-3 py-2.5 rounded-xl">
                <Globe className="size-4" />
                <span className="flex-1 font-medium">Language</span>
                <ChevronDown className="size-4 text-muted-foreground" />
              </DropdownMenuItem>
              <DropdownMenuItem
                className="gap-3 py-2.5 rounded-xl cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  setTheme(theme === "dark" ? "light" : "dark");
                }}
              >
                {theme === "dark" ? (
                  <Sun className="size-4" />
                ) : (
                  <Moon className="size-4" />
                )}
                <span className="flex-1 font-medium">Appearance</span>
                <span className="text-xs text-muted-foreground capitalize">
                  {theme}
                </span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-3 py-2.5 rounded-xl">
                <HelpCircle className="size-4" />

                <span className="font-medium">Get help</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-3 py-2.5 rounded-xl">
                <ArrowUpCircle className="size-4" />
                <span className="font-medium">Upgrade plan</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-3 py-2.5 rounded-xl">
                <Download className="size-4" />
                <span className="font-medium">Get apps and extensions</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-3 py-2.5 rounded-xl">
                <Info className="size-4" />
                <span className="flex-1 font-medium">Learn more</span>
                <ChevronRight className="size-4 text-muted-foreground" />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-3 py-2.5 rounded-xl text-destructive focus:text-destructive cursor-pointer"
                onClick={() => signOut({ callbackUrl: "/login" })}
              >
                <LogOut className="size-4" />
                <span className="font-medium">Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </div>
    </Sidebar>
  );
}
