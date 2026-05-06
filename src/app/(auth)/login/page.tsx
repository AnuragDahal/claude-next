"use client";

import { signIn } from "next-auth/react";
import { Sparkles } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f5f0e8] p-4 font-sans">
      <div className="w-full max-w-[400px] flex flex-col items-center text-center">
        {/* Sparkles Icon */}
        <div className="mb-8 rounded-2xl bg-white/40 p-4 shadow-sm">
          <Sparkles className="h-10 w-10 text-[#d97706]" strokeWidth={1.5} />
        </div>

        {/* Heading */}
        <h1 className="mb-2 font-serif text-3xl font-semibold tracking-tight text-[#1a1a1a]">
          Welcome 
        </h1>
        <p className="mb-10 text-[15px] text-[#6b6b6b]">
          Sign in to continue
        </p>

        {/* Google Button */}
        <button
          onClick={() => signIn("google")}
          className="group flex w-[320px] items-center justify-center gap-3 rounded-xl border border-[#e5e1da] bg-white py-3.5 text-[15px] font-medium text-[#1a1a1a] transition-all hover:bg-[#fafaf9] hover:shadow-md active:scale-[0.98]"
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

        {/* Footer */}
        <p className="mt-12 text-[11px] leading-relaxed text-[#8a8a8a] max-w-[280px]">
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
  );
}
