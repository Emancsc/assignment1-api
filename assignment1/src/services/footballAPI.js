import axios from "axios";


const API_KEY = import.meta.env.VITE_FOOTBALL_API_KEY;
const BASE_URL = "https://v3.football.api-sports.io/";

const footballAPI = axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
    headers: {
        "x-apisports-key": API_KEY,
    },
});

// League IDs with names for easy reference
export const LEAGUES = {
    39: "Premier League",
    140: "La Liga",
    135: "Serie A",
    78: "Bundesliga",
    61: "Ligue 1",
    586: "West Bank Premier League",
    2: "UEFA Champions League"
};

// Get all league IDs as array
export const LEAGUE_IDS = Object.keys(LEAGUES).map(id => parseInt(id));

/**
 * Fetch matches based on filters
 * @param {Object} filters - { season, leagueId, teamName, from, to }
 */
export const getMatchesByFilters = async (filters = {}) => {
    try {
        const { season, leagueId, teamName } = filters;

        // Build params dynamically
        const params = {};

        if (season) params.season = season;
        if (leagueId) params.league = leagueId;
        // if (from) params.from = from;
        // if (to) params.to = to;

        // If team name is provided, we need to search by team
        // Note: API-Football doesn't filter by team name directly in fixtures endpoint
        // So we'll filter client-side after fetching

        const res = await footballAPI.get("/fixtures", { params });

        let matches = res.data.response || [];

        // Client-side filter by team name if provided
        if (teamName) {
            const teamLower = teamName.toLowerCase();
            matches = matches.filter(m =>
                m.teams.home.name.toLowerCase().includes(teamLower) ||
                m.teams.away.name.toLowerCase().includes(teamLower)
            );
        }

        return matches;

    } catch (err) {
        console.error("Error fetching matches:", err.message);
        if (err.response) {
            console.error("API Error:", err.response.data);
        }
        throw err;
    }
};

/**
 * Fetch all matches for multiple leagues
 * @param {Array} leagueIds - Array of league IDs
 * @param {Number} season - Year
 * @param {String} from - Start date YYYY-MM-DD
 * @param {String} to - End date YYYY-MM-DD
 */
export const getMatchesForMultipleLeagues = async (leagueIds, season, from, to) => {
    try {
        let allMatches = [];

        // Fetch matches for each league
        for (let leagueId of leagueIds) {
            console.log(`Fetching league ${leagueId} (${LEAGUES[leagueId]})...`);

            const matches = await getMatchesByFilters({
                season,
                leagueId,
                from,
                to
            });

            allMatches = allMatches.concat(matches);

            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        // Sort by date (most recent first)
        allMatches.sort((a, b) => new Date(b.fixture.date) - new Date(a.fixture.date));

        return allMatches;

    } catch (err) {
        console.error("Error fetching multiple leagues:", err.message);
        throw err;
    }
};

/**
 * Get live matches
 */
export const getLiveMatches = async () => {
    try {
        const res = await footballAPI.get("/fixtures", {
            params: { live: "all" }
        });
        return res.data.response || [];
    } catch (err) {
        console.error("Error fetching live matches:", err.message);
        return [];
    }
};

export default footballAPI;