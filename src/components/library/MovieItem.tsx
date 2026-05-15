import type { Movie } from '../../data/movies';

type MovieItemProps = {
  movie: Movie;
  isSelected: boolean;
  onSelect: (movieId: string) => void;
};

export function MovieItem({ movie, isSelected, onSelect }: MovieItemProps) {
  const genres = movie.genres.join(', ');

  return (
    <li className="library-movie-item">
      <button
        type="button"
        className={`library-movie-card ${isSelected ? 'library-movie-card-selected' : ''}`}
        aria-pressed={isSelected}
        data-movie-id={movie.id}
        onClick={() => onSelect(movie.id)}
      >
        <span className="library-movie-index">{movie.id}</span>
        <span className="library-movie-poster-frame">
          <img src={movie.poster} alt={`${movie.title} poster`} className="library-movie-poster" draggable={false} />
        </span>
        <span className="library-movie-copy">
          <span className="library-movie-title">{movie.title}</span>
          <span className="library-movie-genres">{genres}</span>
          <span className="library-movie-year">{movie.year}</span>
        </span>
      </button>
    </li>
  );
}
