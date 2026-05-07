# Claude.ai UI Template & Starter Kit
 
![Claude UI Mockup](/public/assets/hero-mockup.png)
 
A premium, high-fidelity UI template and starter kit inspired by the Claude.ai interface. Built with modern web technologies, this project provides a production-ready foundation for developers looking to build sophisticated AI chat applications with a focus on minimalist design and enterprise-grade aesthetics.
 
> [!TIP]
> **Why use this starter?** Skip the weeks of UI/UX development and start directly with a refined, responsive, and feature-rich interface that feels premium out of the box.
 
## ✨ Key Features
 
-   **Authentic Claude Experience**: Mirroring the minimalist, stone-toned aesthetic of Claude.ai.
-   **Intelligent Chat Interface**: Modular chat components including message bubbles, input bars, and message lists.
-   **Responsive Sidebar**: A fully collapsible and interactive sidebar with tooltips and quick navigation.
-   **Rich Markdown Support**: Seamless rendering of Markdown content with syntax highlighting for code blocks.
-   **Authentication Ready**: Integrated with NextAuth.js (v5 beta) for secure Google OAuth sessions.
-   **Command Palette**: Quick navigation and actions using `Ctrl + K`.
-   **Modern Design System**: Built using Tailwind CSS 4 and shadcn/ui for maximum flexibility and performance.
-   **Micro-Animations**: Staggered animations and smooth transitions for a premium feel.
 
## 🛠️ Tech Stack
 
-   **Framework**: [Next.js 15+](https://nextjs.org) (App Router)
-   **Styling**: [Tailwind CSS 4](https://tailwindcss.com)
-   **Components**: [shadcn/ui](https://ui.shadcn.com)
-   **Icons**: [Lucide React](https://lucide.dev)
-   **Authentication**: [NextAuth.js v5](https://authjs.dev)
-   **Animations**: [Framer Motion](https://www.framer.com/motion/) & Tailwind Animate
-   **Markdown**: `react-markdown`, `rehype-highlight`, `remark-gfm`
 
## 🚀 Getting Started
 
### Prerequisites
 
-   Node.js 18+ 
-   pnpm / npm / yarn
 
### Installation
 
1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/claude-code.git
    cd claude-code
    ```
 
2. Install dependencies:
    ```bash
    pnpm install
    ```
 
3. Set up environment variables:
    Create a `.env.local` file in the root directory:
    ```env
    AUTH_SECRET="your-secret"
    AUTH_GOOGLE_ID="your-google-id"
    AUTH_GOOGLE_SECRET="your-google-secret"
    ```
 
4. Run the development server:
    ```bash
    pnpm dev
    ```
 
Open [http://localhost:3000](http://localhost:3000) to see the application.
 
## 🎨 Customization & Extension
 
This starter kit is designed to be highly extensible:
 
-   **Theme Colors**: Modify the primary and stone-toned palettes in `src/app/globals.css`.
-   **AI Integration**: Hook up your LLM (OpenAI, Anthropic, Gemini) in the `src/hooks/use-chat.ts` or via a dedicated API route in `src/app/api/chat/`.
-   **Auth Providers**: Easily add more providers (GitHub, Discord, Credentials) in `src/lib/auth.ts`.
-   **Components**: Leverage the pre-built `shadcn/ui` components located in `src/components/ui/` to build new pages quickly.
 
## 🏗️ Project Structure
 
```text
src/
├── app/             # App router pages and API routes
├── components/      # Reusable UI and Chat-specific components
├── context/         # React Context providers (Auth, Chat)
├── hooks/           # Custom hooks for logic extraction
├── lib/             # Utility functions and shared libraries
└── types/           # TypeScript definitions
```
 
## 📜 License
 
This project is for educational purposes only. All branding and design rights belong to Anthropic.
 
---
 
Created with ❤️ by [Anurag](https://github.com/AnuragDahal)
