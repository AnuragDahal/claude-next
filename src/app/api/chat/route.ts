import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";

const googleProvider = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

const model = googleProvider(process.env.GEMINI_MODEL || "gemini-2.5-flash");

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Map messages format from client to core messages
    const coreMessages = messages.map((m: any) => ({
      role: m.role === "user" ? "user" : "assistant",
      content: m.content || " ",
    }));

    const result = streamText({
      model,
      messages: coreMessages,
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error("API Route Error:", error);
    return new Response(JSON.stringify({ 
      error: error.message || "Internal Server Error",
      details: error.stack
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

