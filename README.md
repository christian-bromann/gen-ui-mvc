# StreamFlow - AI-Powered Streaming Dashboard

An experimental project demonstrating how an AI agent can dynamically control UI components in a streaming service dashboard. The agent uses LangGraph's state management and tool calls to update different parts of the interface based on user interactions.

## 🎯 Concept

This project explores the idea of **Model-View-Controller** where the **Model** is an AI agent that:
- Holds state for various UI components
- Responds to natural language requests
- Uses tool calls to update different parts of the dashboard
- Streams state updates to the frontend in real-time

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React)                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │
│  │   Hero   │ │Recommend-│ │ Trending │ │ Continue │ │ Search │ │
│  │ Section  │ │  ations  │ │   Now    │ │ Watching │ │Results │ │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └────────┘ │
│                              ▲                                  │
│                              │ State Updates                    │
│  ┌───────────────────────────┴───────────────────────────────┐  │
│  │                    Chat Interface                         │  │
│  │            "Show me sci-fi recommendations"               │  │
│  └───────────────────────────────────────────────────────────┘  │
└──────────────────────────────────┬──────────────────────────────┘
                                   │ SSE Stream
                                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                     LangGraph Agent                             │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    State (UIState)                        │  │
│  │  • featuredContent    • recommendations    • trending     │  │
│  │  • continueWatching   • searchResults      • userProfile  │  │
│  │  • notifications      • activeGenre        • loadingStates│  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                  │
│                              ▼                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                        Tools                              │  │
│  │  • get_recommendations  • search_content  • get_trending  │  │
│  │  • set_featured_content • get_continue_watching           │  │
│  │  • get_user_profile     • update_preferences              │  │
│  │  • send_notification    • get_content_details             │  │
│  │  • initialize_dashboard                                   │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## 🎬 Components

The dashboard features **6 main components** driven by the agent state:

1. **HeroSection** - Featured content with backdrop, ratings, and actions
2. **ContentRow** (Recommendations) - Personalized content picks with horizontal scrolling
3. **ContentRow** (Trending) - Popular content this week
4. **ContinueWatching** - Resume where you left off with progress bars
5. **SearchResults** - Dynamic search results grid
6. **UserProfile** - User preferences and settings panel

Additional components:
- **Notifications** - Toast alerts from agent actions
- **ChatInterface** - Natural language input for interacting with the agent

## 🛠️ Tools

The agent has access to these tools to control the UI:

| Tool | Description |
|------|-------------|
| `get_recommendations` | Fetch personalized or genre-specific recommendations |
| `search_content` | Search movies/shows by title, actor, or director |
| `get_trending` | Get currently popular content |
| `set_featured_content` | Set the hero section content |
| `get_continue_watching` | Load user's watch history |
| `get_user_profile` | Fetch user profile and preferences |
| `update_preferences` | Modify user settings |
| `send_notification` | Display alerts to the user |
| `get_content_details` | Show detailed info about specific content |
| `initialize_dashboard` | Reset/load default dashboard state |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- OpenAI API key

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
echo "OPENAI_API_KEY=your_openai_api_key_here" > .env.local
```

### Running the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the dashboard.

---

## 💬 Prompt Guide: How to Control the UI

The AI agent responds to natural language prompts and updates the dashboard accordingly. Here's a comprehensive guide to all available prompts and how they change the UI.

### 🎬 Content Discovery by Genre

Ask for recommendations by genre or mood - the agent will update both the **Hero Section** (featured content) and the **Recommendations Row**.

| Prompt | Hero Section | Recommendations Row |
|--------|-------------|---------------------|
| `"Show me sci-fi recommendations"` | Sci-fi movie/show | Sci-fi content |
| `"I want to watch something scary"` | Horror movie | Horror content |
| `"Find me a comedy"` | Comedy movie | Comedies |
| `"Show me action movies"` | Action movie | Action content |
| `"Recommend something romantic"` | Romance movie | Romantic content |
| `"I'm in the mood for a thriller"` | Thriller | Thrillers |
| `"Show me fantasy content"` | Fantasy show/movie | Fantasy content |
| `"Any good documentaries?"` | Documentary | Documentaries |
| `"Show me animated movies"` | Animation | Animated content |
| `"What dramas do you have?"` | Drama | Dramatic content |

**Available Genres:** `action`, `comedy`, `drama`, `horror`, `sci-fi`, `romance`, `thriller`, `documentary`, `animation`, `fantasy`

**Mood Mapping:** The agent understands natural language:
- "scary", "spooky", "frightening" → Horror
- "funny", "hilarious", "laugh" → Comedy
- "exciting", "adventure" → Action
- "space", "futuristic" → Sci-Fi
- "magical", "dragons" → Fantasy

### 🔍 Search

Search for specific content, actors, or directors. Results appear in the **Search Results Section**.

| Prompt | What Happens |
|--------|-------------|
| `"Search for Florence Pugh"` | Shows all content with Florence Pugh |
| `"Find movies with Anya Taylor-Joy"` | Shows her movies and shows |
| `"Search for Stellar Horizons"` | Finds matching title |
| `"Find something by David Fincher"` | Shows director's work |
| `"Look up The Dragon's Covenant"` | Finds specific title |

### 📈 Trending Content

Get popular and top-rated content. Updates the **Trending Row**.

| Prompt | What Happens |
|--------|-------------|
| `"What's trending right now?"` | Shows popular content |
| `"Show me what's popular"` | Displays trending content |
| `"What are the top rated shows?"` | Shows highest-rated content |
| `"What should I watch?"` | Shows trending + recommendations |

### ⏯️ Watch History

View your in-progress content. Updates the **Continue Watching Row**.

| Prompt | What Happens |
|--------|-------------|
| `"Show my continue watching"` | Displays in-progress content with progress bars |
| `"What was I watching?"` | Shows watch history |
| `"Show my watch history"` | Displays continue watching list |
| `"Resume my shows"` | Shows content to continue |

### 👤 Profile & Preferences

Manage your profile and preferences. Updates **User Profile** and triggers **Notifications**.

| Prompt | What Happens |
|--------|-------------|
| `"Show my profile"` | Loads profile data (click avatar to view) |
| `"What are my preferences?"` | Shows favorite genres and settings |
| `"Add comedy to my favorites"` | Updates preferences + shows notification |
| `"Turn off autoplay"` | Toggles autoplay setting |
| `"Disable notifications"` | Updates notification settings |
| `"Update my favorite genres to action and horror"` | Changes genre preferences |
| `"Set my maturity rating to PG-13"` | Updates content filter |

### 🎯 Featured Content Control

Directly control what appears in the **Hero Section**.

| Prompt | What Happens |
|--------|-------------|
| `"Feature The Dragon's Covenant"` | Shows that specific title in hero |
| `"Highlight Quantum Dreams"` | Features that movie |
| `"Show me something new"` | Random top-rated pick in hero |
| `"Refresh the featured content"` | Changes to new random pick |
| `"Feature a horror movie"` | Shows top horror in hero |

### 🔔 Notifications

Trigger toast notifications that appear in the top-right corner.

| Prompt | What Happens |
|--------|-------------|
| `"Send me a tip about horror movies"` | Info notification appears |
| `"Alert me about new releases"` | Notification pops up |
| `"Remind me to watch later"` | Shows reminder notification |

### 🔄 Reset Dashboard

Reset everything to the default state.

| Prompt | What Happens |
|--------|-------------|
| `"Reset the dashboard"` | Everything resets to defaults |
| `"Initialize the view"` | Full dashboard reload |
| `"Start fresh"` | Clears and reinitializes |
| `"Go back to home"` | Returns to default state |

### 🔗 Combination Prompts

The agent can handle multiple requests at once:

| Prompt | What Happens |
|--------|-------------|
| `"Show horror recommendations and my continue watching"` | Updates both sections |
| `"Search for Mads Mikkelsen and show trending"` | Search results + trending |
| `"Feature a thriller and show thriller recommendations"` | Hero + recommendations = thrillers |
| `"Update my preferences to include sci-fi and show sci-fi movies"` | Updates prefs + shows content |

### 🎮 Quick Actions

You can also click the **genre buttons** at the bottom of the dashboard to quickly get recommendations for that genre!

---

## 🧪 How It Works

1. **User sends a message** through the chat interface
2. **Agent processes the request** using GPT-4o-mini
3. **Agent calls appropriate tools** based on the user's intent
4. **Tool results are processed** by middleware that extracts UI state updates
5. **State updates are streamed** to the frontend via SSE
6. **React components re-render** with the new state
7. **AI response streams** token-by-token for real-time feedback

The key innovation is that the **agent controls the UI through state updates**, not direct component manipulation. This creates a clean separation where:
- The agent decides *what* to show
- The components decide *how* to render it

## 📁 Project Structure

```
├── app/
│   ├── api/chat/route.ts    # Streaming API endpoint
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main dashboard page
├── components/
│   ├── ChatInterface.tsx    # User input component
│   ├── ContentCard.tsx      # Movie/show card
│   ├── ContentRow.tsx       # Horizontal scrolling row
│   ├── ContinueWatching.tsx # Watch progress component
│   ├── HeroSection.tsx      # Featured content hero
│   ├── Notifications.tsx    # Toast notifications
│   ├── SearchResults.tsx    # Search results grid
│   └── UserProfile.tsx      # User preferences panel
├── lib/
│   ├── agent.ts             # LangChain agent with middleware
│   ├── mock-data.ts         # Simulated content database (22 titles)
│   └── types.ts             # TypeScript types and Zod schemas
```

## 🎥 Mock Content Library

The dashboard includes 22 mock movies and shows across all genres:

| Genre | Titles |
|-------|--------|
| Action | Velocity Protocol, Shadow Strike, Apex Predator |
| Sci-Fi | Stellar Horizons, Quantum Dreams, The Last Algorithm |
| Drama | Echoes of Tomorrow, The Weight of Silence |
| Horror | The Hollow House, Whispers in the Dark |
| Comedy | Chaos Theory, Office Apocalypse |
| Romance | Letters from Lisbon, The Art of Falling |
| Thriller | The Informant, Mind Games |
| Documentary | Beyond the Ice, The Startup Wars |
| Animation | The Spirit Garden, Neon Knights |
| Fantasy | The Dragon's Covenant, The Witch's Grimoire |

## 🔮 Future Enhancements

- **Sub-agents**: Use tool calls to trigger specialized sub-agents for complex tasks
- **Persistent state**: Store conversation and UI state across sessions
- **Real-time collaboration**: Multiple users sharing a dashboard session
- **Content playback**: Integrate actual video streaming
- **Personalization engine**: ML-based recommendation improvements
- **Voice input**: Speak to control the dashboard

## 📄 License

MIT
