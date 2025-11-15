'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { SchoolDisplay, toSchoolDisplay } from '@/types/school';
import { Input } from '@/components/ui/input';
import { Search, Loader2, MapPin, X } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<SchoolDisplay[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<SchoolDisplay | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-26.2041, 28.0473]); // Gauteng center
  const [mapZoom, setMapZoom] = useState(10);
  const [locationRequested, setLocationRequested] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const [schools, setSchools] = useState<SchoolDisplay[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clickedSchool, setClickedSchool] = useState<SchoolDisplay | null>(null);

  // Request user location on mount and load nearby schools
  useEffect(() => {
    if (!locationRequested && 'geolocation' in navigator) {
      setLocationRequested(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter([latitude, longitude]);
          setMapZoom(12);

          // Load schools near user's location
          setLoading(true);
          try {
            const latDelta = 0.1; // ~11km radius
            const lngDelta = 0.1;
            const bounds = `${latitude - latDelta},${longitude - lngDelta},${latitude + latDelta},${longitude + lngDelta}`;

            const params = new URLSearchParams();
            params.append('bounds', bounds);
            params.append('limit', '100');

            const response = await fetch(`/api/schools?${params.toString()}`);
            if (response.ok) {
              const data = await response.json();
              const displaySchools = data.schools
                .map(toSchoolDisplay)
                .filter((s: SchoolDisplay) => s.latitude && s.longitude);
              setSchools(displaySchools);
            }
          } catch (err) {
            console.error('Failed to load schools near user location:', err);
          } finally {
            setLoading(false);
          }
        },
        async (error) => {
          console.log('Location denied, loading Gauteng schools:', error.message);

          // Load Gauteng schools (default center: -26.2041, 28.0473)
          setLoading(true);
          try {
            const latDelta = 0.2; // Wider radius for Gauteng
            const lngDelta = 0.2;
            const bounds = `${-26.2041 - latDelta},${28.0473 - lngDelta},${-26.2041 + latDelta},${28.0473 + lngDelta}`;

            const params = new URLSearchParams();
            params.append('bounds', bounds);
            params.append('limit', '100');

            const response = await fetch(`/api/schools?${params.toString()}`);
            if (response.ok) {
              const data = await response.json();
              const displaySchools = data.schools
                .map(toSchoolDisplay)
                .filter((s: SchoolDisplay) => s.latitude && s.longitude);
              setSchools(displaySchools);
            }
          } catch (err) {
            console.error('Failed to load Gauteng schools:', err);
          } finally {
            setLoading(false);
          }
        }
      );
    }
  }, [locationRequested]);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounce search term for suggestions
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch suggestions when user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedSearchTerm.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setLoadingSuggestions(true);
      try {
        const params = new URLSearchParams();
        params.append('search', debouncedSearchTerm);
        params.append('limit', '10');

        const response = await fetch(`/api/schools?${params.toString()}`);
        if (response.ok) {
          const data = await response.json();
          const displaySchools = data.schools
            .map(toSchoolDisplay)
            .filter((s: SchoolDisplay) => s.latitude && s.longitude);
          setSuggestions(displaySchools);
          setShowSuggestions(true);
        }
      } catch (err) {
        console.error('Failed to fetch suggestions:', err);
      } finally {
        setLoadingSuggestions(false);
      }
    };

    fetchSuggestions();
  }, [debouncedSearchTerm]);

  // Load nearby schools when a school is selected
  const handleSchoolSelect = async (school: SchoolDisplay) => {
    setSelectedSchool(school);
    setSearchTerm('');
    setShowSuggestions(false);

    if (school.latitude && school.longitude) {
      setMapCenter([school.latitude, school.longitude]);
      setMapZoom(13);

      // Load nearby schools (within ~10km radius)
      setLoading(true);
      try {
        const latDelta = 0.1; // ~11km
        const lngDelta = 0.1;
        const bounds = `${school.latitude - latDelta},${school.longitude - lngDelta},${school.latitude + latDelta},${school.longitude + lngDelta}`;

        const params = new URLSearchParams();
        params.append('bounds', bounds);
        params.append('limit', '100');

        const response = await fetch(`/api/schools?${params.toString()}`);
        if (response.ok) {
          const data = await response.json();
          const displaySchools = data.schools
            .map(toSchoolDisplay)
            .filter((s: SchoolDisplay) => s.latitude && s.longitude);
          setSchools(displaySchools);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load schools');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="container px-4 py-3 sm:py-4 max-w-7xl mx-auto pb-20 md:pb-8">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
          Find Schools
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Search for a school to see it on the map with nearby schools
        </p>
      </div>

      {/* Search with Suggestions */}
      <div ref={searchRef} className="relative mb-6 z-[1000]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for a school by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => {
              if (suggestions.length > 0) setShowSuggestions(true);
            }}
            className="pl-9 pr-9 bg-background relative z-[1001]"
          />
          {loadingSuggestions && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground z-[1002]" />
          )}
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-[1100] w-full mt-2 bg-background border rounded-lg shadow-lg max-h-96 overflow-y-auto">
            {suggestions.map((school) => (
              <button
                key={school.id}
                onClick={() => handleSchoolSelect(school)}
                className="w-full text-left px-4 py-3 hover:bg-accent border-b last:border-b-0 transition-colors"
              >
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{school.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {school.city && `${school.city}, `}{school.province}
                    </p>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded">
                        {school.sector}
                      </span>
                      {school.phase && (
                        <span className="text-xs px-1.5 py-0.5 bg-muted text-muted-foreground rounded">
                          {school.phase}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* No results message */}
        {showSuggestions && !loadingSuggestions && searchTerm.length >= 2 && suggestions.length === 0 && (
          <div className="absolute z-[1100] w-full mt-2 bg-background border rounded-lg shadow-lg p-4">
            <p className="text-sm text-muted-foreground">No schools found matching "{searchTerm}"</p>
          </div>
        )}
      </div>

      {/* Selected School Info */}
      {selectedSchool && (
        <div className="mb-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <p className="text-sm font-medium mb-1">Showing: {selectedSchool.name}</p>
          <p className="text-xs text-muted-foreground">
            {selectedSchool.city && `${selectedSchool.city}, `}{selectedSchool.province} • {schools.length} nearby schools
          </p>
        </div>
      )}

      {/* Nearby Schools Info (when no specific school selected) */}
      {!selectedSchool && schools.length > 0 && !loading && (
        <div className="mb-4 p-4 bg-muted/50 border rounded-lg">
          <p className="text-sm font-medium mb-1">Nearby Schools</p>
          <p className="text-xs text-muted-foreground">
            Showing {schools.length} schools in your area
          </p>
        </div>
      )}

      {/* Map */}
      {loading && (
        <div className="h-[400px] sm:h-[500px] lg:h-[600px] w-full rounded-lg border flex items-center justify-center bg-muted">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
            <p className="text-muted-foreground">Loading schools...</p>
          </div>
        </div>
      )}

      {!loading && schools.length > 0 && (
        <>
          <SchoolMap
            schools={schools}
            center={mapCenter}
            zoom={mapZoom}
            onSchoolClick={setClickedSchool}
            selectedSchoolId={selectedSchool?.id}
          />
          <div className="mt-3 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <p>Click on the map pins to view school details</p>
          </div>
        </>
      )}

      {!loading && schools.length === 0 && (
        <div className="h-[400px] sm:h-[500px] lg:h-[600px] w-full rounded-lg border flex items-center justify-center bg-muted/50">
          <div className="text-center px-4">
            <MapPin className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-muted-foreground font-medium mb-1">No schools found in this area</p>
            <p className="text-sm text-muted-foreground/70">Try searching for a specific school above</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}
    </div>
  );
}
