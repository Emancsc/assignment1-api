import { STORAGE_KEYS } from '../utils/constants.js';

/**
 * Get favorites from localStorage
 */
export const getFavorites = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.FAVORITES);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error getting favorites:', error);
        return [];
    }
};

/**
 * Add team to favorites
 */
export const addFavorite = (team) => {
    try {
        const favorites = getFavorites();

        // Check if already exists
        const exists = favorites.some(f => f.id === team.id);
        if (exists) {
            return favorites;
        }

        const newFavorites = [...favorites, team];
        localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(newFavorites));
        return newFavorites;
    } catch (error) {
        console.error('Error adding favorite:', error);
        return getFavorites();
    }
};

/**
 * Remove team from favorites
 */
export const removeFavorite = (teamId) => {
    try {
        const favorites = getFavorites();
        const newFavorites = favorites.filter(f => f.id !== teamId);
        localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(newFavorites));
        return newFavorites;
    } catch (error) {
        console.error('Error removing favorite:', error);
        return getFavorites();
    }
};

/**
 * Check if team is favorite
 */
export const isFavorite = (teamId) => {
    const favorites = getFavorites();
    return favorites.some(f => f.id === teamId);
};