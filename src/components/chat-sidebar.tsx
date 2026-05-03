"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  ArrowUpCircle,
  Box,
  Briefcase,
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  Code2,
  Download,
  Globe,
  HelpCircle,
  Info,
  Layers,
  LogOut,
  MessageSquare,
  PanelLeft,
  Plus,
  Search,
  Settings,
} from "lucide-react";
import React from "react";
import { SearchCommand } from "./search-command";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function ChatSidebar() {
  const [searchOpen, setSearchOpen] = React.useState(false);
  const { state, toggleSidebar } = useSidebar();

  return (
    <Sidebar collapsible="icon" className="border-r border-border bg-sidebar">
      <SearchCommand open={searchOpen} onOpenChange={setSearchOpen} />

      <SidebarHeader className="px-4 pt-6 pb-0 flex flex-col gap-4">
        {state === "expanded" && (
          <div>
            <h1 className="text-2xl font-serif font-semibold tracking-tight">
              Claude
            </h1>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="scrollbar-none pt-2">
        <SidebarGroup className={state === "expanded" ? "px-4" : "px-2"}>
          <SidebarMenu className={cn(state === "expanded" ? "" : "items-center", "gap-1")}>
            <SidebarMenuItem>
              <SidebarMenuButton className="h-10 gap-3 rounded-xl hover:bg-sidebar-accent px-2 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center">
                <div className="w-6 flex items-center justify-center shrink-0">
                  <div className="size-6 rounded-full border border-border flex items-center justify-center bg-sidebar shadow-sm shrink-0">
                    <Plus className="size-3.5" />
                  </div>
                </div>
                <span className="font-medium group-data-[collapsible=icon]:hidden">New chat</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setSearchOpen(true)}
                className="h-10 gap-3 rounded-xl hover:bg-sidebar-accent px-2 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center"
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
              <SidebarMenuButton className="h-10 gap-3 rounded-xl hover:bg-sidebar-accent px-2 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center">
                <div className="w-6 flex items-center justify-center shrink-0">
                  <MessageSquare className="size-5" />
                </div>
                <span className="font-medium text-muted-foreground/80 group-data-[collapsible=icon]:hidden">
                  Chats
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton className="h-10 gap-3 rounded-xl hover:bg-sidebar-accent px-2 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center">
                <div className="w-6 flex items-center justify-center shrink-0">
                  <Layers className="size-5" />
                </div>
                <span className="font-medium text-muted-foreground/80 group-data-[collapsible=icon]:hidden">
                  Projects
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton className="h-10 gap-3 rounded-xl hover:bg-sidebar-accent px-2 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center">
                <div className="w-6 flex items-center justify-center shrink-0">
                  <Box className="size-5" />
                </div>
                <span className="font-medium text-muted-foreground/80 group-data-[collapsible=icon]:hidden">
                  Artifacts
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton className="h-10 gap-3 rounded-xl hover:bg-sidebar-accent justify-between px-2 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center">
                <div className="flex items-center gap-3 group-data-[collapsible=icon]:gap-0">
                  <div className="w-6 flex items-center justify-center shrink-0">
                    <Code2 className="size-5" />
                  </div>
                  <span className="font-medium text-muted-foreground/80 group-data-[collapsible=icon]:hidden">
                    Code
                  </span>
                </div>
                {state === "expanded" && (
                  <Badge
                    variant="outline"
                    className="h-5 px-1.5 text-[10px] font-medium text-primary border-primary/20 bg-primary/5"
                  >
                    Upgrade
                  </Badge>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton className="h-10 gap-3 rounded-xl hover:bg-sidebar-accent px-2 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center">
                <div className="w-6 flex items-center justify-center shrink-0">
                  <Briefcase className="size-5" />
                </div>
                <span className="font-medium text-muted-foreground/80 group-data-[collapsible=icon]:hidden">
                  Customize
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className={cn("mt-4 px-4", state === "collapsed" && "hidden")}>
          <SidebarGroupLabel className="px-0 text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider">
            Recents
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {[
                "Untitled",
                "Electromagnetics question pape...",
                "Claude-code UI clone idea",
                "Creating monitoring solutions",
                "Frontend development for back...",
                "Optimizing document analysis w...",
                "Organizing AI questions by theo...",
                "Machine vision fundamentals an...",
                "Exam question organization and ...",
                "Upskilling in system design and ...",
              ].map((chat, i) => (
                <SidebarMenuItem key={i}>
                  <SidebarMenuButton className="h-9 px-2 rounded-lg hover:bg-sidebar-accent text-sm font-medium text-muted-foreground/90 transition-colors">
                    <span className="truncate">{chat}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <div className="mt-auto">
        <Separator className={cn("bg-border/50", state === "collapsed" && "hidden")} />
        <SidebarFooter className={cn("flex flex-col", state === "expanded" ? "p-4" : "p-2 gap-4")}>
          {state === "collapsed" && (
            <div className="flex justify-center mb-2">
              <Button variant="ghost" size="icon" className="size-8 rounded-lg text-muted-foreground hover:text-foreground">
                <Download className="size-5" />
              </Button>
            </div>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className={cn("cursor-pointer hover:bg-sidebar-accent/50 rounded-xl transition-colors", state === "expanded" ? "flex items-center justify-between w-full p-2 -m-2" : "flex justify-center p-0")}>
                <div className="flex items-center gap-3">
                  <Avatar className={cn("border border-border", state === "expanded" ? "size-10" : "size-8")}>
                    <AvatarFallback className="bg-foreground text-background font-bold text-base">
                      A
                    </AvatarFallback>
                  </Avatar>
                  {state === "expanded" && (
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">Anurag</span>
                      <span className="text-xs text-muted-foreground">
                        Free plan
                      </span>
                    </div>
                  )}
                </div>
                {state === "expanded" && (
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 rounded-lg text-muted-foreground"
                    >
                      <ChevronsUpDown className="size-4" />
                    </Button>
                  </div>
                )}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              side="top"
              className="w-[280px] rounded-2xl p-2 shadow-2xl"
            >
              <div className="px-3 py-2 text-xs font-medium text-muted-foreground truncate">
                079bct010@ioepc.edu.np
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
              <DropdownMenuItem className="gap-3 py-2.5 rounded-xl text-destructive focus:text-destructive">
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
