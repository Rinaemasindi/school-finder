import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Province name to code mapping
const PROVINCE_NAME_TO_CODE: { [key: string]: string } = {
  'Eastern Cape': 'EC',
  'Free State': 'FS',
  'Gauteng': 'GP',
  'KwaZulu-Natal': 'KZN',
  'Limpopo': 'LP',
  'Mpumalanga': 'MP',
  'Northern Cape': 'NC',
  'North West': 'NW',
  'Western Cape': 'WC',
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Build the where clause based on query parameters using AND to combine filters
    const andConditions: any[] = [];

    // Search by name, city, or municipality
    const search = searchParams.get('search');
    if (search) {
      andConditions.push({
        OR: [
          { officialInstitutionName: { contains: search, mode: 'insensitive' } },
          { townCity: { contains: search, mode: 'insensitive' } },
          { districtMunicipalityName: { contains: search, mode: 'insensitive' } },
          { township: { contains: search, mode: 'insensitive' } },
          { suburb: { contains: search, mode: 'insensitive' } },
          { postalAddress: { contains: search, mode: 'insensitive' } },
        ],
      });
    }

    // Filter by sector - normalize to match variations
    const sector = searchParams.get('sector');
    if (sector && sector !== 'all') {
      if (sector.toLowerCase() === 'public') {
        andConditions.push({ sector: { contains: 'PUBLIC', mode: 'insensitive' } });
      } else if (sector.toLowerCase() === 'independent') {
        andConditions.push({
          OR: [
            { sector: { contains: 'INDEPENDENT', mode: 'insensitive' } },
            { sector: { contains: 'PRIVATE', mode: 'insensitive' } },
          ],
        });
      }
    }

    // Filter by phase - normalize to match variations
    const phase = searchParams.get('phase');
    if (phase && phase !== 'all') {
      const phaseLower = phase.toLowerCase();
      if (phaseLower === 'primary') {
        andConditions.push({ phasePED: { contains: 'PRIMARY', mode: 'insensitive' } });
      } else if (phaseLower === 'secondary') {
        andConditions.push({
          OR: [
            { phasePED: { contains: 'SECONDARY', mode: 'insensitive' } },
            { phasePED: { contains: 'HIGH', mode: 'insensitive' } },
          ],
        });
      } else if (phaseLower === 'combined') {
        andConditions.push({ phasePED: { contains: 'COMBINED', mode: 'insensitive' } });
      } else if (phaseLower === 'intermediate') {
        andConditions.push({ phasePED: { contains: 'INTERMEDIATE', mode: 'insensitive' } });
      }
    }

    // Filter by quintile - match both "Q1" and "1" formats
    const quintile = searchParams.get('quintile');
    if (quintile && quintile !== 'all') {
      const quintileNum = quintile.replace('Q', ''); // Extract number
      andConditions.push({
        OR: [
          { quintile: quintile }, // Match Q1
          { quintile: quintileNum }, // Match 1
        ],
      });
    }

    // Filter by province - match both full name and code
    const province = searchParams.get('province');
    if (province && province !== 'all') {
      const provinceCode = PROVINCE_NAME_TO_CODE[province];
      if (provinceCode) {
        andConditions.push({
          OR: [
            { province: provinceCode }, // Match code (EC)
            { province: province }, // Match full name (Eastern Cape)
          ],
        });
      } else {
        andConditions.push({ province: province }); // Unknown province, match as-is
      }
    }

    // Filter by district
    const district = searchParams.get('district');
    if (district && district !== 'all') {
      andConditions.push({ eiDistrict: district });
    }

    // Filter by municipality
    const municipality = searchParams.get('municipality');
    if (municipality && municipality !== 'all') {
      andConditions.push({ districtMunicipalityName: municipality });
    }

    // Filter by township
    const township = searchParams.get('township');
    if (township && township !== 'all') {
      andConditions.push({ township: township });
    }

    // Filter by suburb
    const suburb = searchParams.get('suburb');
    if (suburb && suburb !== 'all') {
      andConditions.push({ suburb: suburb });
    }

    // Filter by town/city
    const townCity = searchParams.get('townCity');
    if (townCity && townCity !== 'all') {
      andConditions.push({ townCity: townCity });
    }

    // Filter by fee status
    const feeStatus = searchParams.get('feeStatus');
    if (feeStatus && feeStatus !== 'all') {
      if (feeStatus === 'free') {
        andConditions.push({
          AND: [
            { noFeeSchool: { not: null } },
            { noFeeSchool: { not: '' } }
          ]
        });
      } else if (feeStatus === 'paid') {
        andConditions.push({
          OR: [{ noFeeSchool: null }, { noFeeSchool: '' }],
        });
      }
    }

    // Filter by verification status (using section21 as a proxy)
    const verified = searchParams.get('verified');
    if (verified === 'true') {
      andConditions.push({ section21: { not: null } });
    }

    // Filter by map bounds (for viewport-based loading)
    const bounds = searchParams.get('bounds');
    if (bounds) {
      const [minLat, minLng, maxLat, maxLng] = bounds.split(',').map(Number);
      andConditions.push({ newLat: { gte: minLat, lte: maxLat } });
      andConditions.push({ newLong: { gte: minLng, lte: maxLng } });
    }

    // Construct final where clause
    const where = andConditions.length > 0 ? { AND: andConditions } : {};

    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    // Fetch schools with pagination
    const [schools, total] = await Promise.all([
      prisma.school.findMany({
        where,
        skip,
        take: limit,
        orderBy: { officialInstitutionName: 'asc' },
      }),
      prisma.school.count({ where }),
    ]);

    // Sort A-Z with non-alphabetic characters last
    const sortedSchools = schools.sort((a, b) => {
      const aFirstChar = a.officialInstitutionName?.charAt(0).toUpperCase() || '';
      const bFirstChar = b.officialInstitutionName?.charAt(0).toUpperCase() || '';
      const aIsAlpha = /[A-Z]/.test(aFirstChar);
      const bIsAlpha = /[A-Z]/.test(bFirstChar);

      if (aIsAlpha && !bIsAlpha) return -1;
      if (!aIsAlpha && bIsAlpha) return 1;
      return (a.officialInstitutionName || '').localeCompare(b.officialInstitutionName || '');
    });

    return NextResponse.json({
      schools: sortedSchools,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching schools:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schools' },
      { status: 500 }
    );
  }
}
