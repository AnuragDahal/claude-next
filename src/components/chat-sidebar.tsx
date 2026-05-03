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
  Plus,
  Search,
  Settings,
} from "lucide-react";
import React from "react";
import { SearchCommand } from "./search-command";
import { Separator } from "@/components/ui/separator";

export function ChatSidebar() {
  const [searchOpen, setSearchOpen] = React.useState(false);

  return (
    <Sidebar className="border-r border-border bg-sidebar">
      <SearchCommand open={searchOpen} onOpenChange={setSearchOpen} />

      <SidebarHeader className="px-4 py-6 flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-serif font-semibold tracking-tight">
            Claude
          </h1>
        </div>

        <SidebarMenu className="gap-2">
          <SidebarMenuItem>
            <SidebarMenuButton className="h-11 gap-3 rounded-xl hover:bg-sidebar-accent transition-all duration-200">
              <div className="size-6 rounded-full border border-border flex items-center justify-center bg-sidebar">
                <Plus className="size-4" />
              </div>
              <span className="font-medium">New chat</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setSearchOpen(true)}
              className="h-11 gap-3 rounded-xl hover:bg-sidebar-accent transition-all duration-200"
            >
              <Search className="size-5" />
              <span className="font-medium text-muted-foreground/80">
                Search
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="scrollbar-none">
        <SidebarGroup className="px-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className="h-10 gap-3 rounded-xl hover:bg-sidebar-accent">
                <MessageSquare className="size-5" />
                <span className="font-medium text-muted-foreground/80">
                  Chats
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton className="h-10 gap-3 rounded-xl hover:bg-sidebar-accent">
                <Layers className="size-5" />
                <span className="font-medium text-muted-foreground/80">
                  Projects
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton className="h-10 gap-3 rounded-xl hover:bg-sidebar-accent">
                <Box className="size-5" />
                <span className="font-medium text-muted-foreground/80">
                  Artifacts
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton className="h-10 gap-3 rounded-xl hover:bg-sidebar-accent justify-between">
                <div className="flex items-center gap-3">
                  <Code2 className="size-5" />
                  <span className="font-medium text-muted-foreground/80">
                    Code
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className="h-5 px-1.5 text-[10px] font-medium text-primary border-primary/20 bg-primary/5"
                >
                  Upgrade
                </Badge>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton className="h-10 gap-3 rounded-xl hover:bg-sidebar-accent">
                <Briefcase className="size-5" />
                <span className="font-medium text-muted-foreground/80">
                  Customize
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="mt-4 px-4">
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
        <Separator className="bg-border/50" />
        <SidebarFooter className="p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center justify-between w-full cursor-pointer hover:bg-sidebar-accent/50 p-2 -m-2 rounded-xl transition-colors">
                <div className="flex items-center gap-3">
                  <Avatar className="size-10 border border-border">
                    <AvatarFallback className="bg-foreground text-background font-bold text-base">
                      A
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">Anurag</span>
                    <span className="text-xs text-muted-foreground">
                      Free plan
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 rounded-lg text-muted-foreground"
                  >
                    <ChevronsUpDown className="size-4" />
                  </Button>
                </div>
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
