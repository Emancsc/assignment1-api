import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LEAGUES, LEAGUE_IDS, getMatchesByFilters, getMatchesForMultipleLeagues } from "../services/footballAPI.js";
import { ALLOWED_SEASONS } from "../utils/constants.js";
import "../App.css";

export default function SearchPage() {
    const navigate = useNavigate();

    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [seasonInput, setSeasonInput] = useState("");
    const [leagueInput, setLeagueInput] = useState("");
    const [teamInput, setTeamInput] = useState("");
    const [selectedMatch, setSelectedMatch] = useState(null);

    const handleSearch = async () => {
        if (!seasonInput) {
            setError("Please select a season before searching");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const season = parseInt(seasonInput);
            const from = `${season}-01-01`;
            const to = `${season}-12-31`;
            let results = [];

            if (leagueInput) {
                const leagueId = parseInt(leagueInput);
                console.log(`Searching: Season ${season}, League ${LEAGUES[leagueId]}, Team: ${teamInput || "All"}`);
                results = await getMatchesByFilters({
                    season,
                    leagueId,
                    teamName: teamInput,
                    from,
                    to
                });
            } else {
                console.log(`Searching: Season ${season}, All Leagues, Team: ${teamInput || "All"}`);
                results = await getMatchesForMultipleLeagues(LEAGUE_IDS, season, from, to);

                if (teamInput) {
                    const teamLower = teamInput.toLowerCase();
                    results = results.filter(m =>
                        m.teams.home.name.toLowerCase().includes(teamLower) ||
                        m.teams.away.name.toLowerCase().includes(teamLower)
                    );
                }
            }

            setMatches(results);
            console.log(`Found ${results.length} matches`);
        } catch (err) {
            console.error("Search error:", err);
            setError("Failed to fetch matches. Please check your API key and try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setSeasonInput("");
        setLeagueInput("");
        setTeamInput("");
        setMatches([]);
        setError(null);
        setSelectedMatch(null);
    };

    const handleCardClick = (match) => {
        setSelectedMatch(match);
    };

    const closeModal = () => setSelectedMatch(null);

    // Navigate to team page
    const handleTeamClick = (team, season) => {
        navigate(`/team/${team.id}`, {
            state: {
                team: {
                    id: team.id,
                    name: team.name,
                    logo: team.logo,
                    season: season
                }
            }
        });
    };

    return (
        <div className="app-container">
            <style>{`
                .app-container {
                    font-family: 'Inter', sans-serif;
                }
                
                .header .title {
                    font-family: 'Bebas Neue', sans-serif;
                    color: #ffd700;
                    text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.4);
                    letter-spacing: 2px;
                }
                
                .header .subtitle {
                    color: #e8f5e9;
                }
                
                .filters-card {
                    border: 2px solid #2d7a63;
                }
                
                .filter-label {
                    color: #0a4d3c;
                }
                
                .filter-select:focus,
                .filter-input:focus {
                    border-color: #1a5f4f;
                    box-shadow: 0 0 0 3px rgba(26, 95, 79, 0.15);
                }
                
                .btn-primary {
                    background: linear-gradient(135deg, #1a5f4f 0%, #2d7a63 100%);
                    color: #ffd700;
                    border: 2px solid #ffd700;
                }
                
                .btn-primary:hover:not(:disabled) {
                    background: linear-gradient(135deg, #0a4d3c 0%, #1a5f4f 100%);
                    box-shadow: 0 6px 16px rgba(255, 215, 0, 0.5);
                }
                
                .loading-container {
                    border: 2px solid #2d7a63;
                }
                
                .spinner {
                    border-top-color: #1a5f4f;
                }
                
                .loading-text {
                    color: #0a4d3c;
                }
                
                .results-header {
                    border-left: 4px solid #ffd700;
                }
                
                .results-header h2 {
                    color: #0a4d3c;
                    font-family: 'Bebas Neue', sans-serif;
                    letter-spacing: 1px;
                }
                
                .match-item {
                    border: 2px solid #e5e7eb;
                }
                
                .match-item:hover {
                    border-color: #2d7a63;
                    box-shadow: 0 8px 20px rgba(26, 95, 79, 0.25);
                }
                
                .match-item.clickable:hover {
                    border-color: #ffd700;
                    box-shadow: 0 8px 20px rgba(26, 95, 79, 0.3);
                }
                
                .league-logo {
                    border: 2px solid #e5e7eb;
                    border-radius: 50%;
                }
                
                .league-name {
                    color: #1a5f4f;
                }
                
                .match-date {
                    color: #6b7280;
                }
                
                .team-logo {
                    border: 2px solid #e5e7eb;
                    border-radius: 8px;
                    padding: 4px;
                }
                
                .team-name {
                    color: #0a4d3c;
                }
                
                .score-number {
                    color: #0a4d3c;
                    font-family: 'Bebas Neue', sans-serif;
                }
                
                .score-separator {
                    color: #ffd700;
                }
                
                .match-status {
                    color: #1a5f4f;
                    background: #e8f5e9;
                    border: 1px solid #2d7a63;
                }
                
                .no-results,
                .initial-state {
                    border: 2px solid #2d7a63;
                }
                
                .no-results h3,
                .initial-state h3 {
                    color: #0a4d3c;
                    font-family: 'Bebas Neue', sans-serif;
                    letter-spacing: 1px;
                }
                
                .modal-overlay {
                    background: rgba(10, 77, 60, 0.75);
                }
                
                .modal-card {
                    border: 3px solid #ffd700;
                }
                
                .modal-close {
                    color: #0a4d3c;
                }
                
                .modal-close:hover {
                    color: #ffd700;
                    transform: scale(1.2);
                }
                
                .modal-league {
                    border-bottom: 2px solid #e8f5e9;
                }
                
                .modal-league-logo {
                    border: 2px solid #2d7a63;
                    border-radius: 50%;
                }
                
                .modal-league h3 {
                    color: #0a4d3c;
                    font-family: 'Bebas Neue', sans-serif;
                }
                
                .modal-team img {
                    border: 2px solid #e5e7eb;
                    border-radius: 8px;
                    padding: 4px;
                }
                
                .modal-team h4 {
                    color: #0a4d3c;
                    font-weight: 700;
                }
                
                .modal-goals {
                    color: #1a5f4f;
                }
                
                .modal-score {
                    color: #0a4d3c;
                    font-family: 'Bebas Neue', sans-serif;
                }
                
                .modal-status {
                    color: #1a5f4f;
                }
                
                .modal-datetime,
                .modal-venue,
                .modal-referee {
                    color: #6b7280;
                }
                
                .modal-extra {
                    border-top: 2px solid #e8f5e9;
                }
                
                .modal-extra h4 {
                    color: #0a4d3c;
                    font-family: 'Bebas Neue', sans-serif;
                    letter-spacing: 1px;
                }
                
                .team-details-btn {
                    background: linear-gradient(135deg, #1a5f4f 0%, #2d7a63 100%);
                    color: #ffd700;
                    border: 2px solid #ffd700;
                }
                
                .team-details-btn:hover {
                    background: linear-gradient(135deg, #0a4d3c 0%, #1a5f4f 100%);
                    box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
                }
            `}</style>

            <div className="container">
                <header className="header">
                    <h1 className="title">⚽ Football Match Finder</h1>
                    <p className="subtitle">Search matches from top leagues worldwide</p>
                </header>

                <div className="filters-card">
                    <div className="filters-grid">
                        <div className="filter-group">
                            <label className="filter-label">
                                Season <span className="required">*</span>
                            </label>
                            <select
                                className="filter-select"
                                value={seasonInput}
                                onChange={(e) => setSeasonInput(e.target.value)}
                            >
                                <option value="">Select Season</option>
                                {ALLOWED_SEASONS.map((y) => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-group">
                            <label className="filter-label">League</label>
                            <select
                                className="filter-select"
                                value={leagueInput}
                                onChange={(e) => setLeagueInput(e.target.value)}
                            >
                                <option value="">All Leagues</option>
                                {Object.entries(LEAGUES).map(([id, name]) => (
                                    <option key={id} value={id}>{name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-group">
                            <label className="filter-label">Team</label>
                            <input
                                type="text"
                                className="filter-input"
                                placeholder="Search team name..."
                                value={teamInput}
                                onChange={(e) => setTeamInput(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="button-group">
                        <button
                            className="btn btn-primary"
                            onClick={handleSearch}
                            disabled={loading}
                        >
                            {loading ? "🔄 Searching..." : "🔍 Search Matches"}
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={handleReset}
                            disabled={loading}
                        >
                            🔄 Reset
                        </button>
                    </div>

                    <p className="helper-text">
                        💡 Select a season (required), then optionally filter by league and/or team
                    </p>
                </div>

                {error && (
                    <div className="error-message">
                        <strong>❌ Error:</strong> {error}
                    </div>
                )}

                {loading && (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p className="loading-text">
                            Loading matches from {leagueInput ? LEAGUES[leagueInput] : "all leagues"}...
                        </p>
                        <p className="loading-subtext">This may take a few seconds</p>
                    </div>
                )}

                {!loading && matches.length > 0 && (
                    <>
                        <div className="results-header">
                            <h2>📊 Results: {matches.length} matches found</h2>
                        </div>

                        <ul className="match-list">
                            {matches.map((m) => {
                                const isLive = m.fixture.status.short === "LIVE";
                                const matchDate = new Date(m.fixture.date);

                                return (
                                    <li
                                        key={m.fixture.id}
                                        className={`match-item ${isLive ? "live" : ""} clickable`}
                                        onClick={() => handleCardClick(m)}
                                    >
                                        {isLive && <div className="live-badge">🔴 LIVE</div>}

                                        <div className="match-header">
                                            <div className="league-info">
                                                <img src={m.league.logo} alt={m.league.name} className="league-logo" />
                                                <span className="league-name">{m.league.name}</span>
                                            </div>
                                            <span className="match-date">
                                                {matchDate.toLocaleDateString()} • {matchDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </span>
                                        </div>

                                        <div className="match-content">
                                            <div className="team home-team">
                                                <img src={m.teams.home.logo} alt={m.teams.home.name} className="team-logo" />
                                                <span className="team-name">{m.teams.home.name}</span>
                                            </div>

                                            <div className="score-section">
                                                <div className="score">
                                                    <span className="score-number">{m.goals.home}</span>
                                                    <span className="score-separator">-</span>
                                                    <span className="score-number">{m.goals.away}</span>
                                                </div>
                                                <span className="match-status">{m.fixture.status.long}</span>
                                            </div>

                                            <div className="team away-team">
                                                <span className="team-name">{m.teams.away.name}</span>
                                                <img src={m.teams.away.logo} alt={m.teams.away.name} className="team-logo" />
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </>
                )}

                {!loading && matches.length === 0 && !error && seasonInput && (
                    <div className="no-results">
                        <div className="no-results-icon">😕</div>
                        <h3>No matches found</h3>
                        <p>Try adjusting your search filters</p>
                    </div>
                )}

                {!loading && matches.length === 0 && !error && !seasonInput && (
                    <div className="initial-state">
                        <div className="initial-icon">⚽</div>
                        <h3>Ready to search!</h3>
                        <p>Select a season and click "Search Matches" to get started</p>
                    </div>
                )}
            </div>

            {selectedMatch && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={closeModal}>✖</button>

                        <div className="modal-league">
                            <img src={selectedMatch.league.logo} alt={selectedMatch.league.name} className="modal-league-logo" />
                            <h3>{selectedMatch.league.name} — Match Details</h3>
                        </div>

                        <div className="modal-main">
                            <div
                                className="modal-team clickable-team"
                                onClick={() => handleTeamClick(selectedMatch.teams.home, selectedMatch.league.season)}
                            >
                                <img src={selectedMatch.teams.home.logo} alt={selectedMatch.teams.home.name} />
                                <h4>{selectedMatch.teams.home.name}</h4>
                                <p className="modal-goals">{selectedMatch.goals.home}</p>
                                <button className="team-details-btn">View Team →</button>
                            </div>

                            <div className="modal-vs">
                                <p className="modal-score">{selectedMatch.goals.home} - {selectedMatch.goals.away}</p>
                                <p className="modal-status">{selectedMatch.fixture.status.long}</p>
                                <p className="modal-datetime">{new Date(selectedMatch.fixture.date).toLocaleString()}</p>
                                <p className="modal-venue"><strong>Venue:</strong> {selectedMatch.fixture.venue ? selectedMatch.fixture.venue.name : "N/A"}</p>
                                <p className="modal-referee"><strong>Referee:</strong> {selectedMatch.fixture.referee || "N/A"}</p>
                            </div>

                            <div
                                className="modal-team clickable-team"
                                onClick={() => handleTeamClick(selectedMatch.teams.away, selectedMatch.league.season)}
                            >
                                <img src={selectedMatch.teams.away.logo} alt={selectedMatch.teams.away.name} />
                                <h4>{selectedMatch.teams.away.name}</h4>
                                <p className="modal-goals">{selectedMatch.goals.away}</p>
                                <button className="team-details-btn">View Team →</button>
                            </div>
                        </div>

                        <div className="modal-extra">
                            <h4>Extra Info</h4>
                            <ul>
                                <li><strong>Fixture ID:</strong> {selectedMatch.fixture.id}</li>
                                <li><strong>Round:</strong> {selectedMatch.league.round || "N/A"}</li>
                                <li><strong>Season:</strong> {selectedMatch.league.season}</li>
                                <li><strong>Venue City:</strong> {selectedMatch.fixture.venue ? selectedMatch.fixture.venue.city || "N/A" : "N/A"}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}