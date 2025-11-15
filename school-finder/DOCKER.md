# Docker Deployment Guide

## Important Notes

### Windows Development
- **Local builds work**: `pnpm build` works fine for development
- **Docker builds**: Use Docker for production deployment
- Next.js standalone mode requires symlinks, which need admin privileges on Windows
- The config automatically disables standalone mode for local development

### Production Deployment

## Quick Start (Production)

```bash
# Build and start with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop
docker-compose down
```

## Manual Docker Build

```bash
# Build the image
docker build -t school-finder:latest .

# Run with environment variables
docker run -d \
  -p 3000:3000 \
  -e DATABASE_URL="postgresql://schoolfinder:schoolfinder_password@postgres:5432/schoolfinder" \
  --name school-finder-app \
  school-finder:latest
```

## Docker Compose (Recommended)

The `docker-compose.yml` includes:
- **PostgreSQL** database
- **Next.js app** with standalone build
- Health checks for database
- Persistent volumes for data
- Automatic networking

### Start Everything

```bash
docker-compose up -d
```

This starts:
1. PostgreSQL database on port 5432
2. Next.js app on port 3000

### Import Data

After starting, you need to:

1. **Access the container:**
   ```bash
   docker-compose exec app sh
   ```

2. **Push schema:**
   ```bash
   npx prisma db push
   ```

3. **Exit and copy Excel files:**
   ```bash
   exit
   docker cp ./data-import/excel-files app:/app/data-import/excel-files
   ```

4. **Run import:**
   ```bash
   docker-compose exec app npx tsx src/scripts/import-schools.ts
   ```

### Alternatively: Use dev compose for DB only

For development, use only the database from Docker:

```bash
# Start only PostgreSQL
docker-compose -f docker-compose.dev.yml up -d

# Run app locally
pnpm dev
```

This is the **recommended approach** for development on Windows.

## Environment Variables

Required in production:

```env
DATABASE_URL=postgresql://schoolfinder:schoolfinder_password@postgres:5432/schoolfinder
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

## Troubleshooting

### Build fails with symlink errors on Windows
✅ **This is expected**. Use Docker for production builds:
```bash
docker build -t school-finder .
```

### Can't connect to database
1. Check database is running: `docker-compose ps`
2. Check logs: `docker-compose logs postgres`
3. Verify DATABASE_URL in `.env`

### App container crashes
```bash
# Check logs
docker-compose logs app

# Restart
docker-compose restart app
```

### Permission errors
The Dockerfile uses a non-root user (`nextjs`). Files are owned by this user for security.

## Production Checklist

- [ ] Update `DATABASE_URL` with production credentials
- [ ] Set strong database password
- [ ] Enable HTTPS/SSL for database connection
- [ ] Configure firewall rules
- [ ] Set up automated backups for PostgreSQL
- [ ] Configure log aggregation
- [ ] Set up monitoring (health checks)
- [ ] Review and update CORS settings if needed

## Architecture

```
┌─────────────────┐
│   Next.js App   │
│   (Port 3000)   │
│                 │
│  - API Routes   │
│  - SSR Pages    │
│  - Static Pages │
└────────┬────────┘
         │
         ├─ /api/schools
         ├─ /api/schools/:id
         └─ /api/analytics
         │
         ↓
┌─────────────────┐
│   PostgreSQL    │
│   (Port 5432)   │
│                 │
│  - School data  │
│  - Indexes      │
└─────────────────┘
```

## Performance Tips

1. **Database Indexing**: Already configured in Prisma schema
2. **Connection Pooling**: Prisma handles this automatically
3. **Static Optimization**: Pages without data fetching are pre-rendered
4. **API Response Caching**: Consider adding Redis for API caching

## Scaling

For high traffic:
1. Use multiple app containers behind a load balancer
2. Use managed PostgreSQL (AWS RDS, Azure Database, etc.)
3. Add Redis for caching
4. Enable CDN for static assets
5. Consider database read replicas

## Backup & Restore

### Backup Database
```bash
docker-compose exec postgres pg_dump -U schoolfinder schoolfinder > backup.sql
```

### Restore Database
```bash
cat backup.sql | docker-compose exec -T postgres psql -U schoolfinder schoolfinder
```

## Monitoring

Check app health:
```bash
curl http://localhost:3000
```

Check database:
```bash
docker-compose exec postgres pg_isready -U schoolfinder
```

## Updates

To update the application:

```bash
# Pull latest code
git pull

# Rebuild containers
docker-compose down
docker-compose up -d --build

# Run migrations if needed
docker-compose exec app npx prisma migrate deploy
```
