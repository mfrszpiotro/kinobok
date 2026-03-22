"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Dynamically import the map component to avoid SSR issues with Leaflet
const CinemaMap = dynamic(() => import("../components/CinemaMap"), {
  ssr: false,
});
const MatchSidebar = dynamic(() => import("../components/MatchSidebar"), {
  ssr: false,
});

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [highlightedCinemaIds, setHighlightedCinemaIds] = useState<string[]>(
    [],
  );

  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((json) => setData(json));
  }, []);

  if (!data) return <div>Loading kinꚘbok Warsaw...</div>;

  return (
    <main style={{ height: "100vh", width: "100vw", display: "flex" }}>
      <MatchSidebar data={data} onMatchesFound={setHighlightedCinemaIds} />
      <div style={{ flex: 1 }}>
        <CinemaMap
          cinemas={data.cinemas}
          highlightedCinemaIds={highlightedCinemaIds}
        />
      </div>
    </main>
  );
}
