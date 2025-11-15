# SA Schools Finder

A modern, mobile-first web application for browsing and exploring South African schools information.

## Features

### 1. Browse Schools
- **Mobile-responsive grid layout** displaying all schools
- **Advanced filtering** by sector, phase, quintile, and verification status
- **Real-time search** by school name, city, or municipality
- **Verification badges** to identify verified schools
- Click on any school card to view detailed information

### 2. School Details
- **Comprehensive school information** including contact details
- **Verification status** prominently displayed
- **School statistics** with learner-educator ratios
- **Location coordinates** for mapping
- **Responsive layout** adapting from mobile to desktop

### 3. Find Schools (Map View)
- **Interactive map** using Leaflet/OpenStreetMap
- **Search and filter** schools by location
- **Click on markers** to view school information
- **Dynamic map updates** based on filters
- **Mobile-optimized** touch interactions

### 4. Analytics Dashboard
- **Statistics cards** showing total schools, learners, and educators
- **Visual charts** for sector, phase, and quintile distributions
- **Verification rates** across all schools
- **Responsive charts** that adapt to screen size

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Frontend**: React 19, TypeScript 5
- **Database**: PostgreSQL 16 with Prisma ORM
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS v4
- **Maps**: Leaflet + React-Leaflet
- **Charts**: Recharts
- **Icons**: Lucide React
- **Deployment**: Docker + Docker Compose
- **Package Manager**: npm (Docker), pnpm (local dev)

## Architecture Pattern

This project follows the **colocation pattern**, where page-specific components are stored alongside their pages:

```
src/app/
├── (browse)/
│   └── _components/
│       ├── SchoolCard.tsx
│       └── SchoolFilters.tsx
├── school/[id]/
│   └── _components/
│       ├── SchoolHeader.tsx
│       └── SchoolInfo.tsx
├── find/
│   └── _components/
│       ├── SchoolMap.tsx
│       └── MapSearch.tsx
└── analytics/
    └── _components/
        ├── StatsCards.tsx
        └── AnalyticsCharts.tsx
```

## Deployment Guide

### Prerequisites

Before deploying, ensure you have:
- **Node.js 20+** installed
- **Docker** and **Docker Compose** (for containerized deployment)
- **PostgreSQL 16** (if running without Docker)
- School data in Excel format (.xlsx or .xls files)

### Quick Start with Docker (Recommended)

#### 1. Clone and Navigate

```bash
cd school-finder
```

#### 2. Configure Environment

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://schoolfinder:schoolfinder_password@postgres:5432/schoolfinder"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

#### 3. Start All Services

```bash
docker compose up -d --build
```

This will:
- Build the Next.js application
- Start PostgreSQL database on port 5432
- Start the application on port 3000

#### 4. Push Database Schema

```bash
npm run db:push
```

#### 5. Import School Data

Place your Excel files in `data-import/excel-files/`, then run:

```bash
npm run db:seed
```

#### 6. Access Application

Open [http://localhost:3000](http://localhost:3000)

### Local Development (Without Docker)

#### 1. Install Dependencies

```bash
npm install
```

#### 2. Start PostgreSQL

Either use Docker for just the database:

```bash
docker compose -f docker-compose.dev.yml up -d
```

Or use a local PostgreSQL instance and update `.env`:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/schoolfinder"
```

#### 3. Setup Database

```bash
# Push schema to database
npm run db:push

# Generate Prisma client
npm run prisma:generate
```

#### 4. Import Data

```bash
npm run db:seed
```

#### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Deployment

#### Docker Production Build

```bash
# Build and start in production mode
docker compose up -d --build

# View logs
docker logs school-finder-app
docker logs school-finder-db

# Stop services
docker compose down
```

#### Manual Production Build

```bash
# Install dependencies
npm install

# Build application
npm run build

# Start production server
npm start
```

### Database Management

#### View Database (Prisma Studio)

```bash
npx prisma studio
```

Opens a GUI at [http://localhost:5555](http://localhost:5555)

#### Reset Database

```bash
# Clear all data
npx prisma db push --force-reset

# Re-import data
npm run db:seed
```

#### Database Migrations

```bash
# Create migration
npx prisma migrate dev --name your_migration_name

# Apply migrations in production
npx prisma migrate deploy
```

### Data Import

#### Supported File Formats
- Excel files (.xlsx, .xls)
- Place files in: `data-import/excel-files/`

#### Supported Provinces
- Eastern Cape
- Free State
- Gauteng
- KwaZulu-Natal
- Limpopo
- Mpumalanga
- Northern Cape
- North West
- Western Cape

#### Import Process

The import script (`src/scripts/import-schools.ts`):
1. Reads all Excel files from `data-import/excel-files/`
2. Handles multiple column name variations across provinces
3. Validates data (coordinates, required fields)
4. Uses upsert to prevent duplicates (by NatEMIS)
5. Shows progress and statistics

Run import:
```bash
npm run db:seed
```

### Environment Variables

Create a `.env` file with:

```env
# Database Connection
DATABASE_URL="postgresql://user:password@host:port/database"

# Application URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Optional: Node Environment
NODE_ENV="production"
```

### Docker Commands

```bash
# Start services
docker compose up -d

# Rebuild and start
docker compose up -d --build

# Stop services
docker compose down

# View logs
docker logs -f school-finder-app
docker logs -f school-finder-db

# Access app container shell
docker exec -it school-finder-app sh

# Access database
docker exec -it school-finder-db psql -U schoolfinder -d schoolfinder
```

### Troubleshooting

#### Database Connection Issues

```bash
# Check database is running
docker ps

# Check database logs
docker logs school-finder-db

# Restart database
docker restart school-finder-db
```

#### Application Errors

```bash
# Check application logs
docker logs school-finder-app

# Rebuild application
docker compose up -d --build --force-recreate school-finder-app
```

#### Port Conflicts

If ports 3000 or 5432 are in use, update `docker-compose.yml`:

```yaml
ports:
  - '3001:3000'  # Use different host port
```

### Health Checks

- **Application**: [http://localhost:3000](http://localhost:3000)
- **API**: [http://localhost:3000/api/schools](http://localhost:3000/api/schools)
- **Database**: Check with `docker exec school-finder-db pg_isready -U schoolfinder`

### Performance Optimization

#### For Production

1. **Enable caching** (Redis recommended)
2. **Use CDN** for static assets
3. **Database indexing** (already configured in schema)
4. **Connection pooling** (Prisma default)
5. **Image optimization** (Next.js automatic)

#### Scaling

- **Horizontal scaling**: Deploy multiple app containers behind load balancer
- **Database**: Use managed PostgreSQL service (AWS RDS, Azure Database, etc.)
- **Caching**: Add Redis for session storage and API caching

## Mobile-First Design

The application is built with a mobile-first approach:

- **Responsive navigation** with hamburger menu on mobile
- **Adaptive grid layouts** (1 column on mobile, 2-3 on desktop)
- **Touch-friendly** interactions and buttons
- **Optimized font sizes** for readability on all screens
- **Flexible card layouts** that stack on smaller screens

## Data Structure

The application uses mock data based on the South African schools dataset, including:

- School identification (NatEMIS ID)
- Basic information (name, province, city)
- Classification (sector, phase, type, quintile)
- Contact details (address, telephone)
- Statistics (learners, educators)
- Verification status
- Geographic coordinates

## Future Enhancements

- Real API integration with actual school database
- User authentication and saved schools
- Advanced search with more filters
- Export functionality for analytics
- School comparison features
- Reviews and ratings system
- Offline support with PWA
