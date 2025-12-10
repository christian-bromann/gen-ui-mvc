"use client";

import type { Content } from "@/lib/types";
import { ContentCard } from "./ContentCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";

interface ContentRowProps {
  title: string;
  subtitle?: string;
  content: Content[];
  isLoading?: boolean;
  cardSize?: "small" | "medium" | "large";
}

export function ContentRow({
  title,
  subtitle,
  content,
  isLoading,
  cardSize = "medium",
}: ContentRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = direction === "left" ? -400 : 400;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <section className="py-6">
        <div className="px-8 md:px-16 mb-4">
          <div className="h-8 w-64 bg-zinc-800 rounded animate-pulse" />
        </div>
        <div className="flex gap-4 px-8 md:px-16 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="w-40 md:w-52 flex-shrink-0 aspect-[2/3] bg-zinc-800 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  if (content.length === 0) {
    return null;
  }

  return (
    <section className="py-6 group/section">
      {/* Header */}
      <div className="px-8 md:px-16 mb-4 flex items-end gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white">{title}</h2>
          {subtitle && (
            <p className="text-sm text-white/50 mt-1">{subtitle}</p>
          )}
        </div>
        <span className="text-amber-400 text-sm font-medium opacity-0 group-hover/section:opacity-100 transition-opacity cursor-pointer hover:underline">
          See all →
        </span>
      </div>

      {/* Scrollable Content */}
      <div className="relative">
        {/* Left Arrow */}
        {showLeftArrow && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-20 bg-black/80 backdrop-blur-sm rounded-lg flex items-center justify-center text-white opacity-0 group-hover/section:opacity-100 transition-opacity hover:bg-black"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Right Arrow */}
        {showRightArrow && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-20 bg-black/80 backdrop-blur-sm rounded-lg flex items-center justify-center text-white opacity-0 group-hover/section:opacity-100 transition-opacity hover:bg-black"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Content */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-4 px-8 md:px-16 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {content.map((item) => (
            <ContentCard key={item.id} content={item} size={cardSize} />
          ))}
        </div>
      </div>
    </section>
  );
}

