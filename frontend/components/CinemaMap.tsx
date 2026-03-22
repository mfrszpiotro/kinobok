'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import L from 'leaflet';

// Leaflet marker icons are notoriously tricky in Next.js
// We use unpkg as a reliable CDN for the default assets
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface CinemaMapProps {
  cinemas: Array<{
    id: string;
    name: string;
    address: string;
    coords?: {
      lat: number;
      lng: number;
    };
  }>;
}

export default function CinemaMap({ cinemas }: CinemaMapProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div style={{ height: '100%', width: '100%', background: '#eee' }}>Loading Map...</div>;
  }

  const warsawCenter: [number, number] = [52.2297, 21.0122];

  return (
    <MapContainer 
      center={warsawCenter} 
      zoom={13} 
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {cinemas.map((cinema) => (
        cinema.coords && (
          <Marker 
            key={cinema.id} 
            position={[cinema.coords.lat, cinema.coords.lng]}
          >
            <Popup>
              <strong>{cinema.name}</strong><br />
              {cinema.address}
            </Popup>
          </Marker>
        )
      ))}
    </MapContainer>
  );
}
