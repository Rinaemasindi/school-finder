# Data Import Directory

This directory contains Excel files and scripts for importing school data into the database.

## Directory Structure

```
data-import/
├── excel-files/          # Place your Excel files here
│   ├── Eastern Cape.xlsx
│   ├── Free State.xlsx
│   ├── Gauteng.xlsx
│   ├── KwaZulu Natal.xlsx
│   ├── Limpopo.xlsx
│   ├── Mpumalanga.xlsx
│   ├── North West.xlsx
│   ├── Northern Cape.xlsx
│   └── Western Cape.xlsx
└── README.md
```

## How to Import Data

1. **Place Excel Files**: Copy your provincial Excel files into the `excel-files/` directory

2. **Start Database**: Make sure your PostgreSQL database is running
   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

3. **Push Schema**: Initialize the database schema
   ```bash
   pnpm db:push
   ```

4. **Import Data**: Run the import script
   ```bash
   pnpm db:seed
   ```

## Excel File Format

The Excel files should have the following columns:
- NatEMIS
- Datayear
- Province
- ProvinceCD
- Official_Institution_Name
- Status
- Sector
- Type_DoE
- Phase_PED
- Specialization
- OwnerLand
- OwnerBuildings
- ExDept
- PaypointNo
- ComponentNo
- ExamNo
- ExamCentre
- New Lat
- New Long
- GISSource
- DistrictMunicipality_Code
- DistrictMunicipalityName
- Local MunicipalityName
- Ward_ID
- SP_Code
- SP_Name
- EIRegion
- EIDistrict
- EICircuit
- AddrInit
- Addressee
- Township_Village
- Suburb
- TownCity
- StreetAddress
- PostalAddress
- Telephone
- Section21
- Section21_Funct
- Quintile
- NAS
- NodalArea
- RegistrationDate
- NoFeeSchool
- Allocation
- DemarcationFrom
- DemarcationTo
- OldNATEMIS
- NewNATEMIS
- Learners_2019
- Educator_2019

## Notes

- The import script will skip duplicate NatEMIS entries
- Empty/null values will be handled appropriately
- Progress will be logged to the console
- All provincial files will be processed in one run
