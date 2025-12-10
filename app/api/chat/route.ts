import { streamingAgent } from "@/lib/agent";
import { HumanMessage, AIMessage } from "@langchain/core/messages";

// Use Node.js runtime for LangChain compatibility
export const runtime = "nodejs";
export const maxDuration = 60; // Allow up to 60 seconds for agent responses

export async function POST(request: Request) {
  // Check for API key
  if (!process.env.OPENAI_API_KEY) {
    return new Response(
      JSON.stringify({ error: "OPENAI_API_KEY environment variable is not set" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const { messages, uiState } = await request.json();

  // Validate messages
  if (!messages || !Array.isArray(messages)) {
    return new Response(
      JSON.stringify({ error: "Invalid messages format" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // Create a readable stream
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Convert messages to LangChain format
        const langchainMessages = messages.map(
          (m: { role: string; content: string }) => {
            if (m.role === "user") {
              return new HumanMessage(m.content || "");
            }
            if (m.role === "assistant") {
              return new AIMessage(m.content || "");
            }
            return new HumanMessage(String(m.content || ""));
          }
        );

        // Stream the agent response with multiple modes
        const eventStream = await streamingAgent.stream(
          {
            messages: langchainMessages,
            uiState: uiState || undefined,
          },
          {
            streamMode: ["updates", "messages"],
          }
        );

        for await (const event of eventStream) {
          // Send each update as a JSON line
          const data = JSON.stringify(event) + "\n";
          controller.enqueue(encoder.encode(`data: ${data}\n`));
        }

        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch (error) {
        console.error("Stream error:", error);
        // Send error as SSE event before closing
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: errorMessage })}\n\n`)
        );
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
