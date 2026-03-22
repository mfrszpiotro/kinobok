'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Dynamically import the map component to avoid SSR issues with Leaflet
const CinemaMap = dynamic(() => import('../components/CinemaMap'), { ssr: false });

export default function Home() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/data.json')
      .then((res) => res.json())
      .then((json) => setData(json));
  }, []);

  if (!data) return <div>Loading Kinobok Warsaw...</div>;

  return (
    <main style={{ height: '100vh', width: '100vw' }}>
      <CinemaMap cinemas={data.cinemas} />
    </main>
  );
}
