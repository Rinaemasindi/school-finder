'use client';

import { use } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { mockSchools } from '@/data/mockSchools';
import { SchoolHeader } from './_components/SchoolHeader';
import { SchoolInfo } from './_components/SchoolInfo';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function SchoolDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);
  const school = mockSchools.find((s) => s.id === id);

  if (!school) {
    notFound();
  }

  return (
    <div className="container px-4 py-6 sm:py-8 max-w-7xl mx-auto">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        className="mb-4 -ml-2"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      {/* School Header */}
      <div className="mb-6 sm:mb-8">
        <SchoolHeader school={school} />
      </div>

      {/* School Information */}
      <SchoolInfo school={school} />

      {/* Location Coordinates Card */}
      <div className="mt-6 p-4 bg-muted rounded-lg">
        <h3 className="font-medium mb-2">Location Coordinates</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground">Latitude:</span>{' '}
            <span className="font-mono">{school.latitude}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Longitude:</span>{' '}
            <span className="font-mono">{school.longitude}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
