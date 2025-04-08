import axios from 'axios';

// Get API key from environment variables or use a fallback (not recommended for production)
const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

// Base API URL
const BASE_URL = 'https://api.themoviedb.org/3';

// Get popular movies (with optional genre filter)
export const getPopularMovies = async (page = 1, genreId = null) => {
    try {
        // Common parameters
        const params = {
            api_key: API_KEY,
            page
        };

        let url;

        // If genre filter is provided, use discover endpoint
        if (genreId) {
            url = `${BASE_URL}/discover/movie`;
            params.with_genres = genreId;
            params.sort_by = 'popularity.desc'; // Sort by popularity
        } else {
            // If no genre filter, use popular endpoint for better results
            url = `${BASE_URL}/movie/popular`;
        }

        const response = await axios.get(url, { params });
        return response.data.results;
    } catch (error) {
        console.error('Error fetching popular movies:', error);
        throw error;
    }
};

// Search movies by query
export const searchMovies = async (query, page = 1) => {
    try {
        const response = await axios.get(`${BASE_URL}/search/movie`, {
            params: {
                api_key: API_KEY,
                query,
                page
            }
        });

        return response.data.results;
    } catch (error) {
        console.error('Error searching movies:', error);
        throw error;
    }
};

// Get movie genres
export const getMovieGenres = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/genre/movie/list`, {
            params: {
                api_key: API_KEY
            }
        });

        return response.data.genres;
    } catch (error) {
        console.error('Error fetching genres:', error);
        throw error;
    }
};

// Get movie details by ID
export const getMovieDetails = async (movieId) => {
    try {
        const response = await axios.get(`${BASE_URL}/movie/${movieId}`, {
            params: {
                api_key: API_KEY
            }
        });

        return response.data;
    } catch (error) {
        console.error(`Error fetching movie ${movieId} details:`, error);
        throw error;
    }
};