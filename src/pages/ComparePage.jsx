import React, { useState } from 'react';
import TeamWidget from '../components/TeamWidget.jsx';
import { WIDGET_TYPES, ALLOWED_SEASONS } from '../utils/constants.js';
import './ComparePage.css';

export default function ComparePage() {
    const [team1Id, setTeam1Id] = useState('');
    const [team2Id, setTeam2Id] = useState('');
    const [season, setSeason] = useState('2023');
    const [activeTab, setActiveTab] = useState(WIDGET_TYPES.TEAM_STATS);
    const [showComparison, setShowComparison] = useState(false);

    // Famous teams for quick selection
    const famousTeams = [
        { id: 529, name: 'Barcelona', logo: 'https://media.api-sports.io/football/teams/529.png' },
        { id: 541, name: 'Real Madrid', logo: 'https://media.api-sports.io/football/teams/541.png' },
        { id: 42, name: 'Arsenal', logo: 'https://media.api-sports.io/football/teams/42.png' },
        { id: 50, name: 'Manchester City', logo: 'https://media.api-sports.io/football/teams/50.png' },
        { id: 33, name: 'Manchester United', logo: 'https://media.api-sports.io/football/teams/33.png' },
        { id: 49, name: 'Chelsea', logo: 'https://media.api-sports.io/football/teams/49.png' },
        { id: 40, name: 'Liverpool', logo: 'https://media.api-sports.io/football/teams/40.png' },
        { id: 85, name: 'Paris Saint Germain', logo: 'https://media.api-sports.io/football/teams/85.png' },
        { id: 489, name: 'AC Milan', logo: 'https://media.api-sports.io/football/teams/489.png' },
        { id: 487, name: 'Inter Milan', logo: 'https://media.api-sports.io/football/teams/487.png' },
        { id: 497, name: 'Juventus', logo: 'https://media.api-sports.io/football/teams/497.png' },
        { id: 157, name: 'Bayern Munich', logo: 'https://media.api-sports.io/football/teams/157.png' },
    ];

    const handleCompare = () => {
        if (!team1Id || !team2Id) {
            alert('Please select both teams');
            return;
        }
        if (team1Id === team2Id) {
            alert('Please select different teams');
            return;
        }
        setShowComparison(true);
    };

    const handleReset = () => {
        setTeam1Id('');
        setTeam2Id('');
        setShowComparison(false);
    };

    const getTeamName = (id) => {
        const team = famousTeams.find(t => t.id === parseInt(id));
        return team ? team.name : `Team ${id}`;
    };

    return (
        <div className="compare-page">
            <div className="compare-container">
                {/* Header */}
                <div className="compare-header">
                    <h1 className="compare-title">⚔️ Head-to-Head Comparison</h1>
                    <p className="compare-subtitle">Compare statistics between two teams</p>
                </div>

                {/* Selection Panel */}
                <div className="selection-panel">
                    <div className="team-selector">
                        <h3>🏠 Team 1</h3>
                        <div className="team-input-group">
                            <input
                                type="number"
                                placeholder="Enter Team ID"
                                value={team1Id}
                                onChange={(e) => setTeam1Id(e.target.value)}
                                className="team-id-input"
                            />
                        </div>
                        <div className="quick-select">
                            <p className="quick-label">Quick Select:</p>
                            <div className="team-buttons">
                                {famousTeams.map(team => (
                                    <button
                                        key={team.id}
                                        className={`team-btn ${team1Id === String(team.id) ? 'selected' : ''}`}
                                        onClick={() => setTeam1Id(String(team.id))}
                                        title={team.name}
                                    >
                                        <img src={team.logo} alt={team.name} />
                                        <span>{team.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="vs-divider">
                        <div className="vs-circle">VS</div>
                    </div>

                    <div className="team-selector">
                        <h3>✈️ Team 2</h3>
                        <div className="team-input-group">
                            <input
                                type="number"
                                placeholder="Enter Team ID"
                                value={team2Id}
                                onChange={(e) => setTeam2Id(e.target.value)}
                                className="team-id-input"
                            />
                        </div>
                        <div className="quick-select">
                            <p className="quick-label">Quick Select:</p>
                            <div className="team-buttons">
                                {famousTeams.map(team => (
                                    <button
                                        key={team.id}
                                        className={`team-btn ${team2Id === String(team.id) ? 'selected' : ''}`}
                                        onClick={() => setTeam2Id(String(team.id))}
                                        title={team.name}
                                    >
                                        <img src={team.logo} alt={team.name} />
                                        <span>{team.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Season Selection */}
                <div className="season-selection">
                    <label className="season-label">Season:</label>
                    <select
                        value={season}
                        onChange={(e) => setSeason(e.target.value)}
                        className="season-select"
                    >
                        {ALLOWED_SEASONS.map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </div>

                {/* Action Buttons */}
                <div className="compare-actions">
                    <button
                        className="btn btn-primary btn-large"
                        onClick={handleCompare}
                    >
                        ⚔️ Compare Teams
                    </button>
                    <button
                        className="btn btn-secondary btn-large"
                        onClick={handleReset}
                    >
                        🔄 Reset
                    </button>
                </div>

                {/* Comparison Results */}
                {showComparison && (
                    <>
                        {/* Info Banner */}
                        <div className="comparison-banner">
                            <h2>
                                {getTeamName(team1Id)} 🆚 {getTeamName(team2Id)}
                            </h2>
                            <p>Season: {season}</p>
                        </div>

                        {/* Tabs */}
                        <div className="comparison-tabs">
                            <button
                                className={`tab-btn ${activeTab === WIDGET_TYPES.TEAM_STATS ? 'active' : ''}`}
                                onClick={() => setActiveTab(WIDGET_TYPES.TEAM_STATS)}
                            >
                                📊 Statistics
                            </button>
                            <button
                                className={`tab-btn ${activeTab === WIDGET_TYPES.TEAM_SQUAD ? 'active' : ''}`}
                                onClick={() => setActiveTab(WIDGET_TYPES.TEAM_SQUAD)}
                            >
                                👥 Squad
                            </button>
                            <button
                                className={`tab-btn ${activeTab === WIDGET_TYPES.TEAM_VENUE ? 'active' : ''}`}
                                onClick={() => setActiveTab(WIDGET_TYPES.TEAM_VENUE)}
                            >
                                🏟️ Stadium
                            </button>
                        </div>

                        {/* Side-by-Side Widgets */}
                        <div className="comparison-grid">
                            <div className="comparison-column">
                                <div className="column-header">
                                    <h3>{getTeamName(team1Id)}</h3>
                                </div>
                                <TeamWidget
                                    teamId={parseInt(team1Id)}
                                    season={parseInt(season)}
                                    type={activeTab}
                                    height={600}
                                />
                            </div>

                            <div className="comparison-column">
                                <div className="column-header">
                                    <h3>{getTeamName(team2Id)}</h3>
                                </div>
                                <TeamWidget
                                    teamId={parseInt(team2Id)}
                                    season={parseInt(season)}
                                    type={activeTab}
                                    height={600}
                                />
                            </div>
                        </div>
                    </>
                )}

                {/* Initial State */}
                {!showComparison && (
                    <div className="initial-compare-state">
                        <div className="compare-icon">⚔️</div>
                        <h3>Ready to Compare!</h3>
                        <p>Select two teams and click "Compare Teams" to see the matchup</p>
                    </div>
                )}
            </div>
        </div>
    );
}