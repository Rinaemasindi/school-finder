'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, X, Check, ChevronsUpDown, Filter, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface FilterOptions {
  sectors: string[];
  phases: string[];
  quintiles: string[];
  districts: string[];
  townships: string[];
  municipalities: string[];
  suburbs: string[];
  cities: string[];
  provinces: string[];
}

interface AdvancedFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedSector: string;
  onSectorChange: (value: string) => void;
  selectedPhase: string;
  onPhaseChange: (value: string) => void;
  selectedQuintile: string;
  onQuintileChange: (value: string) => void;
  selectedDistrict: string;
  onDistrictChange: (value: string) => void;
  selectedMunicipality: string;
  onMunicipalityChange: (value: string) => void;
  selectedTownship: string;
  onTownshipChange: (value: string) => void;
  selectedSuburb: string;
  onSuburbChange: (value: string) => void;
  selectedCity: string;
  onCityChange: (value: string) => void;
  selectedProvince: string;
  onProvinceChange: (value: string) => void;
  feeStatus: string;
  onFeeStatusChange: (value: string) => void;
  verifiedOnly: boolean;
  onVerifiedChange: (value: boolean) => void;
  onReset: () => void;
  resultCount: number;
}

function SearchableSelect({
  value,
  onValueChange,
  options,
  placeholder,
  emptyText = 'No results found',
}: {
  value: string;
  onValueChange: (value: string) => void;
  options: string[];
  placeholder: string;
  emptyText?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-9 text-sm font-normal"
        >
          {value && value !== 'all'
            ? options.find((option) => option === value) || placeholder
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput placeholder={`Search ${placeholder.toLowerCase()}...`} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              <CommandItem
                value="all"
                onSelect={() => {
                  onValueChange('all');
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    value === 'all' ? 'opacity-100' : 'opacity-0'
                  )}
                />
                All
              </CommandItem>
              {options.map((option) => (
                <CommandItem
                  key={option}
                  value={option}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === option ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {option}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export function AdvancedFilters({
  searchTerm,
  onSearchChange,
  selectedSector,
  onSectorChange,
  selectedPhase,
  onPhaseChange,
  selectedQuintile,
  onQuintileChange,
  selectedDistrict,
  onDistrictChange,
  selectedMunicipality,
  onMunicipalityChange,
  selectedTownship,
  onTownshipChange,
  selectedSuburb,
  onSuburbChange,
  selectedCity,
  onCityChange,
  selectedProvince,
  onProvinceChange,
  feeStatus,
  onFeeStatusChange,
  verifiedOnly,
  onVerifiedChange,
  onReset,
  resultCount,
}: AdvancedFiltersProps) {
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    sectors: [],
    phases: [],
    quintiles: [],
    districts: [],
    townships: [],
    municipalities: [],
    suburbs: [],
    cities: [],
    provinces: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await fetch('/api/filter-options');
        if (response.ok) {
          const data = await response.json();
          setFilterOptions(data);
        }
      } catch (error) {
        console.error('Failed to fetch filter options:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilterOptions();
  }, []);

  const hasActiveFilters =
    selectedSector !== 'all' ||
    selectedPhase !== 'all' ||
    selectedQuintile !== 'all' ||
    selectedDistrict !== 'all' ||
    selectedMunicipality !== 'all' ||
    selectedTownship !== 'all' ||
    selectedSuburb !== 'all' ||
    selectedCity !== 'all' ||
    selectedProvince !== 'all' ||
    feeStatus !== 'all' ||
    verifiedOnly ||
    searchTerm !== '';

  const activeFilterCount = [
    selectedSector !== 'all',
    selectedPhase !== 'all',
    selectedQuintile !== 'all',
    selectedDistrict !== 'all',
    selectedMunicipality !== 'all',
    selectedTownship !== 'all',
    selectedSuburb !== 'all',
    selectedCity !== 'all',
    selectedProvince !== 'all',
    feeStatus !== 'all',
    verifiedOnly,
    searchTerm !== '',
  ].filter(Boolean).length;

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const FilterContent = () => (
    <div className="space-y-4">
      {/* Location Filters - Prioritized */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium">Location</h3>
          {[selectedProvince, selectedDistrict, selectedMunicipality, selectedTownship, selectedSuburb, selectedCity]
            .filter((v) => v !== 'all')
            .length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {[selectedProvince, selectedDistrict, selectedMunicipality, selectedTownship, selectedSuburb, selectedCity]
                .filter((v) => v !== 'all')
                .length}
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Province - Prioritized */}
          <SearchableSelect
            value={selectedProvince}
            onValueChange={onProvinceChange}
            options={filterOptions.provinces}
            placeholder="Province"
          />

          <SearchableSelect
            value={selectedDistrict}
            onValueChange={onDistrictChange}
            options={filterOptions.districts}
            placeholder="District"
          />

          <SearchableSelect
            value={selectedMunicipality}
            onValueChange={onMunicipalityChange}
            options={filterOptions.municipalities}
            placeholder="Municipality"
          />

          <SearchableSelect
            value={selectedTownship}
            onValueChange={onTownshipChange}
            options={filterOptions.townships}
            placeholder="Township"
          />

          <SearchableSelect
            value={selectedSuburb}
            onValueChange={onSuburbChange}
            options={filterOptions.suburbs}
            placeholder="Suburb"
          />

          <SearchableSelect
            value={selectedCity}
            onValueChange={onCityChange}
            options={filterOptions.cities}
            placeholder="Town/City"
          />
        </div>
      </div>

      {/* More Filters - Collapsible */}
      <details className="group">
        <summary className="flex items-center gap-2 cursor-pointer text-sm font-medium hover:text-primary">
          <span>More Filters</span>
          <Badge variant="secondary" className="text-xs">
            {[selectedSector !== 'all', selectedPhase !== 'all', selectedQuintile !== 'all', feeStatus !== 'all', verifiedOnly]
              .filter(Boolean)
              .length}
          </Badge>
        </summary>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
          <SearchableSelect
            value={selectedSector}
            onValueChange={onSectorChange}
            options={filterOptions.sectors}
            placeholder="Sector"
          />

          <SearchableSelect
            value={selectedPhase}
            onValueChange={onPhaseChange}
            options={filterOptions.phases}
            placeholder="Phase"
          />

          <SearchableSelect
            value={selectedQuintile}
            onValueChange={onQuintileChange}
            options={filterOptions.quintiles}
            placeholder="Quintile"
          />

          <SearchableSelect
            value={feeStatus}
            onValueChange={onFeeStatusChange}
            options={['free', 'paid']}
            placeholder="Fee Status"
          />

          <Button
            variant={verifiedOnly ? 'default' : 'outline'}
            onClick={() => onVerifiedChange(!verifiedOnly)}
            className="h-9 text-sm"
          >
            Verified
          </Button>
        </div>
      </details>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Search and Mobile Filter Button */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search schools by name, location, or postal address..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Mobile Filter Button */}
        <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden flex-shrink-0">
              <SlidersHorizontal className="h-4 w-4" />
              {activeFilterCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh]">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-4 overflow-y-auto h-[calc(100%-60px)]">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Filters */}
      <div className="hidden lg:block">
        <FilterContent />
      </div>

      {/* Active Filters and Results */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium">{resultCount.toLocaleString()}</span>
          <span>schools found</span>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFilterCount} {activeFilterCount === 1 ? 'filter' : 'filters'} active
            </Badge>
          )}
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onReset}
            title="Clear filters"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
