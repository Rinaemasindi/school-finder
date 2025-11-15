'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { SchoolDisplay, toSchoolDisplay } from '@/types/school';
import { SchoolHeader } from './_components/SchoolHeader';
import { SchoolInfo } from './_components/SchoolInfo';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

// Dynamically import the map to avoid SSR issues with Leaflet
const SchoolLocationMap = dynamic(
  () => import('./_components/SchoolLocationMap').then((mod) => mod.SchoolLocationMap),
  {
    ssr: false,
    loading: () => (
      <div className="mt-6 h-[400px] w-full rounded-lg border flex items-center justify-center bg-muted">
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    ),
  }
);

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function SchoolDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);
  const [school, setSchool] = useState<SchoolDisplay | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchool = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/schools/${id}`);

        if (response.status === 404) {
          router.push('/404');
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch school');
        }

        const data = await response.json();
        setSchool(toSchoolDisplay(data));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchSchool();
  }, [id, router]);

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

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-4 text-muted-foreground">Loading school details...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      )}

      {/* School Content */}
      {school && !loading && !error && (
        <>
          {/* School Header */}
          <div className="mb-6 sm:mb-8">
            <SchoolHeader school={school} />
          </div>

          {/* School Information */}
          <SchoolInfo school={school} />

          {/* Location Map */}
          {school.latitude && school.longitude && (
            <SchoolLocationMap
              latitude={school.latitude}
              longitude={school.longitude}
              schoolName={school.name}
            />
          )}
        </>
      )}
    </div>
  );
}
