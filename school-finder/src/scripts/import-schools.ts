import { PrismaClient } from '@prisma/client';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface ExcelRow {
  // Support multiple column name variations across provinces
  NatEMIS?: string;
  NatEmis?: string;
  Datayear?: number;
  'Data Year'?: number;
  Province?: string;
  ProvinceCD?: string;
  Official_Institution_Name?: string;
  Institution_Name?: string;
  Status?: string;
  Sector?: string;
  Type_DoE?: string;
  Phase_PED?: string;
  Specialization?: string;
  Specialisation?: string;
  OwnerLand?: string;
  Owner_Land?: string;
  OwnerBuildings?: string;
  Owner_Buildings?: string;
  ExDept?: string;
  PaypointNo?: string;
  Persal_PaypointNo?: string;
  ComponentNo?: string;
  Persal_ComponentNo?: string;
  ExamNo?: string;
  ExamCentre?: string;
  'New Lat'?: number;
  'New Long'?: number;
  GIS_Latitude?: number;
  GIS_Longitude?: number;
  Latitude?: number;
  Longitude?: number;
  GISSource?: string;
  DistrictMunicipality_Code?: string;
  DistrictMunicipalityName?: string;
  DMunName?: string;
  'Local MunicipalityName'?: string;
  LMunName?: string;
  Ward_ID?: string;
  SP_Code?: string;
  SP_Name?: string;
  EIRegion?: string;
  EIDistrict?: string;
  EICircuit?: string;
  AddrInit?: string;
  Addressee?: string;
  Township_Village?: string;
  Suburb?: string;
  TownCity?: string;
  Town_City?: string;
  towncity?: string;
  StreetAddress?: string;
  PostalAddress?: string;
  Telephone?: string;
  Section21?: string;
  Section21_Funct?: string;
  Section21_Function?: string;
  Quintile?: string;
  NAS?: string;
  NodalArea?: string;
  RegistrationDate?: string;
  Registration_Date?: string;
  NoFeeSchool?: string;
  Allocation?: string;
  DemarcationFrom?: string;
  DemarcationTo?: string;
  OldNATEMIS?: string;
  NewNATEMIS?: string;
  Learners_2019?: number;
  Learners2024?: number;
  Educator_2019?: number;
  Educators2024?: number;
}

function parseValue(value: any): any {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '' || trimmed === '.' || trimmed.toUpperCase() === 'NULL' || trimmed.toUpperCase() === 'N/A' || trimmed === 'NOT APPLICABLE') {
      return null;
    }
    return trimmed;
  }
  // Convert numbers to strings for string fields
  if (typeof value === 'number') {
    return String(value);
  }
  return value;
}

function convertRowToSchoolData(row: any) {
  // Handle multiple Excel format variations across provinces
  const natEMIS = row.NatEMIS || row.NatEmis;
  const datayear = row.Datayear || row['Data Year'];
  const learners = row.Learners_2019 || row.Learners2024;
  const educators = row.Educator_2019 || row.Educators2024;
  let lat = row['New Lat'] || row.GIS_Latitude || row.Latitude;
  let long = row['New Long'] || row.GIS_Longitude || row.Longitude;

  // South Africa: Latitude should be negative (Southern Hemisphere), Longitude should be positive (Eastern Hemisphere)
  // Auto-correct if they're swapped
  if (lat && long && Number(lat) > 0 && Number(long) < 0) {
    // Swap them
    [lat, long] = [long, lat];
  }

  const institutionName = row.Official_Institution_Name || row.Institution_Name;
  const specialization = row.Specialization || row.Specialisation;
  const paypointNo = row.PaypointNo || row.Persal_PaypointNo;
  const componentNo = row.ComponentNo || row.Persal_ComponentNo;
  const districtMunicipalityName = row.DistrictMunicipalityName || row.DMunName;
  const localMunicipalityName = row['Local MunicipalityName'] || row.LMunName;
  const townCity = row.TownCity || row.Town_City || row.towncity;
  const section21Funct = row.Section21_Funct || row.Section21_Function;
  const registrationDate = row.RegistrationDate || row.Registration_Date;
  const ownerLand = row.OwnerLand || row.Owner_Land;
  const ownerBuildings = row.OwnerBuildings || row.Owner_Buildings;

  return {
    natEMIS: String(natEMIS).trim(),
    datayear: Number(datayear),
    province: parseValue(row.Province) || '',
    provinceCD: parseValue(row.ProvinceCD) || '',
    officialInstitutionName: parseValue(institutionName) || '',
    status: parseValue(row.Status) || '',
    sector: parseValue(row.Sector) || '',
    typeDOE: parseValue(row.Type_DoE) || '',
    phasePED: parseValue(row.Phase_PED) || '',
    specialization: parseValue(specialization),
    ownerLand: parseValue(ownerLand),
    ownerBuildings: parseValue(ownerBuildings),
    exDept: parseValue(row.ExDept),
    paypointNo: parseValue(paypointNo),
    componentNo: parseValue(componentNo),
    examNo: parseValue(row.ExamNo),
    examCentre: parseValue(row.ExamCentre),
    newLat: lat ? Number(lat) : null,
    newLong: long ? Number(long) : null,
    gisSource: parseValue(row.GISSource),
    districtMunicipalityCode: parseValue(row.DistrictMunicipality_Code),
    districtMunicipalityName: parseValue(districtMunicipalityName),
    localMunicipalityName: parseValue(localMunicipalityName),
    wardID: parseValue(row.Ward_ID),
    spCode: parseValue(row.SP_Code),
    spName: parseValue(row.SP_Name),
    eiRegion: parseValue(row.EIRegion),
    eiDistrict: parseValue(row.EIDistrict),
    eiCircuit: parseValue(row.EICircuit),
    addrInit: parseValue(row.AddrInit),
    addressee: parseValue(row.Addressee),
    township: parseValue(row.Township_Village),
    suburb: parseValue(row.Suburb),
    townCity: parseValue(townCity),
    streetAddress: parseValue(row.StreetAddress),
    postalAddress: parseValue(row.PostalAddress),
    telephone: parseValue(row.Telephone),
    section21: parseValue(row.Section21),
    section21Funct: parseValue(section21Funct),
    quintile: parseValue(row.Quintile),
    nas: parseValue(row.NAS),
    nodalArea: parseValue(row.NodalArea),
    registrationDate: parseValue(registrationDate),
    noFeeSchool: parseValue(row.NoFeeSchool),
    allocation: parseValue(row.Allocation),
    demarcationFrom: parseValue(row.DemarcationFrom),
    demarcationTo: parseValue(row.DemarcationTo),
    oldNATEMIS: parseValue(row.OldNATEMIS),
    newNATEMIS: parseValue(row.NewNATEMIS),
    learners2019: learners ? Number(learners) : null,
    educator2019: educators ? Number(educators) : null,
  };
}

async function importExcelFile(filePath: string, fileName: string) {
  console.log(`\n📖 Processing: ${fileName}`);

  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data: ExcelRow[] = XLSX.utils.sheet_to_json(worksheet);

  console.log(`   Found ${data.length} rows`);

  let imported = 0;
  let skipped = 0;
  let errors = 0;

  for (const [index, row] of data.entries()) {
    try {
      // Handle both NatEMIS and NatEmis column names
      const natEMIS = row.NatEMIS || row.NatEmis;
      if (!natEMIS) {
        skipped++;
        continue;
      }

      const schoolData = convertRowToSchoolData(row);

      await prisma.school.upsert({
        where: { natEMIS: schoolData.natEMIS },
        update: schoolData,
        create: schoolData,
      });

      imported++;

      if ((index + 1) % 100 === 0) {
        console.log(`   Progress: ${index + 1}/${data.length} rows processed...`);
      }
    } catch (error) {
      errors++;
      const natEMIS = row.NatEMIS || row.NatEmis;
      console.error(`   ❌ Error at row ${index + 1} (NatEMIS: ${natEMIS}):`, error instanceof Error ? error.message : error);
    }
  }

  console.log(`   ✅ Imported: ${imported} | ⏭️  Skipped: ${skipped} | ❌ Errors: ${errors}`);
  return { imported, skipped, errors };
}

async function main() {
  console.log('🚀 Starting School Data Import\n');
  console.log('=' .repeat(60));

  const dataImportDir = path.join(process.cwd(), 'data-import', 'excel-files');

  if (!fs.existsSync(dataImportDir)) {
    console.error(`❌ Directory not found: ${dataImportDir}`);
    console.log('\n💡 Please create the directory and add your Excel files:');
    console.log('   mkdir -p data-import/excel-files');
    process.exit(1);
  }

  const files = fs.readdirSync(dataImportDir).filter(file =>
    file.endsWith('.xlsx') || file.endsWith('.xls')
  );

  if (files.length === 0) {
    console.error(`❌ No Excel files found in: ${dataImportDir}`);
    console.log('\n💡 Please add your provincial Excel files to:');
    console.log(`   ${dataImportDir}`);
    process.exit(1);
  }

  console.log(`📁 Found ${files.length} Excel file(s):\n`);
  files.forEach(file => console.log(`   - ${file}`));
  console.log('\n' + '='.repeat(60));

  let totalImported = 0;
  let totalSkipped = 0;
  let totalErrors = 0;

  for (const file of files) {
    const filePath = path.join(dataImportDir, file);
    const result = await importExcelFile(filePath, file);
    totalImported += result.imported;
    totalSkipped += result.skipped;
    totalErrors += result.errors;
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 IMPORT SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Total Imported: ${totalImported}`);
  console.log(`⏭️  Total Skipped:  ${totalSkipped}`);
  console.log(`❌ Total Errors:   ${totalErrors}`);
  console.log('='.repeat(60));

  // Get final count from database
  const finalCount = await prisma.school.count();
  console.log(`\n📚 Total schools in database: ${finalCount}`);

  console.log('\n✨ Import completed successfully!\n');
}

main()
  .catch((e) => {
    console.error('❌ Fatal error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
