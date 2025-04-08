import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import '../styles/HomePage.css'; // Reuse HomePage styles
import { searchMovies } from '../api/apiClient';

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query');

    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);
    // Ref to store the previous number of movies
    const prevMoviesCountRef = useRef(0);

    const navigate = useNavigate();

    // Load search results when query changes
    useEffect(() => {
        const loadSearchResults = async () => {
            if (!query) return;

            try {
                setLoading(true);
                setPage(1);
                const results = await searchMovies(query);
                setMovies(results);
                // Reset the previous movies count
                prevMoviesCountRef.current = results.length;
                setError(null);
            } catch (err) {
                setError('Failed to search movies');
                setMovies([]);
            } finally {
                setLoading(false);
            }
        };

        loadSearchResults();
    }, [query]);

    // Handle load more button
    const handleLoadMore = async () => {
        if (!query) return;

        try {
            setLoadingMore(true);
            const nextPage = page + 1;
            const newMovies = await searchMovies(query, nextPage);

            // Store current movies count before adding new ones
            prevMoviesCountRef.current = movies.length;

            setMovies([...movies, ...newMovies]);
            setPage(nextPage);
            setError(null);
        } catch (err) {
            setError('Failed to load more movies');
        } finally {
            setLoadingMore(false);
        }
    };

    if (loading) return <div className="loading">Searching for movies...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (movies.length === 0) return <div className="no-results">No movies found matching "{query}"</div>;

    return (
        <div className="home-page">
            <h1>Search Results for: "{query}"</h1>

            <div className="movie-grid">
                {movies.map((movie, index) => (
                    <div
                        className={`movie-card ${index >= prevMoviesCountRef.current ? 'new-movie' : ''}`}
                        key={movie.id}
                        onClick={() => navigate(`/movie/${movie.id}`)}
                    >
                        {movie.poster_path ? (
                            <img
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                alt={movie.title}
                                className="movie-poster"
                            />
                        ) : (
                            <div className="no-poster">No Image Available</div>
                        )}

                        <div className="movie-info">
                            <h2>{movie.title}</h2>
                            <p>⭐ {movie.vote_average}/10</p>
                            <p>Release: {movie.release_date}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="load-more-container">
                <button
                    className="load-more-button"
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                >
                    {loadingMore ? 'Loading...' : 'Load More Movies'}
                </button>
            </div>
        </div>
    );
};

export default SearchPage;