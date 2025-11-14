import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFavorites, removeFavorite } from '../services/storageService.js';
import TeamWidget from '../components/TeamWidget.jsx';
import { WIDGET_TYPES } from '../utils/constants.js';
import './FavoritesPage.css';

export default function FavoritesPage() {
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [activeTab, setActiveTab] = useState(WIDGET_TYPES.TEAM_STATS);

    useEffect(() => {
        loadFavorites();
    }, []);

    const loadFavorites = () => {
        const favs = getFavorites();
        setFavorites(favs);
    };

    const handleRemove = (teamId) => {
        if (window.confirm('Remove this team from favorites?')) {
            removeFavorite(teamId);
            loadFavorites();
            if (selectedTeam?.id === teamId) {
                setSelectedTeam(null);
            }
        }
    };

    const handleViewDetails = (team) => {
        navigate(`/team/${team.id}`, {
            state: {
                team: {
                    id: team.id,
                    name: team.name,
                    logo: team.logo,
                    season: 2023
                }
            }
        });
    };

    const handleShowWidget = (team) => {
        setSelectedTeam(team);
    };

    return (
        <div className="favorites-page">
            <div className="favorites-container">
                {/* Header */}
                <div className="favorites-header">
                    <h1 className="favorites-title">⭐ My Favorite Teams</h1>
                    <p className="favorites-subtitle">
                        {favorites.length} {favorites.length === 1 ? 'team' : 'teams'} saved
                    </p>
                </div>

                {/* Empty State */}
                {favorites.length === 0 && (
                    <div className="empty-favorites">
                        <div className="empty-icon">😔</div>
                        <h3>No Favorite Teams Yet</h3>
                        <p>Start adding teams to your favorites from the search page!</p>
                        <button
                            className="btn btn-primary btn-large"
                            onClick={() => navigate('/search')}
                        >
                            🔍 Go to Search
                        </button>
                    </div>
                )}

                {/* Favorites Grid */}
                {favorites.length > 0 && (
                    <>
                        <div className="favorites-grid">
                            {favorites.map((team) => (
                                <div key={team.id} className="favorite-card">
                                    <button
                                        className="remove-btn"
                                        onClick={() => handleRemove(team.id)}
                                        title="Remove from favorites"
                                    >
                                        ✖
                                    </button>

                                    <div className="favorite-card-header">
                                        <img
                                            src={team.logo}
                                            alt={team.name}
                                            className="favorite-team-logo"
                                        />
                                        <h3 className="favorite-team-name">{team.name}</h3>
                                    </div>

                                    <div className="favorite-actions">
                                        <button
                                            className="btn btn-primary btn-small"
                                            onClick={() => handleViewDetails(team)}
                                        >
                                            📊 Full Details
                                        </button>
                                        <button
                                            className="btn btn-secondary btn-small"
                                            onClick={() => handleShowWidget(team)}
                                        >
                                            👁️ Quick View
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Quick View Section */}
                        {selectedTeam && (
                            <div className="quick-view-section">
                                <div className="quick-view-header">
                                    <div className="quick-view-title">
                                        <img
                                            src={selectedTeam.logo}
                                            alt={selectedTeam.name}
                                            className="quick-view-logo"
                                        />
                                        <h2>{selectedTeam.name}</h2>
                                    </div>
                                    <button
                                        className="close-quick-view"
                                        onClick={() => setSelectedTeam(null)}
                                    >
                                        ✖ Close
                                    </button>
                                </div>

                                {/* Tabs */}
                                <div className="quick-view-tabs">
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

                                {/* Widget */}
                                <TeamWidget
                                    teamId={selectedTeam.id}
                                    season={2023}
                                    type={activeTab}
                                    height={600}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}