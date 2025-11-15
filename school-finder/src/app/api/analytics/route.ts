import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get total counts
    const totalSchools = await prisma.school.count();

    const totalLearners = await prisma.school.aggregate({
      _sum: {
        learners2019: true,
      },
    });

    const totalEducators = await prisma.school.aggregate({
      _sum: {
        educator2019: true,
      },
    });

    // Get sector distribution
    const sectorDistribution = await prisma.school.groupBy({
      by: ['sector'],
      _count: {
        sector: true,
      },
    });

    // Filter and normalize sector values to only show PUBLIC and INDEPENDENT
    const normalizeSector = (s: string | null): string | null => {
      if (!s) return null;
      const trimmed = s.trim().toUpperCase();
      if (trimmed === 'PUBLIC' || trimmed === 'INDEPENDENT') {
        return trimmed.charAt(0) + trimmed.slice(1).toLowerCase(); // Capitalize first letter
      }
      return null; // Exclude other sectors
    };

    // Group normalized sectors
    const normalizedSectors = sectorDistribution.reduce((acc, item) => {
      const normalized = normalizeSector(item.sector);
      if (normalized) { // Only include PUBLIC and INDEPENDENT
        const existing = acc.find(x => x.name === normalized);
        if (existing) {
          existing.value += item._count.sector;
        } else {
          acc.push({ name: normalized, value: item._count.sector });
        }
      }
      return acc;
    }, [] as Array<{ name: string; value: number }>);

    // Get phase distribution
    const phaseDistribution = await prisma.school.groupBy({
      by: ['phasePED'],
      _count: {
        phasePED: true,
      },
    });

    // Filter and normalize phase values to only show PRIMARY SCHOOL and SECONDARY SCHOOL
    const normalizePhase = (p: string | null): string | null => {
      if (!p) return null;
      const trimmed = p.trim().toUpperCase();
      if (trimmed === 'PRIMARY SCHOOL' || trimmed.includes('PRIMARY')) {
        return 'Primary';
      }
      if (trimmed === 'SECONDARY SCHOOL' || trimmed === 'HIGH SCHOOL' || trimmed.includes('SECONDARY') || trimmed.includes('HIGH')) {
        return 'Secondary';
      }
      return null; // Exclude other phases
    };

    // Group normalized phases
    const normalizedPhases = phaseDistribution.reduce((acc, item) => {
      const normalized = normalizePhase(item.phasePED);
      if (normalized) { // Only include Primary and Secondary
        const existing = acc.find(x => x.name === normalized);
        if (existing) {
          existing.value += item._count.phasePED;
        } else {
          acc.push({ name: normalized, value: item._count.phasePED });
        }
      }
      return acc;
    }, [] as Array<{ name: string; value: number }>);

    // Get quintile distribution
    const quintileDistribution = await prisma.school.groupBy({
      by: ['quintile'],
      _count: {
        quintile: true,
      },
      orderBy: {
        quintile: 'asc',
      },
    });

    // Normalize quintile values
    const normalizeQuintile = (q: string | null): string => {
      if (!q || q.trim() === '') return 'Unknown';
      const trimmed = q.trim();
      // If it's just a number 1-5, convert to Q1-Q5
      if (['1', '2', '3', '4', '5'].includes(trimmed)) {
        return `Q${trimmed}`;
      }
      // If it's already Q1-Q5, keep it
      if (['Q1', 'Q2', 'Q3', 'Q4', 'Q5'].includes(trimmed)) {
        return trimmed;
      }
      // Everything else (including '99') is Unknown
      return 'Unknown';
    };

    // Group normalized quintiles
    const normalizedQuintiles = quintileDistribution.reduce((acc, item) => {
      const normalized = normalizeQuintile(item.quintile);
      const existing = acc.find(x => x.name === normalized);
      if (existing) {
        existing.value += item._count.quintile;
      } else {
        acc.push({ name: normalized, value: item._count.quintile });
      }
      return acc;
    }, [] as Array<{ name: string; value: number }>);

    // Sort quintiles in proper order: Q1, Q2, Q3, Q4, Q5, Unknown
    const quintileOrder = ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Unknown'];
    normalizedQuintiles.sort((a, b) => {
      return quintileOrder.indexOf(a.name) - quintileOrder.indexOf(b.name);
    });

    // Get province distribution
    const provinceDistribution = await prisma.school.groupBy({
      by: ['province'],
      _count: {
        province: true,
      },
    });

    // Get verification rate (schools with section21)
    const verifiedSchools = await prisma.school.count({
      where: {
        section21: { not: null },
      },
    });

    const analytics = {
      totals: {
        schools: totalSchools,
        learners: totalLearners._sum.learners2019 || 0,
        educators: totalEducators._sum.educator2019 || 0,
        verified: verifiedSchools,
        verificationRate: totalSchools > 0 ? (verifiedSchools / totalSchools) * 100 : 0,
      },
      distributions: {
        sector: normalizedSectors,
        phase: normalizedPhases,
        quintile: normalizedQuintiles,
        province: provinceDistribution.map(item => ({
          name: item.province || 'Unknown',
          value: item._count.province,
        })),
      },
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
