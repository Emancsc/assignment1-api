import axios from 'axios';

const API_KEY ='1b4a2ac95b6319ca743e3be72f8948d8';
const BASE = 'https://v3.football.api-sports.io';

const client = axios.create({
    baseURL: BASE,
    timeout: 10000,
    headers: {
        'x-apisports-key': API_KEY || ''
    }
});

// helper to shuffle array
function shuffle(a) {
    const arr = [...a];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Get current football season
function getCurrentSeason() {
    const now = new Date();
    const year = now.getFullYear();
    // Football season typically starts in August
    return now.getMonth() >= 7 ? year : year - 1;
}

// Enhanced fallback questions
const FALLBACK = [
    {
        question: 'Which club won the UEFA Champions League in 2021?',
        choices: ['Chelsea', 'Manchester City', 'Real Madrid', 'Bayern Munich'],
        answer: 0,
        category: 'Leagues'
    },
    {
        question: 'Which player scored the most goals in LaLiga 2020-21?',
        choices: ['Karim Benzema', 'Lionel Messi', 'Luis Suárez', 'Gerard Moreno'],
        answer: 1,
        category: 'Players'
    },
    {
        question: 'Which country does the Premier League belong to?',
        choices: ['Spain', 'England', 'Germany', 'Italy'],
        answer: 1,
        category: 'Leagues'
    },
    {
        question: 'Which team is based in London?',
        choices: ['Manchester United', 'Liverpool', 'Arsenal', 'Barcelona'],
        answer: 2,
        category: 'Teams'
    },
    {
        question: 'Which league is Real Madrid in?',
        choices: ['Premier League', 'Serie A', 'La Liga', 'Bundesliga'],
        answer: 2,
        category: 'Teams'
    }
];

export async function getQuestions({ category = 'Teams', amount = 10 } = {}) {
    if (!API_KEY) {
        console.warn('API key missing, using fallback questions');
        return shuffle(FALLBACK).slice(0, Math.min(amount, FALLBACK.length));
    }

    try {
        const season = getCurrentSeason();

        // ===== Teams =====
        if (category === 'Teams') {
            // Fetch Premier League teams and other league teams
            const [plRes, laLigaRes, serieARes] = await Promise.all([
                client.get('/teams', { params: { league: 39, season } }), // Premier League
                client.get('/teams', { params: { league: 140, season } }), // La Liga
                client.get('/teams', { params: { league: 135, season } })  // Serie A
            ]);

            const plTeams = plRes.data?.response?.map(r => ({ name: r.team?.name, league: 'Premier League' })).filter(t => t.name) || [];
            const laLigaTeams = laLigaRes.data?.response?.map(r => ({ name: r.team?.name, league: 'La Liga' })).filter(t => t.name) || [];
            const serieATeams = serieARes.data?.response?.map(r => ({ name: r.team?.name, league: 'Serie A' })).filter(t => t.name) || [];

            if (plTeams.length >= 4 && laLigaTeams.length >= 3 && serieATeams.length >= 3) {
                const questions = [];
                const usedTeams = new Set();
                let attempts = 0;
                const maxAttempts = amount * 10; // Prevent infinite loop

                while (questions.length < amount && attempts < maxAttempts) {
                    attempts++;

                    // "Which team plays in [League]?"
                    const targetLeague = ['Premier League', 'La Liga', 'Serie A'][Math.floor(Math.random() * 3)];
                    let correctTeam, wrongTeams;

                    if (targetLeague === 'Premier League') {
                        correctTeam = plTeams[Math.floor(Math.random() * plTeams.length)];
                        wrongTeams = shuffle([...laLigaTeams, ...serieATeams]).slice(0, 3);
                    } else if (targetLeague === 'La Liga') {
                        correctTeam = laLigaTeams[Math.floor(Math.random() * laLigaTeams.length)];
                        wrongTeams = shuffle([...plTeams, ...serieATeams]).slice(0, 3);
                    } else {
                        correctTeam = serieATeams[Math.floor(Math.random() * serieATeams.length)];
                        wrongTeams = shuffle([...plTeams, ...laLigaTeams]).slice(0, 3);
                    }

                    const key = `${targetLeague}-${correctTeam.name}`;
                    if (usedTeams.has(key)) continue;
                    usedTeams.add(key);

                    const choices = shuffle([correctTeam.name, ...wrongTeams.map(t => t.name)]);
                    const correctIndex = choices.indexOf(correctTeam.name);

                    questions.push({
                        question: `Which team plays in the ${targetLeague}?`,
                        choices,
                        answer: correctIndex,
                        category: 'Teams'
                    });
                }
                return questions;
            }
        }

        // ===== Leagues =====
        if (category === 'Leagues') {
            const res = await client.get('/leagues');
            const allLeagues = res.data?.response || [];

            // Group by country
            const leaguesByCountry = {};
            allLeagues.forEach(r => {
                const league = r.league?.name;
                const country = r.country?.name;
                if (league && country) {
                    if (!leaguesByCountry[country]) leaguesByCountry[country] = [];
                    leaguesByCountry[country].push(league);
                }
            });

            const countries = Object.keys(leaguesByCountry);
            if (countries.length >= 4) {
                const questions = [];
                const usedCombos = new Set();

                while (questions.length < amount) {
                    const targetCountry = countries[Math.floor(Math.random() * countries.length)];
                    const correctLeague = leaguesByCountry[targetCountry][0];

                    // Get 3 wrong leagues from different countries
                    const wrongLeagues = [];
                    for (const country of shuffle(countries)) {
                        if (country !== targetCountry && leaguesByCountry[country][0]) {
                            wrongLeagues.push(leaguesByCountry[country][0]);
                            if (wrongLeagues.length === 3) break;
                        }
                    }

                    if (wrongLeagues.length < 3) continue;

                    const key = `${targetCountry}-${correctLeague}`;
                    if (usedCombos.has(key)) continue;
                    usedCombos.add(key);

                    const choices = shuffle([correctLeague, ...wrongLeagues]);
                    const correctIndex = choices.indexOf(correctLeague);

                    questions.push({
                        question: `Which league is from ${targetCountry}?`,
                        choices,
                        answer: correctIndex,
                        category: 'Leagues'
                    });
                }
                return questions;
            }
        }

        // ===== Players =====
        if (category === 'Players') {
            const res = await client.get('/players/topscorers', { params: { league: 39, season } });
            const players = res.data?.response || [];

            if (players.length >= 4) {
                const questions = [];
                const usedPlayers = new Set();

                while (questions.length < amount && usedPlayers.size < players.length) {
                    const player = players[Math.floor(Math.random() * players.length)];
                    const name = player.player?.name;
                    const goals = player.statistics?.[0]?.goals?.total;

                    if (!name || !goals || usedPlayers.has(name)) continue;
                    usedPlayers.add(name);

                    // Generate plausible wrong answers
                    const wrongGoals = [
                        Math.max(1, goals - 5),
                        Math.max(1, goals - 3),
                        goals + 3
                    ].filter(g => g !== goals);

                    const choices = shuffle([goals, ...wrongGoals.slice(0, 3)]);
                    const correctIndex = choices.indexOf(goals);

                    questions.push({
                        question: `How many goals did ${name} score in the ${season} Premier League season?`,
                        choices: choices.map(String),
                        answer: correctIndex,
                        category: 'Players'
                    });
                }
                return questions;
            }
        }

    } catch (err) {
        console.warn('API fetch failed, falling back to local questions:', err?.message);
    }

    // fallback
    return shuffle(FALLBACK).slice(0, Math.min(amount, FALLBACK.length));
}