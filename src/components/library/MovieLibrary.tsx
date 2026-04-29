import type { Movie } from '../../data/movies';
import { MovieItem } from './MovieItem';

type MovieLibraryProps = {
  movies: Movie[];
};

export function MovieLibrary({ movies }: MovieLibraryProps) {
  return (
    <ul className="grid gap-4">
      {movies.map((movie) => (
        <MovieItem key={movie.id} movie={movie} />
      ))}
    </ul>
  );
}
