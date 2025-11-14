'use client';

import { useState, useMemo } from 'react';
import { mockSchools } from '@/data/mockSchools';
import { SchoolCard } from './(browse)/_components/SchoolCard';
import { SchoolFilters } from './(browse)/_components/SchoolFilters';

export default function BrowsePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('all');
  const [selectedPhase, setSelectedPhase] = useState('all');
  const [selectedQuintile, setSelectedQuintile] = useState('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const filteredSchools = useMemo(() => {
    return mockSchools.filter((school) => {
      const matchesSearch = school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.municipality.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSector = selectedSector === 'all' || school.sector === selectedSector;
      const matchesPhase = selectedPhase === 'all' || school.phase === selectedPhase;
      const matchesQuintile = selectedQuintile === 'all' || school.quintile === selectedQuintile;
      const matchesVerified = !verifiedOnly || school.verified;

      return matchesSearch && matchesSector && matchesPhase && matchesQuintile && matchesVerified;
    });
  }, [searchTerm, selectedSector, selectedPhase, selectedQuintile, verifiedOnly]);

  const handleReset = () => {
    setSearchTerm('');
    setSelectedSector('all');
    setSelectedPhase('all');
    setSelectedQuintile('all');
    setVerifiedOnly(false);
  };

  return (
    <div className="container px-4 py-6 sm:py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
          Browse Schools
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Explore South African schools and verify their information
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <SchoolFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedSector={selectedSector}
          onSectorChange={setSelectedSector}
          selectedPhase={selectedPhase}
          onPhaseChange={setSelectedPhase}
          selectedQuintile={selectedQuintile}
          onQuintileChange={setSelectedQuintile}
          verifiedOnly={verifiedOnly}
          onVerifiedChange={setVerifiedOnly}
          onReset={handleReset}
          resultCount={filteredSchools.length}
        />
      </div>

      {/* Schools Grid - Mobile First Responsive */}
      {filteredSchools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredSchools.map((school) => (
            <SchoolCard key={school.id} school={school} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No schools found matching your criteria</p>
          <button
            onClick={handleReset}
            className="mt-4 text-primary hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
