import { createStreamingAgent } from "@/lib/agent";
import type { BaseMessage } from "@langchain/core/messages";

// Use Node.js runtime for LangChain compatibility
export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  // Check for API key
  if (!process.env.OPENAI_API_KEY) {
    return new Response(
      JSON.stringify({ error: "OPENAI_API_KEY environment variable is not set" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const body = await request.json();

    // Create agent per request
    const agent = createStreamingAgent();

    // Stream using built-in SSE encoding
    const stream = await agent.stream(
      body.input as { messages: BaseMessage[] },
      {
        encoding: "text/event-stream",
        streamMode: ["values", "updates", "messages"],
        configurable: body.config?.configurable,
        recursionLimit: 10,
      }
    );

    return new Response(stream, {
      headers: { "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Stream error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Internal server error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
