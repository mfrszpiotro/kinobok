"use client";

import { useState } from "react";
import { parseWatchlist } from "../utils/csv_parser";

interface Movie {
  id: string;
  title: string;
  boxd_uri: string;
}

interface Cinema {
  id: string;
  name: string;
}

interface Showtime {
  movie_id: string;
  cinema_id: string;
  times: string[];
}

interface Data {
  movies: Movie[];
  cinemas: Cinema[];
  showtimes: Showtime[];
}

interface MatchSidebarProps {
  data: Data;
  onMatchesFound: (matchedCinemaIds: string[]) => void;
}

export default function MatchSidebar({
  data,
  onMatchesFound,
}: MatchSidebarProps) {
  const [matches, setMatches] = useState<any[]>([]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const watchlistUris = parseWatchlist(text);

    const matchingMovies = data.movies.filter((movie) =>
      watchlistUris.includes(movie.boxd_uri),
    );
    const matchedMovieIds = new Set(matchingMovies.map((m) => m.id));

    const relevantShowtimes = data.showtimes.filter((s) =>
      matchedMovieIds.has(s.movie_id),
    );
    const matchedCinemaIds = Array.from(
      new Set(relevantShowtimes.map((s) => s.cinema_id)),
    );

    setMatches(
      matchingMovies.map((movie) => ({
        ...movie,
        showtimes: relevantShowtimes
          .filter((s) => s.movie_id === movie.id)
          .map((s) => ({
            cinema: data.cinemas.find((c) => c.id === s.cinema_id)?.name,
            times: s.times,
          })),
      })),
    );

    onMatchesFound(matchedCinemaIds);
  };

  return (
    <div
      style={{
        width: "350px",
        height: "100%",
        background: "#fff",
        padding: "20px",
        overflowY: "auto",
        borderRight: "1px solid #ccc",
      }}
    >
      <h2>kinꚘbok Warsaw</h2>
      <p>
        Upload your Letterboxd watchlist (CSV) to find matches in Warsaw
        cinemas.
      </p>

      <input type="file" accept=".csv" onChange={handleFileUpload} />

      {matches.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Matches Found</h3>
          {matches.map((match) => (
            <div
              key={match.id}
              style={{
                marginBottom: "15px",
                borderBottom: "1px solid #eee",
                paddingBottom: "10px",
              }}
            >
              <strong>{match.title}</strong>
              <div style={{ fontSize: "0.9em", color: "#666" }}>
                {match.showtimes.map((s: any, idx: number) => (
                  <div key={idx}>
                    {s.cinema}: {s.times.join(", ")}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
