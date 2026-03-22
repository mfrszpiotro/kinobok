import { describe, it, expect } from 'vitest';
import { parseWatchlist } from '../utils/csv_parser';

interface Movie {
  id: string;
  title: string;
  boxd_uri: string;
}

interface Showtime {
  movie_id: string;
  cinema_id: string;
  times: string[];
}

interface Data {
  movies: Movie[];
  showtimes: Showtime[];
}

export function findMatches(watchlistUris: string[], data: Data) {
  const matchingMovies = data.movies.filter(movie => watchlistUris.includes(movie.boxd_uri));
  const movieIds = matchingMovies.map(m => m.id);
  const relevantShowtimes = data.showtimes.filter(s => movieIds.includes(s.movie_id));
  
  return {
    matchingMovies,
    relevantShowtimes
  };
}

describe('Matching Logic', () => {
  const mockData: Data = {
    movies: [
      { id: 'm1', title: 'Movie 1', boxd_uri: 'https://boxd.it/uri1' },
      { id: 'm2', title: 'Movie 2', boxd_uri: 'https://boxd.it/uri2' },
    ],
    showtimes: [
      { movie_id: 'm1', cinema_id: 'c1', times: ['12:00'] },
    ]
  };

  it('should find matching movies from watchlist URIs', () => {
    const watchlistUris = ['https://boxd.it/uri1'];
    const { matchingMovies, relevantShowtimes } = findMatches(watchlistUris, mockData);
    
    expect(matchingMovies).toHaveLength(1);
    expect(matchingMovies[0].id).toBe('m1');
    expect(relevantShowtimes).toHaveLength(1);
    expect(relevantShowtimes[0].cinema_id).toBe('c1');
  });

  it('should return empty if no matches found', () => {
    const watchlistUris = ['https://boxd.it/unknown'];
    const { matchingMovies, relevantShowtimes } = findMatches(watchlistUris, mockData);
    
    expect(matchingMovies).toHaveLength(0);
    expect(relevantShowtimes).toHaveLength(0);
  });
});
