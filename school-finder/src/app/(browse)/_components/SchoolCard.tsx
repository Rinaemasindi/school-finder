'use client';

import Link from 'next/link';
import { SchoolDisplay } from '@/types/school';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, GraduationCap, Phone, CheckCircle2 } from 'lucide-react';

interface SchoolCardProps {
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

export function SchoolCard({ school }: SchoolCardProps) {
  return (
    <Link href={`/school/${school.id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base sm:text-lg line-clamp-2">
              {cleanSchoolName(school.name)}
            </CardTitle>
            {school.verified && (
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            )}
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            <Badge variant={school.sector === 'PUBLIC' ? 'default' : 'secondary'} className="text-xs">
              {school.sector}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {school.phase}
            </Badge>
            {school.quintile && (
              <Badge variant="outline" className="text-xs">
                {school.quintile}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="line-clamp-1">{school.city || 'Unknown'}, {school.province}</span>
          </div>
          {school.learners && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4 flex-shrink-0" />
              <span>{school.learners.toLocaleString('en-US')} learners</span>
            </div>
          )}
          {school.educators && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <GraduationCap className="h-4 w-4 flex-shrink-0" />
              <span>{school.educators} educators</span>
            </div>
          )}
          {school.telephone && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4 flex-shrink-0" />
              <span className="text-xs">{school.telephone}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
