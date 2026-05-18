import libraryMoviesData from './library-movies-completed.json';

export type Movie = {
  id: string;
  title: string;
  genres: string[];
  year: number;
  director: string;
  imdb: string;
  poster: string;
  synopsis: string;
};

function withBaseUrl(path: string) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
}

export const movies: Movie[] = libraryMoviesData.movies.map((movie) => ({
  ...movie,
  poster: withBaseUrl(movie.poster),
}));
