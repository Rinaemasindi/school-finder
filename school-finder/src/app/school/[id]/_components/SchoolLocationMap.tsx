'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Fix for default marker icons in Next.js
// Only initialize on client side
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
}

interface SchoolLocationMapProps {
  latitude: number;
  longitude: number;
  schoolName: string;
}

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, 15);
  }, [center, map]);

  return null;
}

export function SchoolLocationMap({ latitude, longitude, schoolName }: SchoolLocationMapProps) {
  const position: [number, number] = [latitude, longitude];

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Location</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full rounded-lg overflow-hidden border">
          <MapContainer
            center={position}
            zoom={15}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapUpdater center={position} />
            <Marker position={position}>
              <Popup>
                <div className="p-2">
                  <p className="font-semibold text-sm mb-1">{schoolName}</p>
                  <p className="text-xs text-muted-foreground">
                    {latitude.toFixed(6)}, {longitude.toFixed(6)}
                  </p>
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        </div>
        <div className="mt-3 text-sm text-muted-foreground">
          <p>
            <span className="font-medium">Coordinates:</span> {latitude.toFixed(6)}, {longitude.toFixed(6)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
