import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/MovieDetail.css';
import { getMovieDetails } from '../api/apiClient';

const MovieDetail = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // API key
    const apiKey = process.env.REACT_APP_TMDB_API_KEY;

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                setLoading(true);

                // Fetch basic movie details using the getMovieDetails function
                const movieData = await getMovieDetails(id);

                // Fetch additional data (credits and videos) that might not be in the basic details
                const additionalData = await axios.get(
                    `https://api.themoviedb.org/3/movie/${id}`,
                    {
                        params: {
                            api_key: apiKey,
                            append_to_response: 'credits,videos'
                        }
                    }
                );

                // Combine the data
                setMovie({
                    ...movieData,
                    credits: additionalData.data.credits,
                    videos: additionalData.data.videos
                });
                setError(null);
            } catch (err) {
                console.error('Error fetching movie details:', err);
                setError('Failed to load movie details');
            } finally {
                setLoading(false);
            }
        };

        fetchMovieDetails();
    }, [id, apiKey]);

    if (loading) return <div className="loading">Loading movie details...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!movie) return <div className="no-movie">Movie not found</div>;

    // Format runtime to hours and minutes
    const formatRuntime = (minutes) => {
        if (!minutes) return 'Unknown';
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Format budget/revenue
    const formatMoney = (amount) => {
        if (!amount) return 'Unknown';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Get director
    const director = movie.credits?.crew.find(person => person.job === 'Director');

    // Get top cast members
    const topCast = movie.credits?.cast.slice(0, 6) || [];

    // Get trailer
    const trailer = movie.videos?.results.find(
        video => video.type === 'Trailer' && video.site === 'YouTube'
    );

    return (
        <div className="movie-detail">
            <div className="back-button-container">
                <Link to="/" className="back-button">
                    ← Back to Movies
                </Link>
            </div>

            <div className="movie-detail-content">
                <div className="movie-backdrop"
                    style={{
                        backgroundImage: movie.backdrop_path
                            ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
                            : 'none'
                    }}>
                    <div className="backdrop-overlay"></div>
                </div>

                <div className="movie-detail-main">
                    <div className="movie-poster-container">
                        {movie.poster_path ? (
                            <img
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                alt={`${movie.title} poster`}
                                className="movie-detail-poster"
                            />
                        ) : (
                            <div className="no-poster">No Poster Available</div>
                        )}
                    </div>

                    <div className="movie-info-container">
                        <h1 className="movie-title">
                            {movie.title} <span className="movie-year">({movie.release_date?.substring(0, 4) || 'N/A'})</span>
                        </h1>

                        <div className="movie-meta">
                            <span className="movie-rating">⭐ {movie.vote_average?.toFixed(1)}/10</span>
                            <span className="movie-runtime">{formatRuntime(movie.runtime)}</span>
                            <span className="movie-release-date">{formatDate(movie.release_date)}</span>
                        </div>

                        <div className="movie-genres">
                            {movie.genres?.map(genre => (
                                <span key={genre.id} className="genre-tag">
                                    {genre.name}
                                </span>
                            ))}
                        </div>

                        {movie.tagline && <p className="movie-tagline">"{movie.tagline}"</p>}

                        <div className="movie-overview">
                            <h3>Overview</h3>
                            <p>{movie.overview || 'No overview available.'}</p>
                        </div>

                        {director && (
                            <div className="movie-director">
                                <h3>Director</h3>
                                <p>{director.name}</p>
                            </div>
                        )}

                        {topCast.length > 0 && (
                            <div className="movie-cast">
                                <h3>Cast</h3>
                                <div className="cast-list">
                                    {topCast.map(person => (
                                        <div key={person.id} className="cast-member">
                                            {person.profile_path ? (
                                                <img
                                                    src={`https://image.tmdb.org/t/p/w200${person.profile_path}`}
                                                    alt={person.name}
                                                    className="cast-photo"
                                                />
                                            ) : (
                                                <div className="no-cast-photo">
                                                    <span>{person.name.charAt(0)}</span>
                                                </div>
                                            )}
                                            <div className="cast-name">{person.name}</div>
                                            <div className="cast-character">{person.character}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="movie-details-grid">
                            <div className="detail-item">
                                <h3>Status</h3>
                                <p>{movie.status || 'Unknown'}</p>
                            </div>

                            <div className="detail-item">
                                <h3>Budget</h3>
                                <p>{formatMoney(movie.budget)}</p>
                            </div>

                            <div className="detail-item">
                                <h3>Revenue</h3>
                                <p>{formatMoney(movie.revenue)}</p>
                            </div>

                            {movie.production_companies && movie.production_companies.length > 0 && (
                                <div className="detail-item">
                                    <h3>Production</h3>
                                    <p>{movie.production_companies.map(company => company.name).join(', ')}</p>
                                </div>
                            )}
                        </div>

                        {trailer && (
                            <div className="movie-trailer">
                                <h3>Trailer</h3>
                                <div className="trailer-container">
                                    <iframe
                                        src={`https://www.youtube.com/embed/${trailer.key}`}
                                        title={`${movie.title} Trailer`}
                                        frameBorder="0"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetail;