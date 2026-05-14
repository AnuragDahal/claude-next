---
name: claude-architect
description: Intelligence for maintaining and extending the Claude Code UI architecture, design system, and chat logic.
---

# Claude Architect Skill

This skill provides guidelines and patterns for maintaining the high-fidelity Claude.ai clone. Use this to ensure UI consistency, proper variable usage, and clean architectural splits.

## Design Philosophy

1. **Parchment Aesthetic**: The UI should feel like paper/parchment. Use `#fbfaf8` (or `--background`) for light mode.
2. **Typography First**: Focus on readability. Use Serif fonts for headings and clean Sans for messages.
3. **Subtle Interactions**: Use `animate-in`, `fade-in`, and smooth transitions for all state changes.
4. **Variable-Driven**: NEVER use hardcoded hex codes for primary/secondary colors. Always use Tailwind utility classes (`text-primary`, `bg-secondary`) or CSS variables (`var(--code-bg)`).

## CSS Variable Map

Maintain the following variables in `src/app/globals.css`:

| Variable | Usage |
|----------|-------|
| `--primary` | Claude Orange accents |
| `--secondary` | Message bubble backgrounds |
| `--code-bg` | Code block background |
| `--code-border`| Code block borders |
| `--scrollbar-thumb` | Custom scrollbar colors |

## Component Guidelines

### Chat Components
- **`ChatInterface`**: The layout orchestrator. Manages the high-level state (Home vs Chat).
- **`MessageList`**: Handles scroll logic. Must use `useScroll` hook for auto-scrolling.
- **`InputBar`**: The complex input area. Handles auto-resize, attachments, and send logic.
- **`MessageContent`**: Pure markdown renderer. Uses `react-markdown` and `rehype-highlight`.

### Logic & Hooks
- **`useChat`**: Central hook for message state, streaming, and attachment management.
- **`useScroll`**: Specialized hook for "smart" auto-scrolling that respects user manual scrolling.

## Further Integration

To replace the mock logic with a real LLM:
1. Update `src/hooks/use-chat.ts` to point to the correct endpoint.
2. Ensure the response format matches the `Message` type in `src/lib/types.ts`.
3. If using streaming, handle the partial updates in the `useChat` hook's `handleSend` function.

## Maintenance Rules
- Always check `globals.css` before adding new colors.
- Ensure `dark mode` is tested for every new component.
- Keep the `prose` (Markdown) styles consistent in `message-content.tsx`.
