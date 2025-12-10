import { z } from "zod";

// ============ Content Types ============

export const GenreSchema = z.enum([
  "action",
  "comedy",
  "drama",
  "horror",
  "sci-fi",
  "romance",
  "thriller",
  "documentary",
  "animation",
  "fantasy",
]);
export type Genre = z.infer<typeof GenreSchema>;

export const ContentTypeSchema = z.enum(["movie", "series", "documentary"]);
export type ContentType = z.infer<typeof ContentTypeSchema>;

export const ContentSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  genre: GenreSchema,
  type: ContentTypeSchema,
  year: z.number(),
  rating: z.number().min(0).max(10),
  duration: z.string(), // e.g., "2h 15m" or "45m"
  posterUrl: z.string(),
  backdropUrl: z.string(),
  cast: z.array(z.string()),
  director: z.string().optional(),
  trailerUrl: z.string().optional(),
  matchPercentage: z.number().min(0).max(100).optional(),
});
export type Content = z.infer<typeof ContentSchema>;

export const WatchProgressSchema = z.object({
  content: ContentSchema,
  progress: z.number().min(0).max(100), // Percentage watched
  lastWatched: z.string(), // ISO date string
  episode: z.string().optional(), // For series, e.g., "S2E5"
});
export type WatchProgress = z.infer<typeof WatchProgressSchema>;

// ============ User Types ============

export const UserPreferencesSchema = z.object({
  favoriteGenres: z.array(GenreSchema),
  preferredContentTypes: z.array(ContentTypeSchema),
  maturityRating: z.enum(["G", "PG", "PG-13", "R", "NC-17"]),
  autoplayEnabled: z.boolean(),
  notificationsEnabled: z.boolean(),
});
export type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export const UserProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatarUrl: z.string(),
  preferences: UserPreferencesSchema,
  memberSince: z.string(),
  watchlistCount: z.number(),
});
export type UserProfile = z.infer<typeof UserProfileSchema>;

// ============ UI State Types ============

export const NotificationSchema = z.object({
  id: z.string(),
  type: z.enum(["info", "success", "warning", "error"]),
  message: z.string(),
  timestamp: z.string(),
});
export type Notification = z.infer<typeof NotificationSchema>;

// ============ Agent UI State ============

export const StreamingUIStateSchema = z.object({
  // Hero Section - Featured content
  featuredContent: ContentSchema.nullable().default(null),

  // Personalized Recommendations
  recommendations: z.array(ContentSchema).default([]),
  recommendationReason: z.string().optional(),

  // Trending Now
  trending: z.array(ContentSchema).default([]),
  trendingCategory: z.string().optional(),

  // Continue Watching / Watch History
  continueWatching: z.array(WatchProgressSchema).default([]),

  // Search Results
  searchResults: z.array(ContentSchema).default([]),
  searchQuery: z.string().optional(),

  // User Profile & Preferences
  userProfile: UserProfileSchema.nullable().default(null),

  // Current active genre filter
  activeGenre: GenreSchema.nullable().default(null),

  // Notifications/Alerts from the agent
  notifications: z.array(NotificationSchema).default([]),

  // Loading states for different sections
  loadingStates: z
    .object({
      recommendations: z.boolean(),
      trending: z.boolean(),
      search: z.boolean(),
      featured: z.boolean(),
    })
    .default({
      recommendations: false,
      trending: false,
      search: false,
      featured: false,
    }),
});
export type StreamingUIState = z.infer<typeof StreamingUIStateSchema>;

// ============ Default Values ============

export const defaultUIState: StreamingUIState = {
  featuredContent: null,
  recommendations: [],
  recommendationReason: undefined,
  trending: [],
  trendingCategory: undefined,
  continueWatching: [],
  searchResults: [],
  searchQuery: undefined,
  userProfile: null,
  activeGenre: null,
  notifications: [],
  loadingStates: {
    recommendations: false,
    trending: false,
    search: false,
    featured: false,
  },
};

