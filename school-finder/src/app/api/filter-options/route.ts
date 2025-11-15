import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Province code to full name mapping
const PROVINCE_MAP: { [key: string]: string } = {
  'EC': 'Eastern Cape',
  'FS': 'Free State',
  'GP': 'Gauteng',
  'KZN': 'KwaZulu-Natal',
  'LP': 'Limpopo',
  'MP': 'Mpumalanga',
  'NC': 'Northern Cape',
  'NW': 'North West',
  'WC': 'Western Cape',
};

export async function GET() {
  try {
    // Fetch all schools to get unique values
    const schools = await prisma.school.findMany({
      select: {
        sector: true,
        phasePED: true,
        quintile: true,
        eiDistrict: true,
        township: true,
        districtMunicipalityName: true,
        suburb: true,
        townCity: true,
        province: true,
      },
    });

    // Normalize sector values
    const normalizeSector = (s: string): string | null => {
      const upper = s.toUpperCase();
      if (upper.includes('PUBLIC')) return 'Public';
      if (upper.includes('INDEPENDENT') || upper.includes('PRIVATE')) return 'Independent';
      return null;
    };

    // Normalize phase values
    const normalizePhase = (p: string): string | null => {
      const upper = p.toUpperCase();
      if (upper.includes('COMBINED')) return 'Combined';
      if (upper.includes('INTERMEDIATE')) return 'Intermediate';
      if (upper.includes('PRIMARY')) return 'Primary';
      if (upper.includes('SECONDARY') || upper.includes('HIGH')) return 'Secondary';
      return null;
    };

    // Normalize quintile values - ONLY Q1 to Q5
    const normalizeQuintile = (q: string): string | null => {
      const trimmed = q.trim();
      if (['1', '2', '3', '4', '5'].includes(trimmed)) return `Q${trimmed}`;
      if (['Q1', 'Q2', 'Q3', 'Q4', 'Q5'].includes(trimmed.toUpperCase())) return trimmed.toUpperCase();
      return null; // Exclude Unknown and other values
    };

    // Normalize province codes to full names
    const normalizeProvince = (p: string): string => {
      const trimmed = p.trim().toUpperCase();
      return PROVINCE_MAP[trimmed] || p.trim();
    };

    // Extract unique normalized values
    const sectors = Array.from(
      new Set(
        schools
          .map((s) => s.sector)
          .filter((v): v is string => v != null && v.trim() !== '')
          .map((v) => normalizeSector(v.trim()))
          .filter((v): v is string => v !== null)
      )
    ).sort();

    const phases = Array.from(
      new Set(
        schools
          .map((s) => s.phasePED)
          .filter((v): v is string => v != null && v.trim() !== '')
          .map((v) => normalizePhase(v.trim()))
          .filter((v): v is string => v !== null)
      )
    ).sort();

    const quintiles = Array.from(
      new Set(
        schools
          .map((s) => s.quintile)
          .filter((v): v is string => v != null && v.trim() !== '')
          .map((v) => normalizeQuintile(v))
          .filter((v): v is string => v !== null) // Only Q1-Q5
      )
    ).sort((a, b) => {
      const order = ['Q1', 'Q2', 'Q3', 'Q4', 'Q5'];
      return order.indexOf(a) - order.indexOf(b);
    });

    const provinces = Array.from(
      new Set(
        schools
          .map((s) => s.province)
          .filter((v): v is string => v != null && v.trim() !== '')
          .map((v) => normalizeProvince(v))
      )
    ).sort();

    // Standard unique values for location fields
    const getUniqueValues = (field: keyof typeof schools[0]) => {
      const values = schools
        .map((s) => s[field])
        .filter((v): v is string => v != null && v.trim() !== '')
        .map((v) => v.trim());
      return Array.from(new Set(values)).sort();
    };

    return NextResponse.json({
      sectors,
      phases,
      quintiles,
      districts: getUniqueValues('eiDistrict'),
      townships: getUniqueValues('township'),
      municipalities: getUniqueValues('districtMunicipalityName'),
      suburbs: getUniqueValues('suburb'),
      cities: getUniqueValues('townCity'),
      provinces,
    });
  } catch (error) {
    console.error('Error fetching filter options:', error);
    return NextResponse.json(
      { error: 'Failed to fetch filter options' },
      { status: 500 }
    );
  }
}
