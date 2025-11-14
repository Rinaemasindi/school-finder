export interface School {
  id: string;
  name: string;
  province: string;
  status: 'OPEN' | 'CLOSED';
  sector: 'PUBLIC' | 'INDEPENDENT';
  type: string;
  phase: string;
  quintile?: string;
  verified: boolean;
  latitude: number;
  longitude: number;
  municipality: string;
  township?: string;
  suburb?: string;
  city: string;
  address: string;
  postalAddress?: string;
  telephone?: string;
  noFeeSchool?: string;
  learners: number;
  educators: number;
  registrationDate: string;
  examCentre?: string;
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
