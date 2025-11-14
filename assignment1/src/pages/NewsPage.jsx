import React, { useState, useEffect } from 'react';
import { fetchNews } from '../services/newsAPI.js';
import './NewsPage.css';

export default function NewsPage() {
    const [articles, setArticles] = useState([]);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadNews = async () => {
        setLoading(true);
        const data = await fetchNews(query);

        if (!data) {
            setError('Failed to load news');
        } else {
            setError(null);
            setArticles(data.articles);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadNews();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        loadNews();
    };

    return (
        <div className="news-page">
            <h1 className="news-title">📰 Latest Sports News</h1>

            <form className="news-search" onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Search sports news..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button type="submit">Search</button>
            </form>

            {loading && <p className="loading">Loading...</p>}
            {error && <p className="error">{error}</p>}

            <div className="news-list">
                {articles.map((article, index) => (
                    <div key={index} className="news-card">
                        {article.urlToImage && (
                            <img
                                src={article.urlToImage}
                                alt={article.title}
                                className="news-image"
                            />
                        )}
                        <h2>{article.title}</h2>
                        <p>{article.description}</p>

                        <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="read-more"
                        >
                            Read full article →
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}
