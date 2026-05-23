---
name: claude-architect
description: Guidance for maintaining the Claude Code UI architecture, styling system, chat flow, and auth integration.
---

# Claude Architect Skill

Use this skill when editing or extending the app. The goal is to preserve the current visual system, chat behavior, and authentication flow while keeping changes small and consistent.

## Project purpose

This is a Next.js chat UI inspired by Claude.ai. It is not a generic dashboard; most changes should stay within the existing chat, auth, and styling patterns.

## Architecture

### App shell and routes
- `src/app`: App Router pages, layouts, global CSS, and API routes.
- `src/app/api/chat/route.ts`: Server route that streams Gemini responses.
- `src/app/(auth)/login/page.tsx`: Login page for authenticated access.

### UI and shared components
- `src/components/chat`: Chat-specific components such as the main interface, input bar, message list, and message renderer.
- `src/components/ui`: Reusable shadcn/ui primitives. Prefer these before creating new UI pieces.

### State and logic
- `src/hooks/use-chat.ts`: Main chat flow. Handles input, attachments, sending, and streaming updates.
- `src/store/chat-store.ts`: Chat session store. Update state here when changing chat/session behavior.
- `src/lib/types.ts`: Message and chat session types. Keep these in sync with any API or UI changes.
- `src/context/auth-context.tsx` and `src/lib/auth.ts`: Authentication flow and NextAuth configuration.

## Chat flow

1. User enters text or attachments in the composer.
2. `useChat` creates a user message and adds it to the current session.
3. `useChat` posts the message to `/api/chat`.
4. The API route streams Gemini output chunk-by-chunk.
5. `useChat` updates the assistant message incrementally.

If you change the provider or response format, keep the client logic compatible with the current streaming behavior and `Message` type.

## Styling rules

- Use the existing CSS variables in `src/app/globals.css`.
- Do not add hardcoded color values for primary UI accents.
- Keep markdown styling consistent in `src/components/chat/message-content.tsx`.
- Prefer Tailwind utility classes and semantic variables over custom color literals.

## Component rules

- Use `src/components/chat` for chat-specific behavior.
- Use `src/components/ui` for reusable UI primitives.
- Keep `MessageList` and scrolling behavior consistent with the current `useScroll` hook.
- Keep the input bar behavior in `InputBar` unless a new interaction needs to be added.

## Auth rules

- Authentication is handled by NextAuth.
- Do not bypass the existing auth context unless the change is explicitly about login or session behavior.
- Preserve the current Google OAuth setup unless you are intentionally changing the provider.

## Environment and local setup

Required environment variables:
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `NEXTAUTH_SECRET`
- `GEMINI_API_KEY`
- `GEMINI_MODEL`

Run locally with:
- `pnpm install`
- `pnpm dev`

## Maintenance checklist

Before making changes:
1. Check `src/app/globals.css` if the change affects styling.
2. Check `src/hooks/use-chat.ts` if the change affects message sending or streaming.
3. Check `src/lib/types.ts` if the change affects message/session shape.
4. Check `src/app/api/chat/route.ts` if the change affects the model integration.

When adding new features:
- Reuse existing components where possible.
- Keep the architecture small and avoid introducing extra state unless it is necessary.
- Prefer incremental changes that preserve the current chat flow.
