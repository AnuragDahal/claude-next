import { ChatSidebar } from "@/components/chat-sidebar";
import { ChatInterface } from "@/components/chat/chat-interface";
import { SidebarInset } from "@/components/ui/sidebar";

export default function Home() {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <ChatSidebar />
      <SidebarInset className="flex flex-col flex-1">
        <ChatInterface />
      </SidebarInset>
    </div>
  );
}
