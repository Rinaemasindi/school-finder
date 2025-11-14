'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { mockSchools } from '@/data/mockSchools';
import { MapSearch } from './_components/MapSearch';
import { School } from '@/types/school';

// Dynamically import the map to avoid SSR issues with Leaflet
const SchoolMap = dynamic(
  () => import('./_components/SchoolMap').then((mod) => mod.SchoolMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-[400px] sm:h-[500px] lg:h-[600px] w-full rounded-lg border flex items-center justify-center bg-muted">
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    ),
  }
);

export default function FindSchoolsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedSector, setSelectedSector] = useState('all');
  const [mapCenter, setMapCenter] = useState<[number, number]>([-33.0, 25.0]); // Eastern Cape center
  const [mapZoom, setMapZoom] = useState(7);

  const filteredSchools = useMemo(() => {
    return mockSchools.filter((school) => {
      const matchesCity = selectedCity === 'all' || school.city === selectedCity;
      const matchesSector = selectedSector === 'all' || school.sector === selectedSector;

      return matchesCity && matchesSector;
    });
  }, [selectedCity, selectedSector]);

  const handleSchoolSelect = (school: School) => {
    setMapCenter([school.latitude, school.longitude]);
    setMapZoom(15);
    setSearchTerm('');
  };

  return (
    <div className="container px-4 py-6 sm:py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
          Find Schools
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Search for schools by location and explore them on the map
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <MapSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCity={selectedCity}
          onCityChange={setSelectedCity}
          selectedSector={selectedSector}
          onSectorChange={setSelectedSector}
          schools={mockSchools}
          onSchoolSelect={handleSchoolSelect}
        />
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-muted-foreground">
        Showing <span className="font-medium">{filteredSchools.length}</span> schools
      </div>

      {/* Map */}
      <SchoolMap schools={filteredSchools} center={mapCenter} zoom={mapZoom} />

      {/* Mobile-friendly instructions */}
      <div className="mt-4 p-4 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium">Tip:</span> Click on markers to view school details, or search above to find specific schools
        </p>
      </div>
    </div>
  );
}
