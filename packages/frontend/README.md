# Affiliateme Frontend

Next.js frontend for the Affiliateme affiliate marketing management platform.

## Features

- User authentication (login/register)
- Dashboard with analytics charts
- Affiliate link management
- Responsive design with Tailwind CSS
- Real-time click tracking

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file:
```bash
cp .env.local.example .env.local
```

3. Configure API URL in `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

4. Start development server:
```bash
npm run dev
```

Application will run on http://localhost:3001

## Pages

- `/` - Home (redirects to dashboard if logged in)
- `/login` - User login
- `/register` - User registration
- `/dashboard` - Analytics dashboard
- `/links` - Link management

## Tech Stack

- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- Recharts (for analytics charts)
- Axios (API client)
