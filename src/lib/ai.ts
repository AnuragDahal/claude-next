import { createGoogleGenerativeAI } from "@ai-sdk/google";

export const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const defaultModel = google(
  process.env.GEMINI_MODEL ?? "gemini-2.5-flash"
);
