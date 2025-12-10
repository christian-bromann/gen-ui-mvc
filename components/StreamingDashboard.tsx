"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useStream, FetchStreamTransport } from "@langchain/langgraph-sdk/react";

import { HeroSection } from "@/components/HeroSection";
import { ContentRow } from "@/components/ContentRow";
import { ContinueWatching } from "@/components/ContinueWatching";
import { SearchResults } from "@/components/SearchResults";
import { UserProfile } from "@/components/UserProfile";
import { Notifications } from "@/components/Notifications";
import { ChatInterface } from "@/components/ChatInterface";
import type { StreamingUIState } from "@/lib/types";
import { defaultUIState } from "@/lib/types";
import { isToolMessage, isHumanMessage, extractTextContent } from "@/lib/utils";
import { Film } from "lucide-react";

export default function StreamingDashboard() {
  const [uiState, setUIState] = useState<StreamingUIState>(defaultUIState);
  const [profileExpanded, setProfileExpanded] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Create transport for the streaming API
  const transport = useMemo(() => {
    return new FetchStreamTransport({
      apiUrl: "/api/chat",
    });
  }, []);

  // Use the stream hook from LangGraph SDK
  const stream = useStream({
    transport,
  });

  // Watch for state changes in stream.values to extract uiState
  useEffect(() => {
    const values = stream.values as { uiState?: StreamingUIState } | undefined;
    if (values?.uiState) {
      setUIState((prev) => ({ ...prev, ...values.uiState }));
    }
  }, [stream.values]);

  // Convert stream messages to our chat format
  const chatMessages = useMemo(() => {
    return stream.messages
      .filter((msg) => !isToolMessage(msg))
      .map((msg) => ({
        role: isHumanMessage(msg) ? "user" as const : "assistant" as const,
        content: extractTextContent(msg.content),
      }))
      .filter((msg) => msg.content.trim() !== "");
  }, [stream.messages]);

  // Send message to agent
  const handleSendMessage = useCallback(
    (content: string) => {
      if (!content.trim() || stream.isLoading) return;

      stream.submit({
        messages: [{ content, type: "human" }],
        uiState,
      });
    },
    [stream, uiState]
  );

  // Initialize dashboard on mount
  useEffect(() => {
    if (!initialized && !stream.isLoading) {
      setInitialized(true);
      // Delay to ensure component is mounted
      const timer = setTimeout(() => {
        handleSendMessage("Initialize the dashboard with featured content and recommendations");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [initialized, stream.isLoading, handleSendMessage]);

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
        messages={chatMessages}
        onSend={handleSendMessage}
        isLoading={stream.isLoading}
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
