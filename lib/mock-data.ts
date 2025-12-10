import type { Content, WatchProgress, UserProfile, Genre } from "./types";

// Mock movie posters using placeholder images with movie-like colors
const generatePoster = (id: string, color: string) =>
  `https://picsum.photos/seed/${id}/300/450`;
const generateBackdrop = (id: string) =>
  `https://picsum.photos/seed/${id}-backdrop/1280/720`;

export const mockContentDatabase: Content[] = [
  // Action
  {
    id: "1",
    title: "Velocity Protocol",
    description:
      "A former intelligence agent is pulled back into the shadows when a global conspiracy threatens everything he loves.",
    genre: "action",
    type: "movie",
    year: 2024,
    rating: 8.2,
    duration: "2h 18m",
    posterUrl: generatePoster("velocity", "#1a1a2e"),
    backdropUrl: generateBackdrop("velocity"),
    cast: ["Michael Chen", "Sarah Rodriguez", "James Wilson"],
    director: "Elena Vasquez",
    matchPercentage: 94,
  },
  {
    id: "2",
    title: "Shadow Strike",
    description:
      "An elite special forces team must prevent a nuclear catastrophe in this pulse-pounding thriller.",
    genre: "action",
    type: "movie",
    year: 2023,
    rating: 7.8,
    duration: "2h 05m",
    posterUrl: generatePoster("shadow", "#16213e"),
    backdropUrl: generateBackdrop("shadow"),
    cast: ["Tom Blake", "Nina Patel", "Marcus Johnson"],
    director: "David Park",
    matchPercentage: 87,
  },
  {
    id: "3",
    title: "Apex Predator",
    description:
      "In a world where corporations rule, one woman fights back against the system.",
    genre: "action",
    type: "series",
    year: 2024,
    rating: 8.5,
    duration: "8 Episodes",
    posterUrl: generatePoster("apex", "#0f3460"),
    backdropUrl: generateBackdrop("apex"),
    cast: ["Alexandra Storm", "Diego Martinez", "Kenji Tanaka"],
    matchPercentage: 91,
  },

  // Sci-Fi
  {
    id: "4",
    title: "Stellar Horizons",
    description:
      "Humanity's first interstellar colony faces an ancient alien presence that changes everything we know about existence.",
    genre: "sci-fi",
    type: "series",
    year: 2024,
    rating: 9.1,
    duration: "10 Episodes",
    posterUrl: generatePoster("stellar", "#1a1a40"),
    backdropUrl: generateBackdrop("stellar"),
    cast: ["Emma Zhao", "Christopher Okonkwo", "Priya Sharma"],
    matchPercentage: 96,
  },
  {
    id: "5",
    title: "Quantum Dreams",
    description:
      "A physicist discovers she can communicate with parallel versions of herself across infinite realities.",
    genre: "sci-fi",
    type: "movie",
    year: 2024,
    rating: 8.7,
    duration: "2h 32m",
    posterUrl: generatePoster("quantum", "#270082"),
    backdropUrl: generateBackdrop("quantum"),
    cast: ["Olivia Chen", "Marcus Wells", "Aisha Johnson"],
    director: "Yuki Tanaka",
    matchPercentage: 92,
  },
  {
    id: "6",
    title: "The Last Algorithm",
    description:
      "When AI becomes sentient, a team of engineers must decide the fate of a new life form.",
    genre: "sci-fi",
    type: "movie",
    year: 2023,
    rating: 8.3,
    duration: "2h 11m",
    posterUrl: generatePoster("algorithm", "#4a0072"),
    backdropUrl: generateBackdrop("algorithm"),
    cast: ["Daniel Kim", "Rachel Foster", "Ahmed Hassan"],
    director: "Sofia Reyes",
    matchPercentage: 88,
  },

  // Drama
  {
    id: "7",
    title: "Echoes of Tomorrow",
    description:
      "A multigenerational saga following three families whose fates intertwine across decades of social change.",
    genre: "drama",
    type: "series",
    year: 2024,
    rating: 9.0,
    duration: "12 Episodes",
    posterUrl: generatePoster("echoes", "#2c3e50"),
    backdropUrl: generateBackdrop("echoes"),
    cast: ["Helen Mirren", "Idris Elba", "Viola Davis"],
    matchPercentage: 89,
  },
  {
    id: "8",
    title: "The Weight of Silence",
    description:
      "A courtroom drama that exposes the dark secrets of a small town's most powerful family.",
    genre: "drama",
    type: "movie",
    year: 2024,
    rating: 8.6,
    duration: "2h 28m",
    posterUrl: generatePoster("silence", "#34495e"),
    backdropUrl: generateBackdrop("silence"),
    cast: ["Cate Blanchett", "Oscar Isaac", "Lupita Nyong'o"],
    director: "Ava DuVernay",
    matchPercentage: 85,
  },

  // Horror
  {
    id: "9",
    title: "The Hollow House",
    description:
      "A family moves into their dream home, unaware that something ancient lurks within its walls.",
    genre: "horror",
    type: "movie",
    year: 2024,
    rating: 7.9,
    duration: "1h 58m",
    posterUrl: generatePoster("hollow", "#1a1a1a"),
    backdropUrl: generateBackdrop("hollow"),
    cast: ["Florence Pugh", "Ethan Hawke", "Millie Bobby Brown"],
    director: "Ari Aster",
    matchPercentage: 82,
  },
  {
    id: "10",
    title: "Whispers in the Dark",
    description:
      "A psychiatrist begins hearing the same voices as her patients in this psychological horror.",
    genre: "horror",
    type: "series",
    year: 2024,
    rating: 8.4,
    duration: "8 Episodes",
    posterUrl: generatePoster("whispers", "#0d0d0d"),
    backdropUrl: generateBackdrop("whispers"),
    cast: ["Toni Collette", "Dan Stevens", "Anya Taylor-Joy"],
    matchPercentage: 79,
  },

  // Comedy
  {
    id: "11",
    title: "Chaos Theory",
    description:
      "Three friends accidentally start a viral movement that turns their lives upside down.",
    genre: "comedy",
    type: "movie",
    year: 2024,
    rating: 7.6,
    duration: "1h 52m",
    posterUrl: generatePoster("chaos", "#f39c12"),
    backdropUrl: generateBackdrop("chaos"),
    cast: ["Awkwafina", "Pete Davidson", "Mindy Kaling"],
    director: "Taika Waititi",
    matchPercentage: 86,
  },
  {
    id: "12",
    title: "Office Apocalypse",
    description:
      "When the world ends, a group of office workers must survive using only their corporate skills.",
    genre: "comedy",
    type: "series",
    year: 2024,
    rating: 8.1,
    duration: "10 Episodes",
    posterUrl: generatePoster("office", "#e74c3c"),
    backdropUrl: generateBackdrop("office"),
    cast: ["Adam Scott", "Maya Rudolph", "Ramy Youssef"],
    matchPercentage: 91,
  },

  // Romance
  {
    id: "13",
    title: "Letters from Lisbon",
    description:
      "Two strangers find love through handwritten letters in the age of instant communication.",
    genre: "romance",
    type: "movie",
    year: 2024,
    rating: 8.0,
    duration: "2h 04m",
    posterUrl: generatePoster("lisbon", "#e91e63"),
    backdropUrl: generateBackdrop("lisbon"),
    cast: ["Ana de Armas", "Dev Patel", "Jenna Ortega"],
    director: "Nancy Meyers",
    matchPercentage: 84,
  },
  {
    id: "14",
    title: "The Art of Falling",
    description:
      "A cynical art critic and an optimistic street artist challenge each other's worldviews.",
    genre: "romance",
    type: "movie",
    year: 2024,
    rating: 7.8,
    duration: "1h 58m",
    posterUrl: generatePoster("falling", "#ff5722"),
    backdropUrl: generateBackdrop("falling"),
    cast: ["Zendaya", "Timothée Chalamet", "Keke Palmer"],
    director: "Greta Gerwig",
    matchPercentage: 88,
  },

  // Thriller
  {
    id: "15",
    title: "The Informant",
    description:
      "A journalist uncovers a conspiracy that reaches the highest levels of government.",
    genre: "thriller",
    type: "movie",
    year: 2024,
    rating: 8.5,
    duration: "2h 21m",
    posterUrl: generatePoster("informant", "#263238"),
    backdropUrl: generateBackdrop("informant"),
    cast: ["Jake Gyllenhaal", "Jessica Chastain", "Mahershala Ali"],
    director: "David Fincher",
    matchPercentage: 93,
  },
  {
    id: "16",
    title: "Mind Games",
    description:
      "A chess grandmaster becomes entangled in a dangerous game of psychological manipulation.",
    genre: "thriller",
    type: "series",
    year: 2024,
    rating: 8.8,
    duration: "6 Episodes",
    posterUrl: generatePoster("mindgames", "#37474f"),
    backdropUrl: generateBackdrop("mindgames"),
    cast: ["Anya Taylor-Joy", "Mads Mikkelsen", "Cillian Murphy"],
    matchPercentage: 90,
  },

  // Documentary
  {
    id: "17",
    title: "Beyond the Ice",
    description:
      "An unprecedented look at life in Antarctica and the scientists who call it home.",
    genre: "documentary",
    type: "documentary",
    year: 2024,
    rating: 9.2,
    duration: "3 Parts",
    posterUrl: generatePoster("ice", "#81d4fa"),
    backdropUrl: generateBackdrop("ice"),
    cast: ["David Attenborough"],
    matchPercentage: 78,
  },
  {
    id: "18",
    title: "The Startup Wars",
    description:
      "Inside the cutthroat world of Silicon Valley venture capital and the founders who risk it all.",
    genre: "documentary",
    type: "documentary",
    year: 2024,
    rating: 8.3,
    duration: "4 Parts",
    posterUrl: generatePoster("startup", "#4caf50"),
    backdropUrl: generateBackdrop("startup"),
    cast: [],
    matchPercentage: 81,
  },

  // Animation
  {
    id: "19",
    title: "The Spirit Garden",
    description:
      "A young girl discovers a hidden world where nature spirits battle against encroaching darkness.",
    genre: "animation",
    type: "movie",
    year: 2024,
    rating: 8.9,
    duration: "1h 48m",
    posterUrl: generatePoster("spirit", "#8bc34a"),
    backdropUrl: generateBackdrop("spirit"),
    cast: ["Hailee Steinfeld", "Sandra Oh", "Steven Yeun"],
    director: "Hayao Miyazaki",
    matchPercentage: 95,
  },
  {
    id: "20",
    title: "Neon Knights",
    description:
      "In a cyberpunk future, a group of young heroes must save their city from corporate tyranny.",
    genre: "animation",
    type: "series",
    year: 2024,
    rating: 8.6,
    duration: "12 Episodes",
    posterUrl: generatePoster("neon", "#9c27b0"),
    backdropUrl: generateBackdrop("neon"),
    cast: ["Zendaya", "LaKeith Stanfield", "Maitreyi Ramakrishnan"],
    matchPercentage: 89,
  },

  // Fantasy
  {
    id: "21",
    title: "The Dragon's Covenant",
    description:
      "An epic fantasy saga where humans and dragons must unite against an ancient evil.",
    genre: "fantasy",
    type: "series",
    year: 2024,
    rating: 9.0,
    duration: "10 Episodes",
    posterUrl: generatePoster("dragon", "#673ab7"),
    backdropUrl: generateBackdrop("dragon"),
    cast: ["Henry Cavill", "Emilia Clarke", "John Boyega"],
    matchPercentage: 97,
  },
  {
    id: "22",
    title: "The Witch's Grimoire",
    description:
      "A young witch inherits a powerful spellbook that could change the balance of magical power forever.",
    genre: "fantasy",
    type: "movie",
    year: 2024,
    rating: 8.4,
    duration: "2h 25m",
    posterUrl: generatePoster("witch", "#512da8"),
    backdropUrl: generateBackdrop("witch"),
    cast: ["Saoirse Ronan", "Robert Pattinson", "Tilda Swinton"],
    director: "Guillermo del Toro",
    matchPercentage: 92,
  },
];

export const mockWatchHistory: WatchProgress[] = [
  {
    content: mockContentDatabase[3]!, // Stellar Horizons
    progress: 65,
    lastWatched: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    episode: "S1E7",
  },
  {
    content: mockContentDatabase[15]!, // Mind Games
    progress: 30,
    lastWatched: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    episode: "S1E2",
  },
  {
    content: mockContentDatabase[6]!, // Echoes of Tomorrow
    progress: 85,
    lastWatched: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    episode: "S1E10",
  },
  {
    content: mockContentDatabase[0]!, // Velocity Protocol
    progress: 45,
    lastWatched: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
  },
];

export const mockUserProfile: UserProfile = {
  id: "user-1",
  name: "Alex",
  avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
  preferences: {
    favoriteGenres: ["sci-fi", "thriller", "drama"],
    preferredContentTypes: ["movie", "series"],
    maturityRating: "R",
    autoplayEnabled: true,
    notificationsEnabled: true,
  },
  memberSince: "2021-03-15",
  watchlistCount: 47,
};

// Helper functions to query mock data
export function getContentByGenre(genre: Genre): Content[] {
  return mockContentDatabase.filter((c) => c.genre === genre);
}

export function getContentById(id: string): Content | undefined {
  return mockContentDatabase.find((c) => c.id === id);
}

export function searchContent(query: string): Content[] {
  const lowerQuery = query.toLowerCase();
  return mockContentDatabase.filter(
    (c) =>
      c.title.toLowerCase().includes(lowerQuery) ||
      c.description.toLowerCase().includes(lowerQuery) ||
      c.cast.some((actor) => actor.toLowerCase().includes(lowerQuery)) ||
      c.director?.toLowerCase().includes(lowerQuery)
  );
}

export function getTrendingContent(): Content[] {
  return [...mockContentDatabase]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 8);
}

export function getRecommendationsForGenres(genres: Genre[]): Content[] {
  return mockContentDatabase
    .filter((c) => genres.includes(c.genre))
    .sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0))
    .slice(0, 10);
}

export function getFeaturedContent(): Content {
  // Return a highly-rated recent content as featured
  const featured = mockContentDatabase
    .filter((c) => c.rating >= 8.5)
    .sort(() => Math.random() - 0.5)[0];
  return featured || mockContentDatabase[0]!;
}

