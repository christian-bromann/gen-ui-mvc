"use client";

import type { Content } from "@/lib/types";
import { ContentCard } from "./ContentCard";
import { Search, X } from "lucide-react";

interface SearchResultsProps {
  results: Content[];
  query?: string;
  isLoading?: boolean;
  onClear?: () => void;
}

export function SearchResults({
  results,
  query,
  isLoading,
  onClear,
}: SearchResultsProps) {
  if (!query && results.length === 0) {
    return null;
  }

  if (isLoading) {
    return (
      <section className="py-8 bg-zinc-900/50 backdrop-blur-sm">
        <div className="px-8 md:px-16">
          <div className="flex items-center gap-3 mb-6">
            <Search className="w-5 h-5 text-amber-400" />
            <div className="h-6 w-48 bg-zinc-800 rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="aspect-[2/3] bg-zinc-800 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 bg-zinc-900/50 backdrop-blur-sm border-y border-zinc-800">
      <div className="px-8 md:px-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white">
              {results.length > 0 ? (
                <>
                  Found {results.length} results for{" "}
                  <span className="text-amber-400">"{query}"</span>
                </>
              ) : (
                <>
                  No results for{" "}
                  <span className="text-amber-400">"{query}"</span>
                </>
              )}
            </h2>
          </div>
          {onClear && (
            <button
              onClick={onClear}
              className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
              Clear search
            </button>
          )}
        </div>

        {/* Results Grid */}
        {results.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {results.map((item) => (
              <ContentCard key={item.id} content={item} size="medium" />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-white/50 mb-4">
              Try searching for a different title, actor, or genre
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

