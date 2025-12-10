import { AIMessage } from "@langchain/core/messages";

/**
 * Type guard to check if a message is an AI message.
 */
export function isAIMessage(message: unknown): boolean {
  if (!message || typeof message !== "object") return false;
  const msg = message as Record<string, unknown>;
  if (msg.type === "ai") return true;
  return AIMessage.isInstance(message);
}

/**
 * Type guard to check if a message is a tool message.
 */
export function isToolMessage(message: unknown): boolean {
  if (!message || typeof message !== "object") return false;
  const msg = message as Record<string, unknown>;
  return msg.type === "tool";
}

/**
 * Type guard to check if a message is a human message.
 */
export function isHumanMessage(message: unknown): boolean {
  if (!message || typeof message !== "object") return false;
  const msg = message as Record<string, unknown>;
  return msg.type === "human";
}

/**
 * Extracts text content from message content that can be in various formats.
 */
export function extractTextContent(content: unknown): string {
  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object" && "text" in item) {
          return String(item.text);
        }
        return "";
      })
      .join("");
  }

  if (content && typeof content === "object" && "text" in content) {
    return String(content.text);
  }

  return String(content || "");
}

