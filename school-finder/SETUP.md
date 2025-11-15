# School Finder - Setup Guide

This guide will help you set up the School Finder application with Docker, PostgreSQL, and Prisma ORM.

## Prerequisites

- Node.js 20+ installed
- pnpm installed (`npm install -g pnpm`)
- Docker Desktop installed and running
- Your provincial Excel files ready

## Project Structure

```
school-finder/
├── data-import/
│   ├── excel-files/          # Place Excel files here
│   │   ├── Eastern Cape.xlsx
│   │   ├── Free State.xlsx
│   │   ├── Gauteng.xlsx
│   │   └── ...
│   └── README.md
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── api/               # Next.js API routes
│   │   │   ├── schools/
│   │   │   │   ├── route.ts   # GET /api/schools
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts  # GET /api/schools/:id
│   │   │   └── analytics/
│   │   │       └── route.ts   # GET /api/analytics
│   │   └── ...
│   ├── lib/
│   │   └── prisma.ts          # Prisma client instance
│   ├── scripts/
│   │   └── import-schools.ts  # Excel import script
│   └── types/
│       └── school.ts          # TypeScript types
├── docker-compose.yml         # Production Docker setup
├── docker-compose.dev.yml     # Development Docker setup
├── Dockerfile
└── .env
```

## Setup Steps

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Start PostgreSQL Database

For development, use the dev Docker Compose file:

```bash
docker-compose -f docker-compose.dev.yml up -d
```

This will start PostgreSQL on `localhost:5432` with:
- Database: `schoolfinder`
- Username: `schoolfinder`
- Password: `schoolfinder_password`

Verify the database is running:

```bash
docker-compose -f docker-compose.dev.yml ps
```

### 3. Configure Environment Variables

The `.env` file should already be created with:

```env
DATABASE_URL="postgresql://schoolfinder:schoolfinder_password@localhost:5432/schoolfinder"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Initialize Database Schema

Push the Prisma schema to the database:

```bash
pnpm db:push
```

This creates all the necessary tables in PostgreSQL.

Generate the Prisma Client:

```bash
pnpm prisma:generate
```

### 5. Import School Data

#### a. Add Excel Files

Copy your provincial Excel files to the `data-import/excel-files/` directory:

```
data-import/excel-files/
├── Eastern Cape.xlsx
├── Free State.xlsx
├── Gauteng.xlsx
├── KwaZulu Natal.xlsx
├── Limpopo.xlsx
├── Mpumalanga.xlsx
├── North West.xlsx
├── Northern Cape.xlsx
└── Western Cape.xlsx
```

#### b. Run the Import Script

```bash
pnpm db:seed
```

This script will:
- Read all Excel files in `data-import/excel-files/`
- Parse and validate the data
- Import schools into PostgreSQL (upserting by NatEMIS)
- Show progress and summary statistics

Expected output:
```
🚀 Starting School Data Import
============================================================
📁 Found 9 Excel file(s):
   - Eastern Cape.xlsx
   - Free State.xlsx
   ...
============================================================
✅ Total Imported: XXXX
⏭️  Total Skipped:  XX
❌ Total Errors:   X
============================================================
📚 Total schools in database: XXXX
✨ Import completed successfully!
```

### 6. Start Development Server

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

## API Endpoints

Once the data is imported, these endpoints will be available:

### GET /api/schools

Fetch schools with filtering and pagination.

**Query Parameters:**
- `search` - Search by name, city, or municipality
- `sector` - Filter by sector (PUBLIC, INDEPENDENT)
- `phase` - Filter by phase
- `quintile` - Filter by quintile (Q1-Q5)
- `province` - Filter by province
- `verified` - Filter verified schools (true/false)
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 50)

**Example:**
```
GET /api/schools?sector=PUBLIC&quintile=Q3&page=1&limit=20
```

**Response:**
```json
{
  "schools": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

### GET /api/schools/:id

Fetch a single school by ID or NatEMIS.

**Example:**
```
GET /api/schools/200100001
GET /api/schools/clxxxxxxxxxxxxx
```

**Response:**
```json
{
  "id": "clxxxxxxxxxxxxx",
  "natEMIS": "200100001",
  "officialInstitutionName": "A V BUKANI PRIMARY SCHOOL",
  ...
}
```

### GET /api/analytics

Fetch aggregated analytics data.

**Response:**
```json
{
  "totals": {
    "schools": 25000,
    "learners": 12000000,
    "educators": 400000,
    "verified": 20000,
    "verificationRate": 80
  },
  "distributions": {
    "sector": [...],
    "phase": [...],
    "quintile": [...],
    "province": [...]
  }
}
```

## Database Management

### View Database with Prisma Studio

```bash
pnpm prisma:studio
```

Opens a visual database browser at `http://localhost:5555`

### Reset Database

```bash
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up -d
pnpm db:push
pnpm db:seed
```

### Run Migrations (Production)

```bash
pnpm prisma:migrate
```

## Production Deployment

### Build and Run with Docker

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

### Build for Next.js Standalone

```bash
pnpm build
pnpm start
```

## Troubleshooting

### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker-compose -f docker-compose.dev.yml ps

# View PostgreSQL logs
docker-compose -f docker-compose.dev.yml logs postgres

# Restart database
docker-compose -f docker-compose.dev.yml restart postgres
```

### Import Script Issues

**No Excel files found:**
- Ensure files are in `data-import/excel-files/`
- Files must have `.xlsx` or `.xls` extension

**Duplicate NatEMIS errors:**
- The script uses upsert, so duplicates will be updated
- This is expected behavior

**Missing columns:**
- Verify your Excel files have the required column headers
- See `data-import/README.md` for column names

### Prisma Client Issues

```bash
# Regenerate Prisma Client
pnpm prisma:generate

# Clear node_modules and reinstall
rm -rf node_modules
pnpm install
```

## Scripts Reference

```bash
# Development
pnpm dev                   # Start dev server
pnpm build                 # Build for production
pnpm start                 # Start production server
pnpm lint                  # Run ESLint

# Database
pnpm db:push               # Push schema to database (dev)
pnpm db:seed               # Import Excel data
pnpm prisma:generate       # Generate Prisma Client
pnpm prisma:migrate        # Run migrations (production)
pnpm prisma:studio         # Open Prisma Studio
```

## Next Steps

After completing the setup:

1. The frontend components will need to be updated to use the API instead of mock data
2. Add error handling and loading states
3. Implement caching for better performance
4. Add authentication if needed
5. Set up monitoring and logging

## Need Help?

- Check the logs: `docker-compose -f docker-compose.dev.yml logs`
- Verify environment variables in `.env`
- Ensure Excel files match the expected format
- Check database connection with Prisma Studio
