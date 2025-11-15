'use client';

import { SchoolDisplay } from '@/types/school';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface SchoolHeaderProps {
  school: SchoolDisplay;
}

// Clean school name by removing special characters
function cleanSchoolName(name: string): string {
  // Remove special characters but keep letters, numbers, spaces, hyphens, apostrophes, and basic punctuation
  return name
    .replace(/[^\w\s'-.,()]/g, '') // Keep alphanumeric, spaces, hyphens, apostrophes, periods, commas, parentheses
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();
}

export function SchoolHeader({ school }: SchoolHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
            {cleanSchoolName(school.name)}
          </h1>
          <p className="text-muted-foreground">
            {school.city || 'Unknown'}, {school.province}
          </p>
        </div>
        <div className="flex items-center gap-2 self-start">
          {school.verified ? (
            <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-4 py-2 rounded-full">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium text-sm">Verified</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 px-4 py-2 rounded-full">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium text-sm">Unverified</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge variant={school.sector === 'PUBLIC' ? 'default' : 'secondary'}>
          {school.sector}
        </Badge>
        <Badge variant="outline">{school.phase}</Badge>
        {school.quintile && <Badge variant="outline">{school.quintile}</Badge>}
        <Badge variant="outline">{school.type}</Badge>
        {school.examCentre && (
          <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20">
            Exam Centre
          </Badge>
        )}
      </div>
    </div>
  );
}
