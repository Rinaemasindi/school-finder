'use client';

import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, X, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SchoolFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedSector: string;
  onSectorChange: (value: string) => void;
  selectedPhase: string;
  onPhaseChange: (value: string) => void;
  selectedQuintile: string;
  onQuintileChange: (value: string) => void;
  verifiedOnly: boolean;
  onVerifiedChange: (value: boolean) => void;
  onReset: () => void;
  resultCount: number;
}

export function SchoolFilters({
  searchTerm,
  onSearchChange,
  selectedSector,
  onSectorChange,
  selectedPhase,
  onPhaseChange,
  selectedQuintile,
  onQuintileChange,
  verifiedOnly,
  onVerifiedChange,
  onReset,
  resultCount,
}: SchoolFiltersProps) {
  const hasActiveFilters = selectedSector !== 'all' || selectedPhase !== 'all' ||
    selectedQuintile !== 'all' || verifiedOnly || searchTerm !== '';

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search schools..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Filter Grid - Mobile Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Sector Filter */}
          <div className="flex items-center gap-2">
            <Select value={selectedSector} onValueChange={onSectorChange}>
              <SelectTrigger className="flex-1 h-9 text-sm">
                <SelectValue placeholder="Sector" />
              </SelectTrigger>
              <SelectContent>
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

          {/* Phase Filter */}
          <div className="flex items-center gap-2">
            <Select value={selectedPhase} onValueChange={onPhaseChange}>
              <SelectTrigger className="flex-1 h-9 text-sm">
                <SelectValue placeholder="Phase" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Phases</SelectItem>
                <SelectItem value="PRIMARY SCHOOL">Primary</SelectItem>
                <SelectItem value="SECONDARY SCHOOL">Secondary</SelectItem>
              </SelectContent>
            </Select>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-1 hover:bg-accent rounded-sm flex-shrink-0">
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs" side="top">
                <p><strong>Primary:</strong> Grades R-7</p>
                <p><strong>Secondary:</strong> Grades 8-12</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Quintile Filter */}
          <div className="flex items-center gap-2">
            <Select value={selectedQuintile} onValueChange={onQuintileChange}>
              <SelectTrigger className="flex-1 h-9 text-sm">
                <SelectValue placeholder="Quintile" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Quintiles</SelectItem>
                <SelectItem value="Q1">Q1</SelectItem>
                <SelectItem value="Q2">Q2</SelectItem>
                <SelectItem value="Q3">Q3</SelectItem>
                <SelectItem value="Q4">Q4</SelectItem>
                <SelectItem value="Q5">Q5</SelectItem>
              </SelectContent>
            </Select>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-1 hover:bg-accent rounded-sm flex-shrink-0">
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs" side="top">
                <p>Poverty ranking: Q1 (poorest) to Q5 (wealthiest)</p>
                <p className="text-xs mt-1">Q1-Q3 are typically no-fee schools</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Verified Filter */}
          <div className="flex items-center gap-2">
            <Button
              variant={verifiedOnly ? 'default' : 'outline'}
              onClick={() => onVerifiedChange(!verifiedOnly)}
              className="flex-1 h-9 text-sm"
            >
              Verified Only
            </Button>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-1 hover:bg-accent rounded-sm flex-shrink-0">
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs" side="top">
                <p>Schools with officially verified information</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

      {/* Active Filters and Results */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium">{resultCount}</span>
          <span>schools found</span>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="w-full sm:w-auto"
          >
            <X className="h-4 w-4 mr-1" />
            Clear Filters
          </Button>
        )}
      </div>
      </div>
    </TooltipProvider>
  );
}
