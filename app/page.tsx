"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { HeroSection } from "@/components/HeroSection";
import { ContentRow } from "@/components/ContentRow";
import { ContinueWatching } from "@/components/ContinueWatching";
import { SearchResults } from "@/components/SearchResults";
import { UserProfile } from "@/components/UserProfile";
import { Notifications } from "@/components/Notifications";
import { ChatInterface } from "@/components/ChatInterface";
import type { StreamingUIState } from "@/lib/types";
import { defaultUIState } from "@/lib/types";
import { Film } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function StreamingDashboard() {
  const [uiState, setUIState] = useState<StreamingUIState>(defaultUIState);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [profileExpanded, setProfileExpanded] = useState(false);

  // Track streaming message state
  const streamingMessageRef = useRef<string>("");
  const isStreamingRef = useRef<boolean>(false);

  // Process streaming updates from the agent
  const processStreamEvent = useCallback((event: unknown) => {
    // Handle multi-mode stream format: [mode, data]
    if (!Array.isArray(event) || event.length !== 2) return;
    
    const [mode, data] = event;
    
    // Handle streaming message tokens
    if (mode === "messages" && Array.isArray(data) && data.length >= 2) {
      const [message, metadata] = data as [
        { kwargs?: { content?: string; tool_calls?: unknown[]; additional_kwargs?: { tool_calls?: unknown[] } }; id?: string[] },
        { langgraph_node?: string }
      ];
      
      // Only process messages from model_request node (the streaming response)
      if (metadata?.langgraph_node !== "model_request") return;
      
      // Check if this is an AIMessageChunk
      const msgType = message.id?.[2];
      if (msgType !== "AIMessageChunk") return;
      
      // Skip if has tool calls
      const hasToolCalls = 
        (message.kwargs?.tool_calls && message.kwargs.tool_calls.length > 0) ||
        (message.kwargs?.additional_kwargs?.tool_calls && message.kwargs.additional_kwargs.tool_calls.length > 0);
      if (hasToolCalls) return;
      
      // Get the content chunk
      const contentChunk = message.kwargs?.content;
      if (typeof contentChunk !== "string") return;
      
      // Accumulate streaming content
      streamingMessageRef.current += contentChunk;
      
      // Skip if content looks like JSON (tool result)
      const currentContent = streamingMessageRef.current.trim();
      if (currentContent.startsWith("{") || currentContent.startsWith("[")) return;
      
      // Start streaming or update existing streaming message
      if (!isStreamingRef.current && currentContent) {
        isStreamingRef.current = true;
        setMessages((prev) => [...prev, { role: "assistant", content: currentContent }]);
      } else if (currentContent) {
        // Update the last message with accumulated content
        setMessages((prev) => {
          const newMessages = [...prev];
          if (newMessages.length > 0 && newMessages[newMessages.length - 1]?.role === "assistant") {
            newMessages[newMessages.length - 1] = { role: "assistant", content: currentContent };
          }
          return newMessages;
        });
      }
      return;
    }
    
    if (mode === "updates" && data && typeof data === "object") {
      // Updates mode: node state updates
      const updates = data as Record<string, unknown>;
      
      for (const [nodeName, nodeData] of Object.entries(updates)) {
        if (!nodeData || typeof nodeData !== "object") continue;

        const nodeState = nodeData as { 
          uiState?: Partial<StreamingUIState>; 
          messages?: Array<{
            id?: string[];
            type?: string;
            kwargs?: {
              content?: string;
              tool_calls?: unknown[];
              additional_kwargs?: { tool_calls?: unknown[] };
            };
          }>;
        };

        // Handle UI state updates from middleware
        if (nodeState.uiState) {
          setUIState((prev) => ({ ...prev, ...nodeState.uiState }));
        }

        // Handle final AI messages - look for AIMessageChunk with content
        // This finalizes the streaming message with the complete content
        if (nodeState.messages && Array.isArray(nodeState.messages)) {
          for (const msg of nodeState.messages) {
            if (!msg) continue;
            
            // Check if this is an AIMessageChunk (the response)
            const msgType = msg.id?.[2];
            if (msgType !== "AIMessageChunk") continue;
            
            // Get content from kwargs
            const content = msg.kwargs?.content;
            if (!content || typeof content !== "string") continue;
            
            // Skip if has tool calls (it's a tool-calling message, not a response)
            const hasToolCalls = 
              (msg.kwargs?.tool_calls && msg.kwargs.tool_calls.length > 0) ||
              (msg.kwargs?.additional_kwargs?.tool_calls && msg.kwargs.additional_kwargs.tool_calls.length > 0);
            if (hasToolCalls) continue;
            
            // Skip empty or JSON content
            const trimmedContent = content.trim();
            if (!trimmedContent) continue;
            if (trimmedContent.startsWith("{") || trimmedContent.startsWith("[")) continue;
            
            // Finalize the message (replace streaming message with complete one)
            setMessages((prev) => {
              const newMessages = [...prev];
              // If we were streaming, update the last message
              if (isStreamingRef.current && newMessages.length > 0 && newMessages[newMessages.length - 1]?.role === "assistant") {
                newMessages[newMessages.length - 1] = { role: "assistant", content };
              } else if (!newMessages.some(m => m.role === "assistant" && m.content === content)) {
                // Add if not already present
                newMessages.push({ role: "assistant", content });
              }
              return newMessages;
            });
          }
        }
      }
    }
  }, []);

  // Send message to agent
  const handleSendMessage = useCallback(
    async (content: string) => {
      // Reset streaming state for new message
      streamingMessageRef.current = "";
      isStreamingRef.current = false;
      
      // Add user message
      const userMessage: Message = { role: "user", content };
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...messages, userMessage],
            uiState,
          }),
        });

        if (!response.ok) throw new Error("Failed to send message");

        const reader = response.body?.getReader();
        if (!reader) throw new Error("No reader available");

        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6).trim();
              if (data === "[DONE]") continue;

              try {
                const event = JSON.parse(data);
                processStreamEvent(event);
              } catch {
                // Ignore parse errors
              }
            }
          }
        }
      } catch (error) {
        console.error("Error sending message:", error);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Sorry, I encountered an error. Please try again.",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, uiState, processStreamEvent]
  );

  // Initialize dashboard on mount
  useEffect(() => {
    handleSendMessage("Initialize the dashboard with featured content and recommendations");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Dismiss notification
  const handleDismissNotification = useCallback((id: string) => {
    setUIState((prev) => ({
      ...prev,
      notifications: prev.notifications.filter((n) => n.id !== id),
    }));
  }, []);

  // Clear search
  const handleClearSearch = useCallback(() => {
    setUIState((prev) => ({
      ...prev,
      searchResults: [],
      searchQuery: undefined,
    }));
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-zinc-950 to-transparent">
        <div className="flex items-center justify-between px-8 md:px-16 py-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
              <Film className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tight">
              <span className="text-amber-400">Stream</span>
              <span className="text-white">Flow</span>
            </h1>
          </div>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-white font-medium hover:text-amber-400 transition-colors">
              Home
            </a>
            <a href="#" className="text-white/60 hover:text-white transition-colors">
              Movies
            </a>
            <a href="#" className="text-white/60 hover:text-white transition-colors">
              Series
            </a>
            <a href="#" className="text-white/60 hover:text-white transition-colors">
              My List
            </a>
          </nav>

          {/* User Profile */}
          <UserProfile
            profile={uiState.userProfile}
            isExpanded={profileExpanded}
            onToggle={() => setProfileExpanded(!profileExpanded)}
          />
        </div>
      </header>

      {/* Click outside to close profile */}
      {profileExpanded && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setProfileExpanded(false)}
        />
      )}

      {/* Notifications */}
      <Notifications
        notifications={uiState.notifications}
        onDismiss={handleDismissNotification}
      />

      {/* Main Content */}
      <main className="pb-40">
        {/* Hero Section */}
        <HeroSection
          content={uiState.featuredContent}
          isLoading={uiState.loadingStates.featured}
        />

        {/* Search Results (shown when active) */}
        <SearchResults
          results={uiState.searchResults}
          query={uiState.searchQuery}
          isLoading={uiState.loadingStates.search}
          onClear={handleClearSearch}
        />

        {/* Continue Watching */}
        <ContinueWatching
          items={uiState.continueWatching}
          isLoading={false}
        />

        {/* Recommendations */}
        <ContentRow
          title={uiState.activeGenre ? `${uiState.activeGenre.charAt(0).toUpperCase() + uiState.activeGenre.slice(1)} Picks` : "Recommended For You"}
          subtitle={uiState.recommendationReason}
          content={uiState.recommendations}
          isLoading={uiState.loadingStates.recommendations}
        />

        {/* Trending */}
        <ContentRow
          title={uiState.trendingCategory || "Trending Now"}
          subtitle="Popular with viewers this week"
          content={uiState.trending}
          isLoading={uiState.loadingStates.trending}
          cardSize="large"
        />

        {/* Genre Quick Access */}
        <section className="py-8 px-8 md:px-16">
          <h2 className="text-xl font-bold text-white mb-4">Browse by Genre</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {["action", "sci-fi", "drama", "comedy", "thriller", "horror", "romance", "documentary", "animation", "fantasy"].map(
              (genre) => (
                <button
                  key={genre}
                  onClick={() => handleSendMessage(`Show me ${genre} recommendations`)}
                  className={`relative h-24 rounded-xl overflow-hidden group ${
                    uiState.activeGenre === genre
                      ? "ring-2 ring-amber-400"
                      : ""
                  }`}
                >
                  <div
                    className="absolute inset-0 bg-gradient-to-br opacity-80 group-hover:opacity-100 transition-opacity"
                    style={{
                      background: getGenreGradient(genre),
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-bold capitalize text-lg drop-shadow-lg">
                      {genre}
                    </span>
                  </div>
                </button>
              )
            )}
          </div>
        </section>
      </main>

      {/* Chat Interface */}
      <ChatInterface
        messages={messages.filter((m) => m.content.trim())}
        onSend={handleSendMessage}
        isLoading={isLoading}
      />
    </div>
  );
}

// Genre color gradients
function getGenreGradient(genre: string): string {
  const gradients: Record<string, string> = {
    action: "linear-gradient(135deg, #f97316, #dc2626)",
    "sci-fi": "linear-gradient(135deg, #8b5cf6, #3b82f6)",
    drama: "linear-gradient(135deg, #0ea5e9, #0891b2)",
    comedy: "linear-gradient(135deg, #fbbf24, #f97316)",
    thriller: "linear-gradient(135deg, #374151, #111827)",
    horror: "linear-gradient(135deg, #1f2937, #000000)",
    romance: "linear-gradient(135deg, #ec4899, #f43f5e)",
    documentary: "linear-gradient(135deg, #22c55e, #15803d)",
    animation: "linear-gradient(135deg, #06b6d4, #8b5cf6)",
    fantasy: "linear-gradient(135deg, #7c3aed, #c026d3)",
  };
  return gradients[genre] || "linear-gradient(135deg, #6b7280, #374151)";
}
