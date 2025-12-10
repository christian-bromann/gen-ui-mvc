"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Bot, User, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatInterfaceProps {
  messages: Message[];
  onSend: (message: string) => void;
  isLoading?: boolean;
}

export function ChatInterface({ messages, onSend, isLoading }: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSend(input.trim());
      setInput("");
    }
  };

  const suggestions = [
    "Show me sci-fi recommendations",
    "What's trending right now?",
    "Find action movies",
    "Show my continue watching",
    "Recommend something to watch tonight",
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-zinc-950 via-zinc-950 to-transparent pt-20 pb-6 z-40">
      <div className="max-w-4xl mx-auto px-4">
        {/* Messages */}
        {messages.length > 0 && (
          <div className="mb-4 max-h-64 overflow-y-auto scrollbar-hide bg-zinc-900/80 backdrop-blur-sm rounded-xl border border-zinc-800 p-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 ${
                    message.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === "user"
                        ? "bg-amber-500"
                        : "bg-gradient-to-br from-purple-500 to-pink-500"
                    }`}
                  >
                    {message.role === "user" ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                      message.role === "user"
                        ? "bg-amber-500 text-white"
                        : "bg-zinc-800 text-white/90"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-purple-500 to-pink-500">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-zinc-800 px-4 py-3 rounded-2xl">
                    <Loader2 className="w-5 h-5 text-white/50 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}

        {/* Quick Suggestions (only show when no messages) */}
        {messages.length === 0 && (
          <div className="mb-4 flex flex-wrap justify-center gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => onSend(suggestion)}
                className="px-4 py-2 bg-zinc-800/80 backdrop-blur-sm text-white/70 text-sm rounded-full border border-zinc-700 hover:border-amber-500/50 hover:text-white transition-all hover:bg-zinc-700/80"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative flex items-center">
            <div className="absolute left-4 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me what to watch..."
              disabled={isLoading}
              className="w-full pl-12 pr-14 py-4 bg-zinc-900/90 backdrop-blur-sm text-white placeholder-white/40 rounded-2xl border border-zinc-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all text-base disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-3 w-10 h-10 bg-amber-500 text-black rounded-xl flex items-center justify-center hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

