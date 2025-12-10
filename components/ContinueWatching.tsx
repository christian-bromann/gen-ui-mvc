"use client";

import type { WatchProgress } from "@/lib/types";
import { Play } from "lucide-react";

interface ContinueWatchingProps {
  items: WatchProgress[];
  isLoading?: boolean;
}

export function ContinueWatching({ items, isLoading }: ContinueWatchingProps) {
  if (isLoading) {
    return (
      <section className="py-6">
        <div className="px-8 md:px-16 mb-4">
          <div className="h-8 w-48 bg-zinc-800 rounded animate-pulse" />
        </div>
        <div className="flex gap-4 px-8 md:px-16 overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="w-64 md:w-80 flex-shrink-0 h-40 bg-zinc-800 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return null;
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    return `${diffDays} days ago`;
  };

  return (
    <section className="py-6">
      {/* Header */}
      <div className="px-8 md:px-16 mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-white">
          Continue Watching
        </h2>
        <p className="text-sm text-white/50 mt-1">
          Pick up where you left off
        </p>
      </div>

      {/* Cards */}
      <div
        className="flex gap-4 px-8 md:px-16 overflow-x-auto scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map((item) => (
          <div
            key={`${item.content.id}-${item.lastWatched}`}
            className="w-64 md:w-80 flex-shrink-0 group cursor-pointer"
          >
            <div className="relative rounded-lg overflow-hidden bg-zinc-800">
              {/* Backdrop Image */}
              <div className="relative h-36">
                <img
                  src={item.content.backdropUrl}
                  alt={item.content.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />

                {/* Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />

                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center text-black transform scale-75 group-hover:scale-100 transition-transform">
                    <Play className="w-6 h-6 fill-current ml-1" />
                  </button>
                </div>

                {/* Episode Badge */}
                {item.episode && (
                  <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded font-medium">
                    {item.episode}
                  </div>
                )}

                {/* Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="font-semibold text-white text-sm truncate">
                    {item.content.title}
                  </h3>
                  <p className="text-xs text-white/60">
                    {formatTimeAgo(item.lastWatched)}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-1 bg-zinc-700">
                <div
                  className="h-full bg-amber-500 transition-all duration-300"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

