"use client";

import type { Content } from "@/lib/types";
import { Play } from "lucide-react";

interface ContentCardProps {
  content: Content;
  size?: "small" | "medium" | "large";
  showRating?: boolean;
  showMatch?: boolean;
  onClick?: () => void;
}

export function ContentCard({
  content,
  size = "medium",
  showRating = true,
  showMatch = true,
  onClick,
}: ContentCardProps) {
  const sizeClasses = {
    small: "w-32 md:w-40",
    medium: "w-40 md:w-52",
    large: "w-52 md:w-64",
  };

  return (
    <div
      className={`${sizeClasses[size]} flex-shrink-0 group cursor-pointer`}
      onClick={onClick}
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-zinc-800 mb-3 transition-transform duration-300 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-black/50">
        <img
          src={content.posterUrl}
          alt={content.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center text-black transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <Play className="w-6 h-6 fill-current ml-1" />
          </button>
        </div>

        {/* Match Badge */}
        {showMatch && content.matchPercentage && (
          <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded">
            {content.matchPercentage}%
          </div>
        )}

        {/* Type Badge */}
        <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded capitalize">
          {content.type}
        </div>
      </div>

      {/* Info */}
      <div className="space-y-1">
        <h3 className="font-semibold text-white text-sm truncate group-hover:text-amber-400 transition-colors">
          {content.title}
        </h3>
        <div className="flex items-center gap-2 text-xs text-white/50">
          {showRating && (
            <span className="text-amber-400">★ {content.rating.toFixed(1)}</span>
          )}
          <span>{content.year}</span>
          <span className="capitalize">{content.genre}</span>
        </div>
      </div>
    </div>
  );
}

