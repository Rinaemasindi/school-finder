// Database School type (matches Prisma schema)
export interface School {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  // Core Identifiers
  natEMIS: string;
  datayear: number;
  oldNATEMIS: string | null;
  newNATEMIS: string | null;

  // Basic Information
  officialInstitutionName: string;
  status: string;
  sector: string;
  typeDOE: string;
  phasePED: string;
  specialization: string | null;

  // Location - Coordinates
  newLat: number | null;
  newLong: number | null;
  gisSource: string | null;

  // Location - Administrative
  province: string;
  provinceCD: string;
  districtMunicipalityCode: string | null;
  districtMunicipalityName: string | null;
  localMunicipalityName: string | null;
  wardID: string | null;

  // Location - Address
  township: string | null;
  suburb: string | null;
  townCity: string | null;
  streetAddress: string | null;
  postalAddress: string | null;

  // Ownership & Department
  ownerLand: string | null;
  ownerBuildings: string | null;
  exDept: string | null;

  // Administrative Codes
  paypointNo: string | null;
  componentNo: string | null;
  examNo: string | null;
  examCentre: string | null;

  // Regional Structure
  spCode: string | null;
  spName: string | null;
  eiRegion: string | null;
  eiDistrict: string | null;
  eiCircuit: string | null;

  // Contact
  addrInit: string | null;
  addressee: string | null;
  telephone: string | null;

  // School Classification
  section21: string | null;
  section21Funct: string | null;
  quintile: string | null;
  nas: string | null;
  nodalArea: string | null;
  noFeeSchool: string | null;
  registrationDate: string | null;

  // Allocation & Movement
  allocation: string | null;
  demarcationFrom: string | null;
  demarcationTo: string | null;

  // Statistics
  learners2019: number | null;
  educator2019: number | null;
}

// Helper type for frontend display (simplified)
export interface SchoolDisplay {
  id: string;
  name: string;
  natEMIS: string;
  province: string;
  status: string;
  sector: string;
  type: string;
  phase: string;
  quintile?: string;
  verified: boolean;
  latitude?: number;
  longitude?: number;
  municipality?: string;
  township?: string;
  suburb?: string;
  city?: string;
  address?: string;
  postalAddress?: string;
  telephone?: string;
  noFeeSchool?: string;
  learners?: number;
  educators?: number;
  registrationDate?: string;
  examCentre?: string;
}

// Helper function to convert School to SchoolDisplay
export function toSchoolDisplay(school: School): SchoolDisplay {
  // South Africa coordinates: Latitude is negative (Southern Hemisphere), Longitude is positive (Eastern Hemisphere)
  // Auto-correct if they're swapped
  let latitude = school.newLat || undefined;
  let longitude = school.newLong || undefined;

  // If latitude is positive AND longitude is negative, they're swapped - fix it
  if (latitude && longitude && latitude > 0 && longitude < 0) {
    // Swap them
    [latitude, longitude] = [longitude, latitude];
  }

  return {
    id: school.id,
    name: school.officialInstitutionName,
    natEMIS: school.natEMIS,
    province: school.province,
    status: school.status,
    sector: school.sector,
    type: school.typeDOE,
    phase: school.phasePED,
    quintile: school.quintile || undefined,
    verified: !!school.section21,
    latitude,
    longitude,
    municipality: school.districtMunicipalityName || undefined,
    township: school.township || undefined,
    suburb: school.suburb || undefined,
    city: school.townCity || undefined,
    address: school.streetAddress || undefined,
    postalAddress: school.postalAddress || undefined,
    telephone: school.telephone || undefined,
    noFeeSchool: school.noFeeSchool || undefined,
    learners: school.learners2019 || undefined,
    educators: school.educator2019 || undefined,
    registrationDate: school.registrationDate || undefined,
    examCentre: school.examCentre || undefined,
  };
}

export interface SchoolAnalytics {
  totalSchools: number;
  verifiedSchools: number;
  publicSchools: number;
  independentSchools: number;
  totalLearners: number;
  totalEducators: number;
  schoolsByProvince: { province: string; count: number }[];
  schoolsByQuintile: { quintile: string; count: number }[];
  learnersByPhase: { phase: string; learners: number }[];
}
