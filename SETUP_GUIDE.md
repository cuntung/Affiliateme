# Affiliateme Setup Guide

Complete guide to set up and run the Affiliateme application.

## Prerequisites

- Node.js 18+ ([Download](https://nodejs.org/))
- PostgreSQL 14+ ([Download](https://www.postgresql.org/download/))
- npm or yarn
- Git

### Optional
- Docker and Docker Compose (for containerized setup)

## Option 1: Local Setup (Recommended for Development)

### Step 1: Clone the Repository

```bash
git clone https://github.com/cuntung/Affiliateme.git
cd Affiliateme
```

### Step 2: Install Root Dependencies

```bash
npm install
```

This will install dependencies for both backend and frontend packages.

### Step 3: Configure Backend

```bash
cd packages/backend
cp .env.example .env
```

Edit `.env` with your settings:

```env
NODE_ENV=development
PORT=3000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=affiliateme_dev
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Configuration (change these!)
JWT_SECRET=your_super_secret_jwt_key_here
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here

# Frontend URL
FRONTEND_URL=http://localhost:3001

# Short URL base
SHORT_URL_BASE=http://localhost:3000/r
```

### Step 4: Set Up Database

Create the PostgreSQL database:

```bash
# Using psql
createdb affiliateme_dev

# Or using PostgreSQL client
psql -U postgres
CREATE DATABASE affiliateme_dev;
\q
```

Run migrations:

```bash
npm run migrate
```

You should see:
```
Starting database migrations...
Running migration: 001_create_users_table.sql
✓ Completed: 001_create_users_table.sql
...
All migrations completed successfully!
```

### Step 5: Configure Frontend

```bash
cd ../frontend
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Step 6: Start Development Servers

From the root directory:

```bash
cd ../..
npm run dev
```

This will start both servers:
- **Backend API**: http://localhost:3000
- **Frontend**: http://localhost:3001

### Step 7: Test the Application

1. Open http://localhost:3001 in your browser
2. Click "create a new account"
3. Register with your email and password
4. You'll be redirected to the dashboard
5. Create your first affiliate link!

## Option 2: Docker Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/cuntung/Affiliateme.git
cd Affiliateme
```

### Step 2: Start with Docker Compose

```bash
docker-compose up -d
```

This will:
- Start PostgreSQL database
- Build and start the backend API
- Build and start the frontend

### Step 3: Run Migrations

```bash
docker-compose exec backend npm run migrate
```

### Step 4: Access the Application

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **Database**: localhost:5432

### Docker Commands

```bash
# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild and restart
docker-compose up -d --build

# Access backend shell
docker-compose exec backend sh

# Access database
docker-compose exec postgres psql -U postgres -d affiliateme_dev
```

## Troubleshooting

### Backend won't start

**Error**: Cannot connect to database

**Solution**:
1. Check PostgreSQL is running: `pg_isready`
2. Verify database credentials in `.env`
3. Ensure database exists: `psql -U postgres -l`

### Frontend can't reach API

**Error**: Network error or CORS error

**Solution**:
1. Check backend is running on port 3000
2. Verify `NEXT_PUBLIC_API_URL` in `.env.local`
3. Check `FRONTEND_URL` in backend `.env` matches frontend URL

### Migration errors

**Error**: Migration fails

**Solution**:
1. Ensure PostgreSQL is running
2. Check database credentials
3. Verify uuid-ossp extension is available:
   ```sql
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
   ```

### Port already in use

**Error**: EADDRINUSE: address already in use :::3000

**Solution**:
```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
PORT=3002 npm run dev
```

## Development Workflow

### Backend Development

```bash
cd packages/backend

# Start dev server with auto-reload
npm run dev

# Run migrations
npm run migrate

# View logs
# Logs are printed to console
```

### Frontend Development

```bash
cd packages/frontend

# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Running Both Simultaneously

From root directory:

```bash
npm run dev
```

This uses `concurrently` to run both servers.

## API Testing

### Using curl

```bash
# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","fullName":"Test User"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Create link (replace TOKEN with JWT from login)
curl -X POST http://localhost:3000/api/links \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"originalUrl":"https://amazon.com/dp/B08...","title":"Product Name"}'

# Get analytics
curl http://localhost:3000/api/analytics/overview \
  -H "Authorization: Bearer TOKEN"
```

### Using Postman

1. Import the API endpoints
2. Create environment with `baseUrl = http://localhost:3000`
3. Save JWT token from login response
4. Use token in Authorization header for protected routes

## Database Management

### View tables

```sql
psql -U postgres -d affiliateme_dev

\dt  -- List all tables
\d users  -- Describe users table
```

### Query data

```sql
-- View users
SELECT * FROM users;

-- View links with clicks
SELECT l.title, l.short_code, l.clicks 
FROM affiliate_links l 
ORDER BY l.clicks DESC;

-- View recent clicks
SELECT c.clicked_at, c.ip_address, l.title
FROM clicks c
JOIN affiliate_links l ON c.link_id = l.id
ORDER BY c.clicked_at DESC
LIMIT 10;
```

### Reset database

```bash
# Drop and recreate database
dropdb affiliateme_dev
createdb affiliateme_dev

# Run migrations again
cd packages/backend
npm run migrate
```

## Production Deployment

### Backend Deployment

1. Set environment variables
2. Use PostgreSQL in production mode
3. Change JWT secrets to strong random values
4. Set `NODE_ENV=production`
5. Use a process manager (PM2, Docker, etc.)

### Frontend Deployment

1. Build the app: `npm run build`
2. Deploy to Vercel, Netlify, or similar
3. Set environment variable `NEXT_PUBLIC_API_URL` to production API
4. Configure domain and SSL

### Database

1. Use managed PostgreSQL (AWS RDS, DigitalOcean, etc.)
2. Enable SSL connections
3. Set up regular backups
4. Configure connection pooling

## Next Steps

Once everything is running:

1. **Create your first link**: Go to Links page and click "+ Create Link"
2. **Test tracking**: Copy short URL and visit it in browser
3. **View analytics**: Check dashboard for click statistics
4. **Explore API**: Read TECHNICAL_SPECS.md for all endpoints

## Support

For issues and questions:
- Check [GitHub Issues](https://github.com/cuntung/Affiliateme/issues)
- Review [TECHNICAL_SPECS.md](./TECHNICAL_SPECS.md)
- See [GETTING_STARTED.md](./GETTING_STARTED.md) for development details

## Quick Reference

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3001 | Web application |
| Backend API | http://localhost:3000 | REST API |
| Database | localhost:5432 | PostgreSQL |
| Health Check | http://localhost:3000/health | API status |

**Default Database Credentials (Development)**:
- Host: localhost
- Port: 5432
- Database: affiliateme_dev
- User: postgres
- Password: (your password)
