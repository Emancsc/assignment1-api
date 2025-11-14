import axios from 'axios';

const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const BASE_URL = 'https://newsapi.org/v2';

// Fetch sports news, optional search query
export const fetchNews = async (query = '') => {
    try {
        const response = await axios.get(`${BASE_URL}/everything`, {
            params: {
                q: query || 'sports',
                language: 'en',
                sortBy: 'publishedAt',
                apiKey: API_KEY,
            },
        });

        return response.data;

    } catch (error) {
        console.error('Error loading news:', error);
        return null;
    }
};
