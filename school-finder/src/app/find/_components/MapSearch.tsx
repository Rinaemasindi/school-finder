'use client';

import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Search, MapPin, HelpCircle } from 'lucide-react';
import { SchoolDisplay } from '@/types/school';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface MapSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedSector: string;
  onSectorChange: (value: string) => void;
  schools: SchoolDisplay[];
  onSchoolSelect: (school: SchoolDisplay) => void;
}

// Clean school name by removing special characters
function cleanSchoolName(name: string): string {
  // Remove special characters but keep letters, numbers, spaces, hyphens, apostrophes, and basic punctuation
  return name
    .replace(/[^\w\s'-.,()]/g, '') // Keep alphanumeric, spaces, hyphens, apostrophes, periods, commas, parentheses
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();
}

export function MapSearch({
  searchTerm,
  onSearchChange,
  selectedSector,
  onSectorChange,
  schools,
  onSchoolSelect,
}: MapSearchProps) {
  // Show top results from API search
  const filteredSuggestions = searchTerm ? schools.slice(0, 10) : [];

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, address, municipality..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />

          {/* Search Suggestions */}
          {searchTerm && filteredSuggestions.length > 0 && (
            <Card className="absolute top-full mt-2 w-full z-[1000] p-2 max-h-[300px] overflow-y-auto">
              {filteredSuggestions.map((school) => (
                <button
                  key={school.id}
                  onClick={() => onSchoolSelect(school)}
                  className="w-full text-left px-3 py-2 hover:bg-accent rounded-md transition-colors"
                >
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{cleanSchoolName(school.name)}</p>
                      <p className="text-xs text-muted-foreground">
                        {school.city || 'Unknown'}, {school.province}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </Card>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <Select value={selectedSector} onValueChange={onSectorChange}>
            <SelectTrigger className="flex-1 h-9 text-sm">
              <SelectValue placeholder="Sector" />
            </SelectTrigger>
            <SelectContent className="z-[1000]">
              <SelectItem value="all">All Sectors</SelectItem>
              <SelectItem value="PUBLIC">Public</SelectItem>
              <SelectItem value="INDEPENDENT">Independent</SelectItem>
            </SelectContent>
          </Select>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="p-1 hover:bg-accent rounded-sm flex-shrink-0">
                <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs" side="top">
              <p><strong>Public:</strong> Government-funded schools</p>
              <p><strong>Independent:</strong> Private schools</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}
