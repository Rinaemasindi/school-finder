'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { SchoolDisplay } from '@/types/school';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';

// Declare icons as variables that will be initialized client-side
let defaultIcon: L.Icon | null = null;
let selectedIcon: L.Icon | null = null;

// Initialize icons only on client side
if (typeof window !== 'undefined') {
  // Fix for default marker icons in Next.js
  delete (L.Icon.Default.prototype as any)._getIconUrl;

  // Create default blue icon
  defaultIcon = new L.Icon({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  // Create custom icon for selected school (red marker)
  selectedIcon = new L.Icon({
    iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  // Set default icon for L.Icon.Default
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
}

// Clean school name by removing special characters
function cleanSchoolName(name: string): string {
  // Remove special characters but keep letters, numbers, spaces, hyphens, apostrophes, and basic punctuation
  return name
    .replace(/[^\w\s'-.,()]/g, '') // Keep alphanumeric, spaces, hyphens, apostrophes, periods, commas, parentheses
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();
}

interface SchoolMapProps {
  schools: SchoolDisplay[];
  center: [number, number];
  zoom: number;
  onSchoolClick?: (school: SchoolDisplay) => void;
  selectedSchoolId?: string;
}

function MapUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);

  return null;
}

export function SchoolMap({ schools, center, zoom, onSchoolClick, selectedSchoolId }: SchoolMapProps) {
  return (
    <div className="h-[400px] sm:h-[500px] lg:h-[600px] w-full rounded-lg overflow-hidden border relative z-0">
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

        {schools.map((school) => {
          // Skip schools without coordinates
          if (!school.latitude || !school.longitude) return null;

          // Validate South African coordinates
          // Latitude should be negative (Southern Hemisphere: -22° to -35°)
          // Longitude should be positive (Eastern Hemisphere: 16° to 33°)
          const isValidCoordinate =
            school.latitude < 0 &&
            school.latitude >= -35 &&
            school.latitude <= -22 &&
            school.longitude > 0 &&
            school.longitude >= 16 &&
            school.longitude <= 33;

          if (!isValidCoordinate) return null;

          const isSelected = school.id === selectedSchoolId;

          return (
            <Marker
              key={school.id}
              position={[school.latitude, school.longitude]}
              icon={isSelected ? (selectedIcon || undefined) : (defaultIcon || undefined)}
              eventHandlers={{
                click: () => {
                  if (onSchoolClick) {
                    onSchoolClick(school);
                  }
                },
              }}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <Link
                    href={`/school/${school.id}`}
                    className="font-semibold hover:text-primary text-sm block mb-2 flex items-center gap-1.5"
                  >
                    {cleanSchoolName(school.name)}
                    <ExternalLink className="h-3.5 w-3.5 flex-shrink-0" />
                  </Link>
                  <div className="flex flex-wrap gap-1 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {school.sector}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {school.phase}
                    </Badge>
                  </div>
                  {school.learners && (
                    <p className="text-xs text-muted-foreground mb-1">
                      {school.learners.toLocaleString('en-US')} learners
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {school.city || 'Unknown'}, {school.province}
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
