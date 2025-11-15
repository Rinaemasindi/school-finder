# Quick Start Guide

Get your School Finder app running in 5 minutes!

## Step-by-Step

### 1. Install Packages
```bash
pnpm install
```

### 2. Start Database
```bash
docker-compose -f docker-compose.dev.yml up -d
```

### 3. Setup Database Schema
```bash
pnpm db:push
pnpm prisma:generate
```

### 4. Add Your Excel Files
Copy your provincial Excel files to:
```
data-import/excel-files/
```

### 5. Import Data
```bash
pnpm db:seed
```

### 6. Start App
```bash
pnpm dev
```

Visit `http://localhost:3000`

## What You Get

- ✅ PostgreSQL database running in Docker
- ✅ All school data imported from Excel
- ✅ Three API endpoints ready:
  - `/api/schools` - Browse and filter schools
  - `/api/schools/:id` - Get single school
  - `/api/analytics` - Get statistics

## Next Steps

The backend is ready! Now you need to:

1. Update frontend components to fetch from `/api/schools` instead of using mock data
2. Update the analytics page to fetch from `/api/analytics`
3. Update individual school pages to fetch from `/api/schools/:id`

See `SETUP.md` for detailed documentation.

## Useful Commands

```bash
# View database
pnpm prisma:studio

# Restart database
docker-compose -f docker-compose.dev.yml restart

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop database
docker-compose -f docker-compose.dev.yml down
```
