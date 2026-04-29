export type Movie = {
  id: string;
  title: string;
  year: string;
  note: string;
};

export const movies: Movie[] = [
  {
    id: 'movie-01',
    title: 'Stalker',
    year: '1979',
    note: 'A slow inspection of faith, terrain, and invisible systems.',
  },
  {
    id: 'movie-02',
    title: 'Mirror',
    year: '1975',
    note: 'Memory treated as structure rather than chronology.',
  },
  {
    id: 'movie-03',
    title: 'La Jetee',
    year: '1962',
    note: 'A compact time machine built from stillness and voice.',
  },
];
