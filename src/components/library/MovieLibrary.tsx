import { useMemo, useRef, useState, type KeyboardEvent, type WheelEvent } from 'react';
import type { Movie } from '../../data/movies';
import { useTerminalTextSwap } from '../layout/TerminalTextSwap';
import { MovieItem } from './MovieItem';

type MovieLibraryProps = {
  movies: Movie[];
};

type AnimatedLibraryTextProps = {
  triggerKey: string;
  value: string;
};

function formatGenres(movie: Movie) {
  return movie.genres.join(', ');
}

function AnimatedLibraryText({ triggerKey, value }: AnimatedLibraryTextProps) {
  const { displayValue } = useTerminalTextSwap(value, triggerKey);

  return (
    <span aria-label={value}>
      <span aria-hidden="true">{displayValue}</span>
    </span>
  );
}

export function MovieLibrary({ movies }: MovieLibraryProps) {
  const [selectedMovieId, setSelectedMovieId] = useState(() => movies[0]?.id ?? '');
  const listRef = useRef<HTMLUListElement | null>(null);
  const selectedMovie = useMemo(
    () => movies.find((movie) => movie.id === selectedMovieId) ?? movies[0],
    [movies, selectedMovieId],
  );
  const synopsisText = selectedMovie?.synopsis ?? '';
  const animationKey = selectedMovie?.id ?? selectedMovieId;
  const { displayValue: displayedSynopsis } = useTerminalTextSwap(synopsisText, animationKey);

  const focusMovieCard = (movieId: string) => {
    window.requestAnimationFrame(() => {
      const movieButton = listRef.current?.querySelector<HTMLButtonElement>(`[data-movie-id="${movieId}"]`);

      movieButton?.focus();
      movieButton?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    });
  };

  const selectMovie = (movieId: string) => {
    setSelectedMovieId(movieId);
  };

  const handleRailKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!selectedMovie || (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')) {
      return;
    }

    const selectedIndex = movies.findIndex((movie) => movie.id === selectedMovie.id);

    if (selectedIndex < 0) {
      return;
    }

    const nextIndex =
      event.key === 'ArrowRight'
        ? Math.min(movies.length - 1, selectedIndex + 1)
        : Math.max(0, selectedIndex - 1);
    const nextMovie = movies[nextIndex];

    if (!nextMovie || nextMovie.id === selectedMovie.id) {
      return;
    }

    event.preventDefault();
    setSelectedMovieId(nextMovie.id);
    focusMovieCard(nextMovie.id);
  };

  const handleRailWheel = (event: WheelEvent<HTMLDivElement>) => {
    const rail = event.currentTarget;
    const horizontalDelta = Math.abs(event.deltaX) >= Math.abs(event.deltaY) ? event.deltaX : event.deltaY;

    if (horizontalDelta === 0) {
      return;
    }

    event.preventDefault();
    rail.scrollLeft += horizontalDelta;
  };

  if (!selectedMovie) {
    return (
      <section className="library-page-content" aria-labelledby="library-title">
        <h2 id="library-title" className="sr-only">
          Library
        </h2>
      </section>
    );
  }

  return (
    <section className="library-page-content" aria-labelledby="library-title">
      <h2 id="library-title" className="sr-only">
        Library
      </h2>
      <div
        className="library-movie-rail"
        aria-label="Movie list"
        tabIndex={0}
        onKeyDown={handleRailKeyDown}
        onWheel={handleRailWheel}
      >
        <ul ref={listRef} className="library-movie-list">
          {movies.map((movie) => (
            <MovieItem
              key={movie.id}
              movie={movie}
              isSelected={movie.id === selectedMovie.id}
              onSelect={selectMovie}
            />
          ))}
        </ul>
      </div>
      <section className="library-details-panel" aria-label={`${selectedMovie.title} details`} aria-live="polite">
        <div className="library-details-primary">
          <h3 className="library-details-title">
            <AnimatedLibraryText value={selectedMovie.title} triggerKey={animationKey} />
          </h3>
          <dl className="library-details-list">
            <div>
              <dt>Genre</dt>
              <dd>
                <AnimatedLibraryText value={formatGenres(selectedMovie)} triggerKey={animationKey} />
              </dd>
            </div>
            <div>
              <dt>Director</dt>
              <dd>
                <AnimatedLibraryText value={selectedMovie.director} triggerKey={animationKey} />
              </dd>
            </div>
            <div>
              <dt>Year</dt>
              <dd>
                <AnimatedLibraryText value={String(selectedMovie.year)} triggerKey={animationKey} />
              </dd>
            </div>
          </dl>
        </div>
        <div className="library-details-synopsis">
          <p className="library-details-label">Synopsis</p>
          <p aria-label={selectedMovie.synopsis}>
            <span aria-hidden="true">{displayedSynopsis}</span>
          </p>
          <a href={selectedMovie.imdb} target="_blank" rel="noreferrer" className="library-imdb-link">
            IMDB ↗
          </a>
        </div>
      </section>
    </section>
  );
}
