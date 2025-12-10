"use client";

import type { UserProfile as UserProfileType } from "@/lib/types";
import { User, Settings, Bell, Play, Bookmark, Calendar } from "lucide-react";

interface UserProfileProps {
  profile: UserProfileType | null;
  isExpanded?: boolean;
  onToggle?: () => void;
}

export function UserProfile({
  profile,
  isExpanded = false,
  onToggle,
}: UserProfileProps) {
  if (!profile) {
    return (
      <div className="flex items-center gap-3 cursor-pointer group" onClick={onToggle}>
        <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
          <User className="w-5 h-5 text-zinc-500" />
        </div>
      </div>
    );
  }

  const genreColors: Record<string, string> = {
    "sci-fi": "bg-purple-500/20 text-purple-300 border-purple-500/30",
    thriller: "bg-red-500/20 text-red-300 border-red-500/30",
    drama: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    action: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    comedy: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    horror: "bg-gray-500/20 text-gray-300 border-gray-500/30",
    romance: "bg-pink-500/20 text-pink-300 border-pink-500/30",
    documentary: "bg-green-500/20 text-green-300 border-green-500/30",
    animation: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    fantasy: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  };

  return (
    <div className="relative">
      {/* Avatar Button */}
      <button
        onClick={onToggle}
        className="flex items-center gap-3 group"
      >
        <img
          src={profile.avatarUrl}
          alt={profile.name}
          className="w-10 h-10 rounded-full border-2 border-transparent group-hover:border-amber-400 transition-colors"
        />
        <span className="text-white font-medium hidden md:block">
          {profile.name}
        </span>
      </button>

      {/* Expanded Panel */}
      {isExpanded && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-50">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-14 h-14 rounded-full border-2 border-amber-400"
              />
              <div>
                <h3 className="font-bold text-white text-lg">{profile.name}</h3>
                <p className="text-sm text-white/50">
                  Member since{" "}
                  {new Date(profile.memberSince).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-px bg-zinc-800 border-b border-zinc-800">
            <div className="bg-zinc-900 p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-amber-400 mb-1">
                <Bookmark className="w-4 h-4" />
                <span className="text-xl font-bold">{profile.watchlistCount}</span>
              </div>
              <p className="text-xs text-white/50">In Watchlist</p>
            </div>
            <div className="bg-zinc-900 p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-emerald-400 mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-xl font-bold">
                  {Math.floor(
                    (Date.now() - new Date(profile.memberSince).getTime()) /
                      (1000 * 60 * 60 * 24 * 30)
                  )}
                </span>
              </div>
              <p className="text-xs text-white/50">Months Active</p>
            </div>
          </div>

          {/* Preferences */}
          <div className="p-4 border-b border-zinc-800">
            <h4 className="text-sm font-semibold text-white/70 mb-3 uppercase tracking-wide">
              Favorite Genres
            </h4>
            <div className="flex flex-wrap gap-2">
              {profile.preferences.favoriteGenres.map((genre) => (
                <span
                  key={genre}
                  className={`px-3 py-1 rounded-full text-xs font-medium border capitalize ${
                    genreColors[genre] || "bg-zinc-500/20 text-zinc-300 border-zinc-500/30"
                  }`}
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white/70">
                <Play className="w-4 h-4" />
                <span className="text-sm">Autoplay</span>
              </div>
              <div
                className={`w-10 h-6 rounded-full transition-colors ${
                  profile.preferences.autoplayEnabled
                    ? "bg-amber-500"
                    : "bg-zinc-700"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full mt-0.5 transition-transform ${
                    profile.preferences.autoplayEnabled
                      ? "translate-x-4.5 ml-0.5"
                      : "translate-x-0.5"
                  }`}
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white/70">
                <Bell className="w-4 h-4" />
                <span className="text-sm">Notifications</span>
              </div>
              <div
                className={`w-10 h-6 rounded-full transition-colors ${
                  profile.preferences.notificationsEnabled
                    ? "bg-amber-500"
                    : "bg-zinc-700"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full mt-0.5 transition-transform ${
                    profile.preferences.notificationsEnabled
                      ? "translate-x-4.5 ml-0.5"
                      : "translate-x-0.5"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-zinc-800">
            <button className="w-full flex items-center justify-center gap-2 py-2 text-sm text-white/70 hover:text-white transition-colors">
              <Settings className="w-4 h-4" />
              Manage Account
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

