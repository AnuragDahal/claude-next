# Claude Code UI - AI Chat Interface Starter

A premium, minimalist AI chat interface template and starter project inspired by Claude.ai, built with Next.js, Tailwind CSS 4, and Shadcn UI.

## Features

- **Minimalist Design**: Clean, typography-focused interface with a "parchment" aesthetic.
- **Smart Conversations**: Supports streaming responses, markdown rendering, and code syntax highlighting.
- **File Attachments**: Capability to upload and preview images and documents.
- **Authentication**: Integrated Google OAuth via Next-Auth (v5).
- **Dark Mode**: Fully supported with semantic color variables.
- **Responsive Layout**: Works seamlessly on mobile and desktop with a collapsible sidebar.

## Project Structure

- `src/app`: Next.js App Router pages and global styles.
- `src/components/chat`: Core chat components (`ChatInterface`, `MessageList`, `InputBar`).
- `src/components/ui`: Reusable UI components from Shadcn UI.
- `src/hooks`: Custom React hooks for chat logic and scroll management.
- `src/context`: Authentication and global providers.
- `src/lib`: Utility functions, types, and API clients.

## Design System

The project uses a variable-based design system in `src/app/globals.css`. 

- **Primary Colors**: Use `--primary` (Claude Orange) for accents.
- **Semantic Tokens**: Custom tokens for code blocks (`--code-bg`), scrollbars (`--scrollbar-thumb`), and sidebars.
- **Tailwind 4**: Leverages the latest Tailwind features for styling.

## Integration Guide

### 1. Backend API
The chat interface expects an API route at `/api/chat`. You can replace the current mock/Google integration in `src/app/api/chat/route.ts` with your preferred LLM provider.

### 2. State Management
The chat state is managed by `useChat` hook which interfaces with the backend. For complex state, consider extending the `zustand` store in `src/store`.

### 3. Styling
To change the theme, update the CSS variables in `:root` and `.dark` blocks in `src/app/globals.css`. All components are mapped to these variables.

## Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Set up environment variables in `.env.local`:
   ```env
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   NEXTAUTH_SECRET=...
   NEXT_PUBLIC_GEMINI_API_KEY=...
   ```

3. Run the development server:
   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.
