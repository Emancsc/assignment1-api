import React, { useEffect, useState } from 'react';
import { getLiveMatches } from '../services/footballAPI';
import '../App.css';

export default function HomePage({ pollInterval = 30000 }) {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    const fetchLive = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getLiveMatches();
            setMatches(res || []);
            setLastUpdated(new Date());
        } catch (err) {
            setError(err.message || 'Failed to fetch live matches');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLive();
        const id = setInterval(fetchLive, pollInterval);
        return () => clearInterval(id);
    }, [pollInterval]);

    return (
        <div className="app-container">
            <header className="home-header">
                <h1 className="title">Live Matches</h1>
                <div className="helper-text">
                    {lastUpdated ? `Last updated: ${lastUpdated.toLocaleString()}` : 'Not updated yet'}
                </div>
            </header>

            <div className="button-group">
                <button className="btn btn-primary" onClick={fetchLive}>Refresh</button>
            </div>

            {loading && (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <div className="loading-text">Loading live matches...</div>
                </div>
            )}

            {error && <div className="error-message"><strong>Error:</strong> {error}</div>}

            {!loading && matches.length === 0 && (
                <div className="no-results">
                    <div className="no-results-icon">⚽</div>
                    <h3>No live matches right now.</h3>
                </div>
            )}

            <ul className="match-list">
                {matches.map((m) => {
                    const fixture = m.fixture || {};
                    const league = m.league || {};
                    const teams = m.teams || {};
                    const goals = m.goals || { home: null, away: null };
                    const status = fixture.status || {};

                    return (
                        <li key={fixture.id || Math.random()} className={`match-item clickable ${status.short === 'LIVE' ? 'live' : ''}`}>
                            <div className="match-header">
                                <div className="league-info">
                                    {league.logo && <img src={league.logo} alt={league.name} className="league-logo" />}
                                    <span className="league-name">{league.name}</span>
                                </div>
                                <span className="match-date">{new Date(fixture.date).toLocaleString()}</span>
                            </div>

                            <div className="match-content">
                                <div className="team home-team">
                                    {teams.home?.logo && <img src={teams.home.logo} alt={teams.home.name} className="team-logo" />}
                                    <span className="team-name">{teams.home?.name}</span>
                                </div>

                                <div className="score-section">
                                    <div className="score">
                                        <span className="score-number">{goals.home ?? '-'}</span>
                                        <span className="score-separator">-</span>
                                        <span className="score-number">{goals.away ?? '-'}</span>
                                    </div>
                                    {status.long && <div className="match-status">{status.long}</div>}
                                </div>

                                <div className="team away-team">
                                    {teams.away?.logo && <img src={teams.away.logo} alt={teams.away.name} className="team-logo" />}
                                    <span className="team-name">{teams.away?.name}</span>
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
