# Affiliateme Backend API

Node.js/Express backend for the Affiliateme affiliate marketing management platform.

## Features

- User authentication with JWT
- Affiliate link management
- Click tracking and analytics
- PostgreSQL database with migrations
- Security middleware (helmet, CORS, rate limiting)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Configure database settings in `.env`

4. Run migrations:
```bash
npm run migrate
```

5. Start server:
```bash
npm run dev
```

Server will run on http://localhost:3000

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- POST `/api/auth/refresh` - Refresh JWT token

### Links
- GET `/api/links` - Get all user's links
- GET `/api/links/:id` - Get single link
- POST `/api/links` - Create new link
- PUT `/api/links/:id` - Update link
- DELETE `/api/links/:id` - Delete link
- GET `/r/:shortCode` - Redirect short link (tracks click)

### Analytics
- GET `/api/analytics/overview` - Get dashboard analytics
- GET `/api/analytics/links/:id/stats` - Get link statistics

## Database

PostgreSQL database with tables:
- users
- affiliate_networks
- affiliate_links
- clicks
- earnings

See `src/db/migrations/` for schema details.
