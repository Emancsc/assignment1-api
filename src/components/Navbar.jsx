import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
    const location = useLocation();

    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    <img src="../assets/FANZONE.png" alt="FanZone Logo" className="logo" />
                    FanZone Central
                </Link>

                <ul className="navbar-menu">
                    <li>
                        <Link to="/" className={`navbar-link ${isActive('/')}`}>
                            🏠 Home
                        </Link>
                    </li>

                    <li>
                        <Link to="/search" className={`navbar-link ${isActive('/search')}`}>
                            🔍 Search
                        </Link>
                    </li>

                    <li>
                        <Link to="/compare" className={`navbar-link ${isActive('/compare')}`}>
                            ⚔️ Compare
                        </Link>
                    </li>

                    <li>
                        <Link to="/favorites" className={`navbar-link ${isActive('/favorites')}`}>
                            ⭐ Favorites
                        </Link>
                    </li>

                    {/* ✅ Added News Page */}
                    <li>
                        <Link to="/news" className={`navbar-link ${isActive('/news')}`}>
                            📰 News
                        </Link>
                    </li>

                    {/* ✅ Added Trivia Game */}
                    <li>
                        <Link to="/trivia" className={`navbar-link ${isActive('/trivia')}`}>
                            🎮 Trivia
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
