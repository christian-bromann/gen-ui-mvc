import { registry, z } from "zod";
import { tool } from "@langchain/core/tools";
import { createAgent, createMiddleware } from "langchain";
import { ChatOpenAI } from "@langchain/openai";
import { Command } from "@langchain/langgraph";
import { AIMessageChunk, ToolMessage } from "@langchain/core/messages";

import {
  GenreSchema,
  StreamingUIStateSchema,
  type Genre,
  type Content,
  StreamingUIState,
} from "./types";
import {
  getContentByGenre,
  searchContent,
  getTrendingContent,
  getRecommendationsForGenres,
  getFeaturedContent,
  mockUserProfile,
  mockWatchHistory,
  mockContentDatabase,
  getContentById,
} from "./mock-data";

// ============ Agent State Definition ============

// Define the UI state schema for the middleware
const UIStateSchema = z.object({
  uiState: StreamingUIStateSchema.default({
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
  }),
});

// ============ Tool Definitions ============

// Tool: Get movie/show recommendations by genre
const getRecommendationsTool = tool(
  async ({
    genre,
    reason,
  }: {
    genre?: Genre;
    reason?: string;
  }): Promise<Command> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    let recommendations: Content[];
    let recommendationReason: string;

    if (genre) {
      recommendations = getContentByGenre(genre);
      recommendationReason =
        reason || `Curated ${genre} picks based on your viewing history`;
    } else {
      recommendations = getRecommendationsForGenres(
        mockUserProfile.preferences.favoriteGenres as Genre[]
      );
      recommendationReason =
        reason || "Personalized picks based on your favorite genres";
    }

    return new Command({
      update: {
        uiState: {
          recommendations: recommendations.slice(0, 6),
          recommendationReason,
          activeGenre: genre || null,
        },
      },
    });
  },
  {
    name: "get_recommendations",
    description:
      "Get movie and show recommendations. Optionally filter by genre. Use this when the user asks for recommendations, suggestions, or what to watch.",
    schema: z.object({
      genre: GenreSchema.optional().describe(
        "Optional genre to filter recommendations"
      ),
      reason: z
        .string()
        .optional()
        .describe(
          "Custom reason/description for these recommendations to display to user"
        ),
    }),
  }
);

// Tool: Search for content
const searchContentTool = tool(
  async ({ query }: { query: string }): Promise<Command> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const results = searchContent(query);

    return new Command({
      update: {
        uiState: {
          searchResults: results,
          searchQuery: query,
        },
      },
    });
  },
  {
    name: "search_content",
    description:
      "Search for movies, shows, actors, or directors. Use this when the user wants to find specific content.",
    schema: z.object({
      query: z.string().describe("The search query"),
    }),
  }
);

// Tool: Get trending content
const getTrendingTool = tool(
  async ({ category }: { category?: string }): Promise<Command> => {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const trending = getTrendingContent();

    return new Command({
      update: {
        uiState: {
          trending,
          trendingCategory: category || "Top Rated This Week",
        },
      },
    });
  },
  {
    name: "get_trending",
    description:
      "Get currently trending and popular content. Use when user asks about what's popular or trending.",
    schema: z.object({
      category: z
        .string()
        .optional()
        .describe("Category label for trending section"),
    }),
  }
);

// Tool: Set featured/hero content
const setFeaturedContentTool = tool(
  async ({
    contentId,
    random,
    genre,
  }: {
    contentId?: string;
    random?: boolean;
    genre?: Genre;
  }): Promise<Command> => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    let featured: Content | undefined;

    if (contentId) {
      featured = getContentById(contentId);
    } else if (genre) {
      const genreContent = getContentByGenre(genre);
      if (genreContent.length > 0) {
        const topContent = genreContent
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 3);
        featured = topContent[Math.floor(Math.random() * topContent.length)];
      }
    } else if (random) {
      featured = getFeaturedContent();
    } else {
      featured = getFeaturedContent();
    }

    if (!featured) {
      return new Command({
        update: {
          uiState: {
            notifications: [
              {
                id: crypto.randomUUID(),
                type: "error",
                message: "Content not found",
                timestamp: new Date().toISOString(),
              },
            ],
          },
        },
      });
    }

    return new Command({
      update: {
        uiState: {
          featuredContent: featured,
        },
      },
    });
  },
  {
    name: "set_featured_content",
    description:
      "Set the hero/featured content that appears prominently at the top. Use when user wants to highlight or feature specific content, or to refresh the featured section. When recommending by genre, pass the genre parameter to feature matching content.",
    schema: z.object({
      contentId: z
        .string()
        .optional()
        .describe("Specific content ID to feature"),
      genre: GenreSchema.optional().describe(
        "Feature a highly-rated content from this genre"
      ),
      random: z
        .boolean()
        .optional()
        .describe("If true, select a random highly-rated content to feature"),
    }),
  }
);

// Tool: Get user's continue watching list
const getContinueWatchingTool = tool(
  async (): Promise<Command> => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    return new Command({
      update: {
        uiState: {
          continueWatching: mockWatchHistory,
        },
      },
    });
  },
  {
    name: "get_continue_watching",
    description:
      "Get the user's continue watching list showing content they haven't finished. Use when user asks about their watch history or what they were watching.",
    schema: z.object({}),
  }
);

// Tool: Get user profile
const getUserProfileTool = tool(
  async (): Promise<Command> => {
    await new Promise((resolve) => setTimeout(resolve, 150));

    return new Command({
      update: {
        uiState: {
          userProfile: mockUserProfile,
        },
      },
    });
  },
  {
    name: "get_user_profile",
    description:
      "Get the user's profile information and preferences. Use when user asks about their account, preferences, or profile.",
    schema: z.object({}),
  }
);

// Tool: Update user preferences
const updatePreferencesTool = tool(
  async ({
    favoriteGenres,
    autoplay,
    notifications,
  }: {
    favoriteGenres?: Genre[];
    autoplay?: boolean;
    notifications?: boolean;
  }): Promise<Command> => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const updatedPreferences = { ...mockUserProfile.preferences };

    if (favoriteGenres) {
      updatedPreferences.favoriteGenres = favoriteGenres;
    }
    if (autoplay !== undefined) {
      updatedPreferences.autoplayEnabled = autoplay;
    }
    if (notifications !== undefined) {
      updatedPreferences.notificationsEnabled = notifications;
    }

    const updatedProfile = {
      ...mockUserProfile,
      preferences: updatedPreferences,
    };

    return new Command({
      update: {
        uiState: {
          userProfile: updatedProfile,
          notifications: [
            {
              id: crypto.randomUUID(),
              type: "success",
              message: "Your preferences have been updated!",
              timestamp: new Date().toISOString(),
            },
          ],
        },
      },
    });
  },
  {
    name: "update_preferences",
    description:
      "Update user preferences like favorite genres, autoplay setting, or notifications. Use when user wants to change their preferences.",
    schema: z.object({
      favoriteGenres: z
        .array(GenreSchema)
        .optional()
        .describe("New list of favorite genres"),
      autoplay: z.boolean().optional().describe("Enable/disable autoplay"),
      notifications: z
        .boolean()
        .optional()
        .describe("Enable/disable notifications"),
    }),
  }
);

// Tool: Send notification to user
const sendNotificationTool = tool(
  async ({
    message,
    type,
  }: {
    message: string;
    type?: "info" | "success" | "warning" | "error";
  }): Promise<Command> => {
    return new Command({
      update: {
        uiState: {
          notifications: [
            {
              id: crypto.randomUUID(),
              type: type || "info",
              message,
              timestamp: new Date().toISOString(),
            },
          ],
        },
      },
    });
  },
  {
    name: "send_notification",
    description:
      "Send a notification/alert to the user interface. Use for confirmations, tips, or important information.",
    schema: z.object({
      message: z.string().describe("The notification message"),
      type: z
        .enum(["info", "success", "warning", "error"])
        .optional()
        .describe("Type of notification"),
    }),
  }
);

// Tool: Get content details
const getContentDetailsTool = tool(
  async ({
    contentId,
    title,
  }: {
    contentId?: string;
    title?: string;
  }): Promise<Command> => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    let content: Content | undefined;

    if (contentId) {
      content = getContentById(contentId);
    } else if (title) {
      content = mockContentDatabase.find((c) =>
        c.title.toLowerCase().includes(title.toLowerCase())
      );
    }

    if (!content) {
      return new Command({
        update: {
          uiState: {
            notifications: [
              {
                id: crypto.randomUUID(),
                type: "error",
                message: "Content not found",
                timestamp: new Date().toISOString(),
              },
            ],
          },
        },
      });
    }

    return new Command({
      update: {
        uiState: {
          featuredContent: content,
        },
      },
    });
  },
  {
    name: "get_content_details",
    description:
      "Get detailed information about a specific movie or show and display it prominently. Use when user asks about a specific title.",
    schema: z.object({
      contentId: z.string().optional().describe("The content ID"),
      title: z
        .string()
        .optional()
        .describe("The title to search for (if ID not known)"),
    }),
  }
);

// Tool: Initialize/reset dashboard
const initializeDashboardTool = tool(
  async (): Promise<Command> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const featured = getFeaturedContent();
    const recommendations = getRecommendationsForGenres(
      mockUserProfile.preferences.favoriteGenres as Genre[]
    );
    const trending = getTrendingContent();

    return new Command({
      update: {
        uiState: {
          featuredContent: featured,
          recommendations: recommendations.slice(0, 6),
          recommendationReason: "Based on your viewing preferences",
          trending: trending.slice(0, 8),
          trendingCategory: "Trending Now",
          continueWatching: mockWatchHistory,
          userProfile: mockUserProfile,
          searchResults: [],
          searchQuery: undefined,
          activeGenre: null,
          notifications: [],
        },
      },
    });
  },
  {
    name: "initialize_dashboard",
    description:
      "Initialize or reset the streaming dashboard with default content. Use at the start of a conversation or when user wants to reset the view.",
    schema: z.object({}),
  }
);

// All tools
const tools = [
  // getRecommendationsTool,
  // searchContentTool,
  // getTrendingTool,
  setFeaturedContentTool,
  // getContinueWatchingTool,
  // getUserProfileTool,
  updatePreferencesTool,
  sendNotificationTool,
  // getContentDetailsTool,
  // initializeDashboardTool,
];

// ============ Create Agent ============

const systemPrompt = `You are a helpful streaming service assistant for "StreamFlow" - a premium video streaming platform.

Your job is to help users discover content, manage their preferences, and navigate the platform.

IMPORTANT: You control the UI through tool calls. When users ask for recommendations, search for content, 
or want to see trending shows, you MUST use the appropriate tools to update the dashboard.

GENRE MAPPING - When users ask for content by mood or description, map to these genres:
- "scary", "horror", "spooky", "frightening" → genre: "horror"
- "funny", "comedy", "hilarious", "laugh" → genre: "comedy"  
- "action", "exciting", "adventure", "thrilling" → genre: "action"
- "romantic", "love", "romance" → genre: "romance"
- "sci-fi", "space", "futuristic", "science fiction" → genre: "sci-fi"
- "dramatic", "emotional", "drama" → genre: "drama"
- "animated", "cartoon", "animation" → genre: "animation"
- "fantasy", "magical", "dragons" → genre: "fantasy"
- "documentary", "real", "educational" → genre: "documentary"
- "suspense", "mystery", "thriller" → genre: "thriller"

2. Always respond with a brief, friendly message explaining what you've shown them.

Available actions:
- search_content: Search for specific movies, shows, actors, or directors
- set_featured_content: Highlight a specific title in the hero section (use random=true for genre picks)
- update_preferences: Change user settings like favorite genres
- send_notification: Send alerts or confirmations
- initialize_dashboard: Reset/initialize the full dashboard view

ONLY CALL ONE TOOL AT A TIME.

Current date: ${new Date().toLocaleDateString()}`;

const model = new ChatOpenAI({
  model: "gpt-4o-mini",
});

const middleware = createMiddleware({
  name: "my_middleware",
  beforeModel: async (state, ctx) => {
    console.log("state", state);
    const lastMessage = state.messages.at(-1);
    if (AIMessageChunk.isInstance(lastMessage)) {
      const toolMessages: ToolMessage[] =
        lastMessage.tool_calls?.map(
          (toolCall) =>
            new ToolMessage({
              tool_call_id: toolCall.id!,
              content: "Tool call successful",
            })
        ) || [];
      return { messages: toolMessages };
    }
  },
  afterModel: async (state, ctx) => {
    console.log("state", state);
    console.log("ctx", ctx);
  },
});

// Factory function to create agent per request
export function createStreamingAgent() {
  return createAgent({
    model,
    tools,
    systemPrompt,
    middleware: [middleware],
    stateSchema: UIStateSchema,
  });
}

// Export the state annotation for consumers
export { UIStateSchema };
