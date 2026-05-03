"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { Plus, MessageSquare, User, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ChatSidebar() {
  return (
    <Sidebar className="border-r border-border bg-sidebar">
      <SidebarHeader className="p-4">
        <Button className="w-full justify-start gap-2 bg-primary text-primary-foreground hover:bg-primary/90" size="lg">
          <Plus className="size-4" />
          <span>New Chat</span>
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Recent</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {[
                "Building a Claude clone",
                "Next.js v15 updates",
                "Tailwind CSS v4 features",
                "Shadcn Nova style",
              ].map((chat, i) => (
                <SidebarMenuItem key={i}>
                  <SidebarMenuButton className="hover:bg-sidebar-accent">
                    <MessageSquare className="size-4" />
                    <span className="truncate">{chat}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <User className="size-4" />
              <span>Anurag Dahal</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Settings className="size-4" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
