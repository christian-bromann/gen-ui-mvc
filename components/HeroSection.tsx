"use client";

import type { Content } from "@/lib/types";
import { Play, Plus, Info } from "lucide-react";

interface HeroSectionProps {
  content: Content | null;
  isLoading?: boolean;
}

export function HeroSection({ content, isLoading }: HeroSectionProps) {
  if (isLoading) {
    return (
      <div className="relative h-[70vh] min-h-[500px] bg-gradient-to-b from-zinc-900 to-zinc-950 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <div className="h-12 w-96 bg-zinc-800 rounded mb-4" />
          <div className="h-4 w-72 bg-zinc-800 rounded mb-6" />
          <div className="h-20 w-[600px] max-w-full bg-zinc-800 rounded" />
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="relative h-[70vh] min-h-[500px] bg-gradient-to-br from-indigo-950 via-zinc-900 to-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white/50 mb-2">
            Welcome to StreamFlow
          </h2>
          <p className="text-white/30">
            Ask me to show you something amazing to watch!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
        style={{
          backgroundImage: `url(${content.backdropUrl})`,
        }}
      />

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/80 via-transparent to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 max-w-4xl">
        {/* Match Badge */}
        {content.matchPercentage && (
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            {content.matchPercentage}% Match
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-black text-white mb-3 tracking-tight drop-shadow-lg">
          {content.title}
        </h1>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-white/70 text-sm mb-4">
          <span className="text-emerald-400 font-semibold">
            ★ {content.rating.toFixed(1)}
          </span>
          <span>{content.year}</span>
          <span className="capitalize">{content.genre}</span>
          <span>{content.duration}</span>
          <span className="capitalize border border-white/20 px-2 py-0.5 rounded text-xs">
            {content.type}
          </span>
        </div>

        {/* Description */}
        <p className="text-lg text-white/80 mb-6 max-w-2xl leading-relaxed line-clamp-3">
          {content.description}
        </p>

        {/* Cast */}
        {content.cast.length > 0 && (
          <p className="text-sm text-white/50 mb-6">
            Starring:{" "}
            <span className="text-white/70">{content.cast.join(", ")}</span>
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded-lg font-bold text-lg hover:bg-white/90 transition-all hover:scale-105 active:scale-95">
            <Play className="w-6 h-6 fill-current" />
            Play
          </button>
          <button className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-all border border-white/10">
            <Plus className="w-5 h-5" />
            My List
          </button>
          <button className="flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-sm text-white rounded-full hover:bg-white/20 transition-all border border-white/10">
            <Info className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

