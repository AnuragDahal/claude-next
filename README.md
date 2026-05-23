# Claude Code UI

A premium, minimalist AI chat interface built with Next.js, Tailwind CSS, and shadcn/ui.

## What it does

- Provides a Claude-inspired chat UI with streaming responses.
- Supports authenticated access with NextAuth and Google OAuth.
- Handles file attachments in the chat composer.
- Renders markdown and code blocks in the message view.

## Tech stack

- Next.js 16 App Router
- React 19
- Tailwind CSS 4
- shadcn/ui
- NextAuth 5
- Google Gemini via `@google/generative-ai`

## Project structure

- `src/app`: App Router pages, API routes, and global styles
- `src/components/chat`: Chat UI components
- `src/components/ui`: Reusable UI primitives
- `src/hooks`: Chat and scrolling behavior
- `src/store`: Chat session state
- `src/lib`: Shared types, auth helpers, and axios client
- `src/context`: Auth context and providers

## Core flow

1. The user sends a message through `useChat`.
2. `useChat` posts the message to `/api/chat`.
3. `src/app/api/chat/route.ts` streams Gemini output back to the client.
4. `useChat` updates the assistant message as chunks arrive.

## Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Create `.env.local` with:
   ```env
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   NEXTAUTH_SECRET=...
   GEMINI_API_KEY=...
   GEMINI_MODEL=...
   ```

3. Start the app:
   ```bash
   pnpm dev
   ```

4. Open http://localhost:3000

## Important implementation notes

- Keep styling aligned with `src/app/globals.css` and use the existing CSS variables.
- Reuse the existing chat components instead of creating new UI primitives unless necessary.
- The current chat API uses streaming and expects the response payload to be plain text chunks.
- Attachment handling is client-side only; no storage backend is implemented yet.
