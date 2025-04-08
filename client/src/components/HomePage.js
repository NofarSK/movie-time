import React, { useState, useEffect, useRef } from 'react';
import { getPopularMovies } from '../api/apiClient';
import GenreFilter from './GenreFilter';
import '../styles/HomePage.css';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);
    const [selectedGenre, setSelectedGenre] = useState(null);
    // Ref to store the previous number of movies
    const prevMoviesCountRef = useRef(0);

    const navigate = useNavigate();

    // Effect for loading movies (runs on initial load and when genre changes)
    useEffect(() => {
        const loadMovies = async () => {
            try {
                setLoading(true);
                // Reset to page 1 when genre changes
                setPage(1);
                const initialMovies = await getPopularMovies(1, selectedGenre);
                setMovies(initialMovies);
                // Reset the previous movies count
                prevMoviesCountRef.current = initialMovies.length;
                setError(null);
            } catch (err) {
                setError('Failed to fetch movies');
            } finally {
                setLoading(false);
            }
        };

        loadMovies();
    }, [selectedGenre]); // Re-run when selectedGenre changes

    // Handle load more button
    const handleLoadMore = async () => {
        try {
            setLoadingMore(true);
            const nextPage = page + 1;
            const newMovies = await getPopularMovies(nextPage, selectedGenre);

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

    // Handle genre change
    const handleGenreChange = (genreId) => {
        setSelectedGenre(genreId);
        // The useEffect will handle loading movies with the new genre
    };

    if (loading) return <div className="loading">Loading movies...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (movies.length === 0) return <div className="no-movies">No movies found</div>;

    return (
        <div className="home-page">
            <h1>Popular Movies</h1>

            {/* Genre filter component */}
            <GenreFilter
                selectedGenre={selectedGenre}
                onGenreChange={handleGenreChange}
            />

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

export default HomePage;