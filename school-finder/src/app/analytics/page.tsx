'use client';

import { useMemo } from 'react';
import { mockSchools } from '@/data/mockSchools';
import { StatsCards } from './_components/StatsCards';
import { AnalyticsCharts } from './_components/AnalyticsCharts';

export default function AnalyticsPage() {
  const analytics = useMemo(() => {
    const totalSchools = mockSchools.length;
    const verifiedSchools = mockSchools.filter((s) => s.verified).length;
    const totalLearners = mockSchools.reduce((sum, s) => sum + s.learners, 0);
    const totalEducators = mockSchools.reduce((sum, s) => sum + s.educators, 0);

    // Sector distribution
    const sectorCounts = mockSchools.reduce((acc, school) => {
      acc[school.sector] = (acc[school.sector] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const sectorData = Object.entries(sectorCounts).map(([name, value]) => ({
      name,
      value,
    }));

    // Phase distribution
    const phaseCounts = mockSchools.reduce((acc, school) => {
      const phase = school.phase.replace(' SCHOOL', '');
      acc[phase] = (acc[phase] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const phaseData = Object.entries(phaseCounts).map(([name, value]) => ({
      name,
      value,
    }));

    // Quintile distribution
    const quintileCounts = mockSchools.reduce((acc, school) => {
      if (school.quintile) {
        acc[school.quintile] = (acc[school.quintile] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const quintileData = Object.entries(quintileCounts)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([name, value]) => ({
        name,
        value,
      }));

    return {
      totalSchools,
      verifiedSchools,
      totalLearners,
      totalEducators,
      sectorData,
      phaseData,
      quintileData,
    };
  }, []);

  return (
    <div className="container px-4 py-6 sm:py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
          Analytics Dashboard
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Insights and statistics about South African schools
        </p>
      </div>

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
