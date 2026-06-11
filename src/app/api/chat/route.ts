import { streamText, convertToModelMessages } from "ai";
import { defaultModel } from "@/lib/ai";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Convert UI messages (from @ai-sdk/react) to model messages (core AI SDK format)
    const modelMessages = await convertToModelMessages(messages);

    const result = streamText({
      model: defaultModel,
      messages: modelMessages,
      system:
        "You are a helpful, friendly, and knowledgeable AI assistant. " +
        "Be concise yet thorough. Format responses with markdown when appropriate.",
    });

    // toUIMessageStreamResponse() sends the Vercel AI UI Message Stream protocol
    // which the DefaultChatTransport on the client can parse into UIMessage parts
    // (enabling streaming text, tool calls, data parts, etc.)
    return result.toUIMessageStreamResponse();
  } catch (error: any) {
    console.error("API Route Error:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Internal Server Error",
        details: error.stack,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
