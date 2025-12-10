import { streamingAgent } from "@/lib/agent";
import { HumanMessage, AIMessage } from "@langchain/core/messages";

export async function POST(request: Request) {
  const { messages, uiState } = await request.json();

  // Create a readable stream
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Convert messages to LangChain format
        const langchainMessages = messages.map(
          (m: { role: string; content: string }) => {
            if (m.role === "user") {
              return new HumanMessage(m.content);
            }
            if (m.role === "assistant") {
              return new AIMessage(m.content);
            }
            return m;
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
        controller.error(error);
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
