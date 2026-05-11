import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Claude Code UI",
  description: "Claude Code UI",
};

import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider } from "@/context/auth-context";
import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <TooltipProvider>
              <SidebarProvider>{children}</SidebarProvider>
            </TooltipProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
