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

export const movies: Movie[] = libraryMoviesData.movies;
