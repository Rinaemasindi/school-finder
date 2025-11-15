'use client';

import { useState, useEffect } from 'react';
import { SchoolDisplay, toSchoolDisplay } from '@/types/school';
import { SchoolCard } from '../(browse)/_components/SchoolCard';
import { AdvancedFilters } from '../(browse)/_components/AdvancedFilters';
import { Pagination } from '../(browse)/_components/Pagination';

export default function BrowsePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('all');
  const [selectedPhase, setSelectedPhase] = useState('all');
  const [selectedQuintile, setSelectedQuintile] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedMunicipality, setSelectedMunicipality] = useState('all');
  const [selectedTownship, setSelectedTownship] = useState('all');
  const [selectedSuburb, setSelectedSuburb] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedProvince, setSelectedProvince] = useState('all');
  const [feeStatus, setFeeStatus] = useState('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [schools, setSchools] = useState<SchoolDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedSector, selectedPhase, selectedQuintile, selectedDistrict,
      selectedMunicipality, selectedTownship, selectedSuburb, selectedCity, selectedProvince,
      feeStatus, verifiedOnly]);

  // Fetch schools when filters or page change
  useEffect(() => {
    const fetchSchools = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (selectedSector !== 'all') params.append('sector', selectedSector);
        if (selectedPhase !== 'all') params.append('phase', selectedPhase);
        if (selectedQuintile !== 'all') params.append('quintile', selectedQuintile);
        if (selectedDistrict !== 'all') params.append('district', selectedDistrict);
        if (selectedMunicipality !== 'all') params.append('municipality', selectedMunicipality);
        if (selectedTownship !== 'all') params.append('township', selectedTownship);
        if (selectedSuburb !== 'all') params.append('suburb', selectedSuburb);
        if (selectedCity !== 'all') params.append('townCity', selectedCity);
        if (selectedProvince !== 'all') params.append('province', selectedProvince);
        if (feeStatus !== 'all') params.append('feeStatus', feeStatus);
        if (verifiedOnly) params.append('verified', 'true');
        params.append('page', currentPage.toString());
        params.append('limit', '100');

        const response = await fetch(`/api/schools?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch schools');

        const data = await response.json();
        const displaySchools = data.schools.map(toSchoolDisplay);
        setSchools(displaySchools);
        setTotalCount(data.pagination.total);
        setTotalPages(data.pagination.totalPages);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load schools');
      } finally {
        setLoading(false);
      }
    };

    fetchSchools();
  }, [searchTerm, selectedSector, selectedPhase, selectedQuintile, selectedDistrict,
      selectedMunicipality, selectedTownship, selectedSuburb, selectedCity, selectedProvince,
      feeStatus, verifiedOnly, currentPage]);

  const handleReset = () => {
    setSearchTerm('');
    setSelectedSector('all');
    setSelectedPhase('all');
    setSelectedQuintile('all');
    setSelectedDistrict('all');
    setSelectedMunicipality('all');
    setSelectedTownship('all');
    setSelectedSuburb('all');
    setSelectedCity('all');
    setSelectedProvince('all');
    setFeeStatus('all');
    setVerifiedOnly(false);
    setCurrentPage(1);
  };

  return (
    <div className="container px-4 py-3 sm:py-4 max-w-7xl mx-auto pb-20 md:pb-8">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
          Browse Schools
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Explore and filter South African schools
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <AdvancedFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedSector={selectedSector}
          onSectorChange={setSelectedSector}
          selectedPhase={selectedPhase}
          onPhaseChange={setSelectedPhase}
          selectedQuintile={selectedQuintile}
          onQuintileChange={setSelectedQuintile}
          selectedDistrict={selectedDistrict}
          onDistrictChange={setSelectedDistrict}
          selectedMunicipality={selectedMunicipality}
          onMunicipalityChange={setSelectedMunicipality}
          selectedTownship={selectedTownship}
          onTownshipChange={setSelectedTownship}
          selectedSuburb={selectedSuburb}
          onSuburbChange={setSelectedSuburb}
          selectedCity={selectedCity}
          onCityChange={setSelectedCity}
          selectedProvince={selectedProvince}
          onProvinceChange={setSelectedProvince}
          feeStatus={feeStatus}
          onFeeStatusChange={setFeeStatus}
          verifiedOnly={verifiedOnly}
          onVerifiedChange={setVerifiedOnly}
          onReset={handleReset}
          resultCount={totalCount}
        />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading schools...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <p className="text-destructive">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 text-primary hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Schools Grid */}
      {!loading && !error && schools.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
            {schools.map((school) => (
              <SchoolCard key={school.id} school={school} />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      {/* No Results */}
      {!loading && !error && schools.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-2">No schools found matching your criteria</p>
          <button
            onClick={handleReset}
            className="mt-4 text-primary hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
