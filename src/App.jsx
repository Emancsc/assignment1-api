import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar.jsx';
import SearchPage from './pages/SearchPage.jsx';
import TeamPage from './pages/TeamPage.jsx';
import ComparePage from './pages/ComparePage.jsx';
import FavoritesPage from './pages/FavoritePage.jsx';

import NewsPage from './pages/NewsPage.jsx';
import TriviaPage from './pages/TriviaPage.jsx';
import HomePage from './pages/HomePage.jsx';


import './App.css';

export default function App() {
    return (
        <BrowserRouter>
            <div className="app">
                <Navbar />

                <Routes>
                    {/* Redirect home → search */}
                    <Route path="/" element={<Navigate to="/search" replace />} />

                    {/* Existing pages */}
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/team/:teamId" element={<TeamPage />} />
                    <Route path="/compare" element={<ComparePage />} />
                    <Route path="/favorites" element={<FavoritesPage />} />

                    {/* New Pages */}
                    <Route path="/news" element={<NewsPage />} />
                    <Route path="/trivia" element={<TriviaPage />} />
                    <Route path="/home" element={<HomePage />} />

                    {/*<Route path="/home" element={<Navigate to="/home" replace />} />*/}

                </Routes>
            </div>
        </BrowserRouter>
    );
}
