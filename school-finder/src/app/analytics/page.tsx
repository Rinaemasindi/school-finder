'use client';

import { useState, useEffect } from 'react';
import { StatsCards } from './_components/StatsCards';
import { AnalyticsCharts } from './_components/AnalyticsCharts';

interface AnalyticsData {
  totalSchools: number;
  verifiedSchools: number;
  totalLearners: number;
  totalEducators: number;
  sectorData: { name: string; value: number }[];
  phaseData: { name: string; value: number }[];
  quintileData: { name: string; value: number }[];
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/analytics');

        if (!response.ok) {
          throw new Error('Failed to fetch analytics');
        }

        const data = await response.json();

        setAnalytics({
          totalSchools: data.totals.schools,
          verifiedSchools: data.totals.verified,
          totalLearners: data.totals.learners,
          totalEducators: data.totals.educators,
          sectorData: data.distributions.sector,
          phaseData: data.distributions.phase,
          quintileData: data.distributions.quintile,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="container px-4 py-3 sm:py-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
          Analytics Dashboard
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Insights and statistics about South African schools
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-4 text-muted-foreground">Loading analytics...</p>
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

      {/* Analytics Content */}
      {analytics && !loading && !error && (
        <>
          {/* Stats Cards */}
          <div className="mb-8">
            <StatsCards
              totalSchools={analytics.totalSchools}
              verifiedSchools={analytics.verifiedSchools}
              totalLearners={analytics.totalLearners}
              totalEducators={analytics.totalEducators}
            />
          </div>

          {/* Charts */}
          <AnalyticsCharts
            sectorData={analytics.sectorData}
            phaseData={analytics.phaseData}
            quintileData={analytics.quintileData}
          />
        </>
      )}

      {/* Additional Info */}
      <div className="mt-8 p-4 sm:p-6 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2 text-sm sm:text-base">About this data</h3>
        <p className="text-sm text-muted-foreground">
          This analytics dashboard provides insights based on the school data from South Africa.
          Data includes information about school sectors, phases, quintiles, learner enrollment,
          and educator staffing levels.
        </p>
      </div>
    </div>
  );
}
