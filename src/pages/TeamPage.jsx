import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { WIDGET_TYPES } from '../utils/constants.js';
import { addFavorite, removeFavorite, isFavorite } from '../services/storageService.js';
import './TeamPage.css';

export default function TeamPage() {
    const { teamId } = useParams();
    const location = useLocation();
    const widgetRef = useRef(null);

    const team = location.state?.team || {
        id: parseInt(teamId, 10),
        name: 'Team',
        logo: '',
        season: 2023,
    };

    const [activeTab, setActiveTab] = useState(WIDGET_TYPES.TEAM_STATS);
    const [isFavorited, setIsFavorited] = useState(isFavorite(team.id));

    const toggleFavorite = () => {
        if (isFavorited) {
            removeFavorite(team.id);
        } else {
            addFavorite({ id: team.id, name: team.name, logo: team.logo });
        }
        setIsFavorited(!isFavorited);
    };

    // Load widget script once
    useEffect(() => {
        if (!document.querySelector('script[src="https://widgets.api-sports.io/3.1.0/widgets.js"]')) {
            const script = document.createElement('script');
            script.type = 'module';
            script.src = 'https://widgets.api-sports.io/3.1.0/widgets.js';
            document.body.appendChild(script);
        }
    }, []);

    // Inject widget HTML based on active tab
    useEffect(() => {
        if (widgetRef.current) {
            let sectionFlag = '';
            if (activeTab === 'statistics') sectionFlag = 'data-team-statistics="true"';
            else if (activeTab === 'squads') sectionFlag = 'data-team-squad="true"';
            else if (activeTab === 'venue') sectionFlag = 'data-team-venue="true"';

            widgetRef.current.innerHTML = `
        <api-sports-widget
          data-type="config"
          data-key="1b4a2ac95b6319ca743e3be72f8948d8"
          data-sport="football"
          data-theme="white"
          data-lang="en"
          data-show-errors="true"
          data-show-logos="true"
        ></api-sports-widget>
        <api-sports-widget
          data-type="team"
          data-team-id="${team.id}"
          data-season="${team.season}"
          ${sectionFlag}
        ></api-sports-widget>
      `;
        }
    }, [activeTab, team.id, team.season]);

    const renderTabButton = (label, value, icon) => (
        <button
            className={`tab-btn ${activeTab === value ? 'active' : ''}`}
            onClick={() => setActiveTab(value)}
        >
            {icon} {label}
        </button>
    );

    return (
        <div className="team-page">
            <div className="team-page-container">
                {/* Header */}
                <header className="team-header">
                    <div className="team-info">
                        {team.logo && (
                            <img
                                src={team.logo}
                                alt={`${team.name} logo`}
                                className="team-header-logo"
                            />
                        )}
                        <div>
                            <h1 className="team-name">{team.name}</h1>
                            <p className="team-subtitle">Season: {team.season}</p>
                        </div>
                    </div>

                    <button
                        className={`favorite-btn ${isFavorited ? 'favorited' : ''}`}
                        onClick={toggleFavorite}
                    >
                        {isFavorited ? '⭐ Favorited' : '☆ Add to Favorites'}
                    </button>
                </header>

                {/* Tabs */}
                <nav className="widget-tabs">
                    {renderTabButton('Statistics', WIDGET_TYPES.TEAM_STATS, '📊')}
                    {renderTabButton('Squad', WIDGET_TYPES.TEAM_SQUAD, '👥')}
                    {renderTabButton('Stadium', WIDGET_TYPES.TEAM_VENUE, '🏟️')}
                </nav>

                {/* Widget */}
                <section className="widget-display">
                    <div ref={widgetRef} />
                </section>

                {/* Navigation */}
                <footer className="team-actions">
                    <button className="btn btn-secondary" onClick={() => window.history.back()}>
                        ← Back to Search
                    </button>
                </footer>
            </div>
        </div>
    );
}
