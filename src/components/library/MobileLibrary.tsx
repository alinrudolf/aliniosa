import { useEffect, useRef } from 'react';
import type { Movie } from '../../data/movies';
import nextIcon from '../../assets/icons/mobile-library-chevron-next.svg?raw';
import previousIcon from '../../assets/icons/mobile-library-chevron-previous.svg?raw';
import openIcon from '../../assets/icons/mobile-library-open.svg?raw';

export type MobileLibraryViewMode = 'list' | 'details';
export type MobileLibraryOrientation = 'portrait' | 'landscape';

type MobileLibraryProps = {
  movies: Movie[];
  orientation: MobileLibraryOrientation;
  selectedMovieIndex: number;
  viewMode: MobileLibraryViewMode;
  onSelectedMovieIndexChange: (index: number) => void;
  onViewModeChange: (viewMode: MobileLibraryViewMode) => void;
};

type MobileLibraryListProps = {
  movies: Movie[];
  orientation: MobileLibraryOrientation;
  selectedMovieIndex: number;
  onSelect: (index: number) => void;
};

type MobileLibraryPreviewProps = {
  movie: Movie;
  orientation: MobileLibraryOrientation;
  onOpen: () => void;
};

type MobileLibraryDetailsProps = {
  movie: Movie;
  orientation: MobileLibraryOrientation;
  onPrevious: () => void;
  onNext: () => void;
};

function formatMovieNumber(index: number) {
  return String(index + 1).padStart(2, '0');
}

function formatTitle(movie: Movie) {
  return movie.title.toUpperCase();
}

function formatGenres(movie: Movie, separator = ', ') {
  return movie.genres.map((genre) => genre.toUpperCase()).join(separator);
}

function useSelectedRowReveal(
  selectedMovieIndex: number,
  orientation: MobileLibraryOrientation,
  viewMode: MobileLibraryViewMode,
) {
  const listRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    if (orientation !== 'landscape' || viewMode !== 'list') {
      return;
    }

    const selectedRow = listRef.current?.querySelector<HTMLElement>('[data-mobile-library-selected="true"]');

    selectedRow?.scrollIntoView({ block: 'nearest' });
  }, [orientation, selectedMovieIndex, viewMode]);

  return listRef;
}

function MobileLibraryList({
  movies,
  orientation,
  selectedMovieIndex,
  onSelect,
}: MobileLibraryListProps) {
  const listRef = useSelectedRowReveal(selectedMovieIndex, orientation, 'list');

  return (
    <ul ref={listRef} className="mobile-library-list" aria-label="Movie records">
      {movies.map((movie, index) => {
        const isSelected = index === selectedMovieIndex;

        return (
          <li
            key={movie.id}
            className={`mobile-library-list-item ${isSelected ? 'mobile-library-list-item-selected' : ''}`}
          >
            <button
              type="button"
              className={`mobile-library-row ${isSelected ? 'mobile-library-row-selected' : ''}`}
              aria-pressed={isSelected}
              data-mobile-library-selected={isSelected}
              onClick={() => onSelect(index)}
            >
              <span className="mobile-library-row-index">{formatMovieNumber(index)}</span>
              <span className="mobile-library-row-copy">
                <span className="mobile-library-row-title">{formatTitle(movie)}</span>
                <span className="mobile-library-row-genres">{formatGenres(movie)}</span>
              </span>
              {orientation === 'portrait' ? (
                <span className="mobile-library-row-year">{movie.year}</span>
              ) : null}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function OpenDetailsButton({ movie, onOpen }: { movie: Movie; onOpen: () => void }) {
  return (
    <button
      type="button"
      className="mobile-library-open-button"
      aria-label={`Open details for ${movie.title}`}
      onClick={onOpen}
    >
      <span className="mobile-library-open-icon" aria-hidden="true" dangerouslySetInnerHTML={{ __html: openIcon }} />
      <span>OPEN</span>
    </button>
  );
}

function MobileLibraryPreview({ movie, orientation, onOpen }: MobileLibraryPreviewProps) {
  return (
    <section
      className={`mobile-library-preview mobile-library-preview-${orientation}`}
      aria-label={`${movie.title} preview`}
      aria-live="polite"
    >
      <span className="mobile-library-preview-poster-frame">
        <img src={movie.poster} alt={`${movie.title} poster`} className="mobile-library-poster" draggable={false} />
      </span>
      <div className="mobile-library-preview-copy">
        <h2 className="mobile-library-preview-title">{formatTitle(movie)}</h2>
        <dl className="mobile-library-preview-meta">
          {orientation === 'landscape' ? (
            <div>
              <dt>Year</dt>
              <dd>{movie.year}</dd>
            </div>
          ) : null}
          <div>
            <dt>Director</dt>
            <dd>{movie.director.toUpperCase()}</dd>
          </div>
        </dl>
        <p className="mobile-library-preview-synopsis">{movie.synopsis}</p>
        <OpenDetailsButton movie={movie} onOpen={onOpen} />
      </div>
    </section>
  );
}

function DetailControls({ onPrevious, onNext }: Pick<MobileLibraryDetailsProps, 'onPrevious' | 'onNext'>) {
  return (
    <div className="mobile-library-detail-controls" aria-label="Movie record controls">
      <button type="button" className="mobile-library-detail-control" aria-label="Previous movie" onClick={onPrevious}>
        <span aria-hidden="true" dangerouslySetInnerHTML={{ __html: previousIcon }} />
      </button>
      <button type="button" className="mobile-library-detail-control" aria-label="Next movie" onClick={onNext}>
        <span aria-hidden="true" dangerouslySetInnerHTML={{ __html: nextIcon }} />
      </button>
    </div>
  );
}

function MobileLibraryDetails({ movie, orientation, onPrevious, onNext }: MobileLibraryDetailsProps) {
  return (
    <article
      className={`mobile-library-details mobile-library-details-${orientation}`}
      aria-labelledby="mobile-library-details-title"
      aria-live="polite"
    >
      <span className="mobile-library-details-poster-frame">
        <img src={movie.poster} alt={`${movie.title} poster`} className="mobile-library-poster" draggable={false} />
      </span>
      <div className="mobile-library-details-copy">
        <h1 id="mobile-library-details-title" className="mobile-library-details-title">
          {formatTitle(movie)}
        </h1>
        <p className="mobile-library-details-genres">
          {formatGenres(movie, ' / ')} / {movie.year}
        </p>
        <span className="mobile-library-dotted-divider" aria-hidden="true" />
        <dl className="mobile-library-details-meta">
          <div>
            <dt>Director</dt>
            <dd>{movie.director.toUpperCase()}</dd>
          </div>
          <div>
            <dt>Synopsis</dt>
            <dd>{movie.synopsis}</dd>
          </div>
        </dl>
        {movie.imdb ? (
          <a href={movie.imdb} target="_blank" rel="noreferrer" className="mobile-library-imdb-link">
            IMDB ↗
          </a>
        ) : null}
      </div>
      <DetailControls onPrevious={onPrevious} onNext={onNext} />
    </article>
  );
}

function MobileLibraryPortrait({
  movies,
  selectedMovieIndex,
  viewMode,
  onSelectedMovieIndexChange,
  onViewModeChange,
}: Omit<MobileLibraryProps, 'orientation'>) {
  const selectedMovie = movies[selectedMovieIndex];

  if (!selectedMovie) {
    return null;
  }

  if (viewMode === 'details') {
    return (
      <MobileLibraryDetails
        movie={selectedMovie}
        orientation="portrait"
        onPrevious={() => onSelectedMovieIndexChange((selectedMovieIndex - 1 + movies.length) % movies.length)}
        onNext={() => onSelectedMovieIndexChange((selectedMovieIndex + 1) % movies.length)}
      />
    );
  }

  return (
    <div className="mobile-library-list-view mobile-library-list-view-portrait">
      <MobileLibraryList
        movies={movies}
        orientation="portrait"
        selectedMovieIndex={selectedMovieIndex}
        onSelect={onSelectedMovieIndexChange}
      />
      <MobileLibraryPreview movie={selectedMovie} orientation="portrait" onOpen={() => onViewModeChange('details')} />
    </div>
  );
}

function MobileLibraryLandscape({
  movies,
  selectedMovieIndex,
  viewMode,
  onSelectedMovieIndexChange,
  onViewModeChange,
}: Omit<MobileLibraryProps, 'orientation'>) {
  const selectedMovie = movies[selectedMovieIndex];

  if (!selectedMovie) {
    return null;
  }

  if (viewMode === 'details') {
    return (
      <MobileLibraryDetails
        movie={selectedMovie}
        orientation="landscape"
        onPrevious={() => onSelectedMovieIndexChange((selectedMovieIndex - 1 + movies.length) % movies.length)}
        onNext={() => onSelectedMovieIndexChange((selectedMovieIndex + 1) % movies.length)}
      />
    );
  }

  return (
    <div className="mobile-library-list-view mobile-library-list-view-landscape">
      <div className="mobile-library-list-region">
        <MobileLibraryList
          movies={movies}
          orientation="landscape"
          selectedMovieIndex={selectedMovieIndex}
          onSelect={onSelectedMovieIndexChange}
        />
      </div>
      <MobileLibraryPreview movie={selectedMovie} orientation="landscape" onOpen={() => onViewModeChange('details')} />
    </div>
  );
}

export function MobileLibrary({
  movies,
  orientation,
  selectedMovieIndex,
  viewMode,
  onSelectedMovieIndexChange,
  onViewModeChange,
}: MobileLibraryProps) {
  if (movies.length === 0) {
    return (
      <main className="mobile-library-page mobile-library-page-empty" aria-labelledby="mobile-library-title">
        <h1 id="mobile-library-title" className="sr-only">
          Library
        </h1>
      </main>
    );
  }

  const safeSelectedMovieIndex = Math.min(Math.max(selectedMovieIndex, 0), movies.length - 1);
  const sharedProps = {
    movies,
    selectedMovieIndex: safeSelectedMovieIndex,
    viewMode,
    onSelectedMovieIndexChange,
    onViewModeChange,
  };

  return (
    <main
      className={`mobile-library-page mobile-library-page-${orientation} mobile-library-page-${viewMode}`}
      aria-labelledby="mobile-library-title"
    >
      <h1 id="mobile-library-title" className="sr-only">
        Library
      </h1>
      {orientation === 'portrait' ? (
        <MobileLibraryPortrait {...sharedProps} />
      ) : (
        <MobileLibraryLandscape {...sharedProps} />
      )}
    </main>
  );
}
