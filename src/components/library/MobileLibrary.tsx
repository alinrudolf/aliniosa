import { type CSSProperties, useEffect, useRef, useState } from 'react';
import type { Movie } from '../../data/movies';
import { useTerminalTextSwap } from '../layout/TerminalTextSwap';
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
  restoreFocusMovieId?: string | null;
  onRestoreFocusComplete?: () => void;
};

type MobileLibraryPreviewProps = {
  movie: Movie;
  orientation: MobileLibraryOrientation;
  onOpen: () => void;
};

type MobileLibraryDetailsProps = {
  movie: Movie;
  orientation: MobileLibraryOrientation;
  currentMovieIndex: number;
  totalMovies: number;
  onPrevious: () => void;
  onNext: () => void;
  onClose: () => void;
};

type MobileLibraryOrientationViewProps = Omit<MobileLibraryProps, 'orientation'> & {
  restoreFocusMovieId?: string | null;
  onRestoreFocusComplete?: () => void;
};

type AnimatedMobileLibraryTextProps = {
  triggerKey: string;
  value: string;
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

function AnimatedMobileLibraryText({ triggerKey, value }: AnimatedMobileLibraryTextProps) {
  const { displayValue } = useTerminalTextSwap(value, triggerKey);

  return (
    <span aria-label={value}>
      <span aria-hidden="true">{displayValue}</span>
    </span>
  );
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
  restoreFocusMovieId,
  onRestoreFocusComplete,
}: MobileLibraryListProps) {
  const listRef = useSelectedRowReveal(selectedMovieIndex, orientation, 'list');

  useEffect(() => {
    if (!restoreFocusMovieId) {
      return;
    }

    const selectedRow = listRef.current?.querySelector<HTMLElement>(
      `[data-mobile-library-movie-id="${restoreFocusMovieId}"]`,
    );

    selectedRow?.scrollIntoView({ block: 'nearest' });
    selectedRow?.focus({ preventScroll: true });
    onRestoreFocusComplete?.();
  }, [listRef, onRestoreFocusComplete, restoreFocusMovieId]);

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
              data-mobile-library-movie-id={movie.id}
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

function DetailControls({ onPrevious, onNext, onClose }: Pick<MobileLibraryDetailsProps, 'onPrevious' | 'onNext' | 'onClose'>) {
  return (
    <div className="mobile-library-detail-controls" aria-label="Movie record controls">
      <div className="mobile-library-detail-controls-nav">
        <button type="button" className="mobile-library-detail-control" aria-label="Previous movie" onClick={onPrevious}>
          <span aria-hidden="true" dangerouslySetInnerHTML={{ __html: previousIcon }} />
        </button>
        <button type="button" className="mobile-library-detail-control" aria-label="Next movie" onClick={onNext}>
          <span aria-hidden="true" dangerouslySetInnerHTML={{ __html: nextIcon }} />
        </button>
      </div>
      <button
        type="button"
        className="mobile-library-detail-control mobile-library-detail-close"
        aria-label="Close details and return to Library list"
        onClick={onClose}
      >
        <span className="mobile-library-detail-close-icon" aria-hidden="true" />
      </button>
    </div>
  );
}

function MobileLibraryProgressDivider({
  currentMovieIndex,
  totalMovies,
}: Pick<MobileLibraryDetailsProps, 'currentMovieIndex' | 'totalMovies'>) {
  const progress = ((currentMovieIndex + 1) / totalMovies) * 100;
  const progressStyle = {
    '--mobile-library-progress': `${progress}%`,
  } as CSSProperties;

  return (
    <span
      className="mobile-library-progress-divider"
      role="progressbar"
      aria-label="Movie list progress"
      aria-valuemin={1}
      aria-valuemax={totalMovies}
      aria-valuenow={currentMovieIndex + 1}
      style={progressStyle}
    />
  );
}

function MobileLibraryDetails({
  movie,
  orientation,
  currentMovieIndex,
  totalMovies,
  onPrevious,
  onNext,
  onClose,
}: MobileLibraryDetailsProps) {
  const animationKey = movie.id;
  const detailsGenres = `${formatGenres(movie, ' / ')} / ${movie.year}`;
  const director = movie.director.toUpperCase();

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
          <AnimatedMobileLibraryText value={formatTitle(movie)} triggerKey={animationKey} />
        </h1>
        <p className="mobile-library-details-genres">
          <AnimatedMobileLibraryText value={detailsGenres} triggerKey={animationKey} />
        </p>
        <MobileLibraryProgressDivider currentMovieIndex={currentMovieIndex} totalMovies={totalMovies} />
        <DetailControls onPrevious={onPrevious} onNext={onNext} onClose={onClose} />
        <dl className="mobile-library-details-meta">
          <div>
            <dt>Director</dt>
            <dd>
              <AnimatedMobileLibraryText value={director} triggerKey={animationKey} />
            </dd>
          </div>
          <div>
            <dt>Synopsis</dt>
            <dd>
              <AnimatedMobileLibraryText value={movie.synopsis} triggerKey={animationKey} />
            </dd>
          </div>
        </dl>
        {movie.imdb ? (
          <a href={movie.imdb} target="_blank" rel="noreferrer" className="mobile-library-imdb-link">
            IMDB ↗
          </a>
        ) : null}
      </div>
    </article>
  );
}

function MobileLibraryPortrait({
  movies,
  selectedMovieIndex,
  viewMode,
  onSelectedMovieIndexChange,
  onViewModeChange,
  restoreFocusMovieId,
  onRestoreFocusComplete,
}: MobileLibraryOrientationViewProps) {
  const selectedMovie = movies[selectedMovieIndex];

  if (!selectedMovie) {
    return null;
  }

  if (viewMode === 'details') {
    return (
      <MobileLibraryDetails
        movie={selectedMovie}
        orientation="portrait"
        currentMovieIndex={selectedMovieIndex}
        totalMovies={movies.length}
        onPrevious={() => onSelectedMovieIndexChange((selectedMovieIndex - 1 + movies.length) % movies.length)}
        onNext={() => onSelectedMovieIndexChange((selectedMovieIndex + 1) % movies.length)}
        onClose={() => onViewModeChange('list')}
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
        restoreFocusMovieId={restoreFocusMovieId}
        onRestoreFocusComplete={onRestoreFocusComplete}
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
  restoreFocusMovieId,
  onRestoreFocusComplete,
}: MobileLibraryOrientationViewProps) {
  const selectedMovie = movies[selectedMovieIndex];

  if (!selectedMovie) {
    return null;
  }

  if (viewMode === 'details') {
    return (
      <MobileLibraryDetails
        movie={selectedMovie}
        orientation="landscape"
        currentMovieIndex={selectedMovieIndex}
        totalMovies={movies.length}
        onPrevious={() => onSelectedMovieIndexChange((selectedMovieIndex - 1 + movies.length) % movies.length)}
        onNext={() => onSelectedMovieIndexChange((selectedMovieIndex + 1) % movies.length)}
        onClose={() => onViewModeChange('list')}
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
          restoreFocusMovieId={restoreFocusMovieId}
          onRestoreFocusComplete={onRestoreFocusComplete}
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
  const [restoreFocusMovieId, setRestoreFocusMovieId] = useState<string | null>(null);

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
  const selectedMovie = movies[safeSelectedMovieIndex];
  const sharedProps = {
    movies,
    selectedMovieIndex: safeSelectedMovieIndex,
    viewMode,
    onSelectedMovieIndexChange,
    onViewModeChange: (nextViewMode: MobileLibraryViewMode) => {
      if (nextViewMode === 'list') {
        setRestoreFocusMovieId(selectedMovie?.id ?? null);
      }

      onViewModeChange(nextViewMode);
    },
    restoreFocusMovieId,
    onRestoreFocusComplete: () => setRestoreFocusMovieId(null),
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
