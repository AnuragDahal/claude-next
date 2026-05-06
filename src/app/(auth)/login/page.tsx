"use client";

import { signIn } from "next-auth/react";
import { Sparkles, ShieldCheck, Zap } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full bg-[#f5f0e8] font-sans">
      {/* Left Side: Login Card (Minimal Space) */}
      <div className="flex w-full flex-col items-center justify-center border-r border-[#e5e1da] bg-[#f5f0e8] p-6 sm:p-12 lg:w-[350px]">
        <div className="w-full max-w-[320px] flex flex-col items-center text-center">
          {/* Logo */}
          <div className="mb-12 flex items-center gap-2">
            <div className="rounded-lg bg-white p-2 shadow-sm">
              <Sparkles className="h-6 w-6 text-[#d97706]" />
            </div>
            <span className="font-serif text-2xl font-semibold tracking-tight text-[#1a1a1a]">
              Claude
            </span>
          </div>

          <h1 className="mb-2 font-serif text-3xl font-semibold tracking-tight text-[#1a1a1a] sm:text-4xl">
            Welcome
          </h1>
          <p className="mb-10 text-[15px] text-[#6b6b6b]">
            Sign in to continue to Claude
          </p>

          <button
            onClick={() => signIn("google")}
            className="group flex w-full items-center justify-center gap-3 rounded-xl border border-[#e5e1da] bg-white py-3.5 text-[15px] font-medium text-[#1a1a1a] transition-all hover:bg-[#fafaf9] hover:shadow-lg active:scale-[0.98]"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>

          <p className="mt-12 text-[11px] leading-relaxed text-[#8a8a8a]">
            By continuing, you agree to our{" "}
            <button className="underline decoration-[#d1d5db] transition-colors hover:text-[#1a1a1a]">
              Terms
            </button>{" "}
            and{" "}
            <button className="underline decoration-[#d1d5db] transition-colors hover:text-[#1a1a1a]">
              Privacy Policy
            </button>
            .
          </p>
        </div>
      </div>

      {/* Right Side: Branding (Desktop Only) */}
      <div className="relative hidden flex-1 flex-col items-center justify-center bg-[#fcfaf7] p-12 lg:flex">
        <div className="max-w-2xl space-y-8">
          <h2 className="font-serif text-6xl font-medium leading-[1.05] tracking-tight text-[#1a1a1a]">
            The AI partner <br />
            for <span className="italic text-[#d97706]">thoughtful</span> work.
          </h2>
          <p className="text-xl leading-relaxed text-[#6b6b6b]">
            Experience a new standard of AI that's helpful, harmless, and honest.
          </p>

          <div className="flex gap-12 pt-4">
            {[
              {
                icon: ShieldCheck,
                title: "Safe & Secure",
                desc: "Built with industry-leading safety standards.",
              },
              {
                icon: Zap,
                title: "Highly Capable",
                desc: "Optimized for complex reasoning and coding.",
              },
            ].map((item, i) => (
              <div key={i} className="flex max-w-[240px] flex-col gap-3">
                <div className="w-fit rounded-full bg-[#f5f0e8] p-2">
                  <item.icon className="h-5 w-5 text-[#d97706]" />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-[#1a1a1a]">
                    {item.title}
                  </h4>
                  <p className="text-sm text-[#8a8a8a]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-8 left-12 right-12 flex justify-between text-xs text-[#8a8a8a]">
          <span>© 2026 Anthropic PBC. All rights reserved.</span>
          <div className="flex gap-4">
            <button className="hover:text-[#1a1a1a]">Status</button>
            <button className="hover:text-[#1a1a1a]">Support</button>
          </div>
        </div>
      </div>
    </div>
  );
}
