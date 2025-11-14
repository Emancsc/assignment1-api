// API Configuration
export const API_KEY = import.meta.env.VITE_FOOTBALL_API_KEY;
export const WIDGET_BASE_URL = "https://widgets.api-sports.io/football";

// League IDs
export const LEAGUES = {
    39: "Premier League",
    140: "La Liga",
    135: "Serie A",
    78: "Bundesliga",
    61: "Ligue 1",
    586: "West Bank Premier League",
    2: "UEFA Champions League"
};

export const LEAGUE_IDS = Object.keys(LEAGUES).map(id => parseInt(id));

// Allowed Seasons (for free tier)
export const ALLOWED_SEASONS = [2021, 2022, 2023];

// Widget Types
export const WIDGET_TYPES = {
    TEAM_STATS: 'statistics',
    TEAM_SQUAD: 'squads',
    TEAM_VENUE: 'venue',
};


// Widget Themes
export const WIDGET_THEMES = {
    LIGHT: 'white',
    DARK: 'dark'
};

// Routes
export const ROUTES = {
    HOME: '/',
    SEARCH: '/search',
    TEAM: '/team/:teamId',
    COMPARE: '/compare',
    FAVORITES: '/favorites'
};

// LocalStorage Keys
export const STORAGE_KEYS = {
    FAVORITES: 'fanzone_favorites',
    RECENT_SEARCHES: 'fanzone_recent_searches'
};