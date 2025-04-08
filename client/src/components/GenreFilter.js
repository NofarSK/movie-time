import React, { useState, useEffect } from 'react';
import { getMovieGenres } from '../api/apiClient';
import '../styles/GenreFilter.css';

const GenreFilter = ({ selectedGenre, onGenreChange }) => {
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                setLoading(true);
                const genreList = await getMovieGenres();
                setGenres(genreList);
                setError(null);
            } catch (err) {
                setError('Failed to load genres');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchGenres();
    }, []);

    if (loading) return <div className="genre-filter-loading">Loading genres...</div>;
    if (error) return <div className="genre-filter-error">{error}</div>;

    return (
        <div className="genre-filter">
            <h3>Filter by Genre</h3>
            <div className="genre-buttons">
                <button
                    className={selectedGenre === null ? 'active' : ''}
                    onClick={() => onGenreChange(null)}
                >
                    All Genres
                </button>

                {genres.map(genre => (
                    <button
                        key={genre.id}
                        className={selectedGenre === genre.id ? 'active' : ''}
                        onClick={() => onGenreChange(genre.id)}
                    >
                        {genre.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default GenreFilter;