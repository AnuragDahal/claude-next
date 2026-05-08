import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL as string });

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const history = messages.slice(0, -1).map((m: any) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content || " " }],
    }));

    const lastMessage = messages[messages.length - 1];
    const userContent = lastMessage.content || " ";

    const chat = model.startChat({
      history,
    });

    const result = await chat.sendMessageStream(userContent);

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            if (chunkText) {
              controller.enqueue(encoder.encode(chunkText));
            }
          }
        } catch (error) {
          console.error("Stream processing error:", error);
          controller.error(error);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
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
