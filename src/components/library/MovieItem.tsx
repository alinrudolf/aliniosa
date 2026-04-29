import type { Movie } from '../../data/movies';

type MovieItemProps = {
  movie: Movie;
};

export function MovieItem({ movie }: MovieItemProps) {
  return (
    <li className="grid gap-1 border-l border-[color:var(--amber-dim)] pl-4">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-sans text-base font-medium text-[color:var(--amber-core)]">{movie.title}</span>
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-[color:var(--amber-dim)]">{movie.year}</span>
      </div>
      <p className="text-sm leading-6 text-[color:var(--amber-base)]">{movie.note}</p>
    </li>
  );
}
