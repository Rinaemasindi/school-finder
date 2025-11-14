'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { School } from '@/types/school';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

// Fix for default marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface SchoolMapProps {
  schools: School[];
  center: [number, number];
  zoom: number;
}

function MapUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);

  return null;
}

export function SchoolMap({ schools, center, zoom }: SchoolMapProps) {
  return (
    <div className="h-[400px] sm:h-[500px] lg:h-[600px] w-full rounded-lg overflow-hidden border">
      <MapContainer
        center={center}
        zoom={zoom}
        className="h-full w-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater center={center} zoom={zoom} />

        {schools.map((school) => (
          <Marker
            key={school.id}
            position={[school.latitude, school.longitude]}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <Link
                  href={`/school/${school.id}`}
                  className="font-semibold hover:text-primary text-sm block mb-2"
                >
                  {school.name}
                </Link>
                <div className="flex flex-wrap gap-1 mb-2">
                  <Badge variant="outline" className="text-xs">
                    {school.sector}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {school.phase}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-1">
                  {school.learners.toLocaleString('en-US')} learners
                </p>
                <p className="text-xs text-muted-foreground">
                  {school.city}, {school.province}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
