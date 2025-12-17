# Affiliateme - Proposed Project Structure

This document outlines the recommended file and folder structure for the Affiliateme project.

## Monorepo Structure (Recommended)

```
affiliateme/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml
│   │   ├── cd.yml
│   │   └── tests.yml
│   ├── ISSUE_TEMPLATE/
│   └── PULL_REQUEST_TEMPLATE.md
├── packages/
│   ├── frontend/
│   │   ├── public/
│   │   │   ├── favicon.ico
│   │   │   └── index.html
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── common/
│   │   │   │   │   ├── Button.jsx
│   │   │   │   │   ├── Input.jsx
│   │   │   │   │   ├── Modal.jsx
│   │   │   │   │   └── Navbar.jsx
│   │   │   │   ├── dashboard/
│   │   │   │   │   ├── Dashboard.jsx
│   │   │   │   │   ├── StatsCard.jsx
│   │   │   │   │   └── RecentActivity.jsx
│   │   │   │   ├── links/
│   │   │   │   │   ├── LinksList.jsx
│   │   │   │   │   ├── LinkForm.jsx
│   │   │   │   │   └── LinkCard.jsx
│   │   │   │   ├── analytics/
│   │   │   │   │   ├── Charts.jsx
│   │   │   │   │   ├── PerformanceTable.jsx
│   │   │   │   │   └── FilterPanel.jsx
│   │   │   │   └── auth/
│   │   │   │       ├── Login.jsx
│   │   │   │       ├── Signup.jsx
│   │   │   │       └── ForgotPassword.jsx
│   │   │   ├── pages/
│   │   │   │   ├── Home.jsx
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── Links.jsx
│   │   │   │   ├── Analytics.jsx
│   │   │   │   ├── Settings.jsx
│   │   │   │   └── Profile.jsx
│   │   │   ├── services/
│   │   │   │   ├── api.js
│   │   │   │   ├── auth.service.js
│   │   │   │   ├── links.service.js
│   │   │   │   └── analytics.service.js
│   │   │   ├── store/
│   │   │   │   ├── index.js
│   │   │   │   ├── slices/
│   │   │   │   │   ├── authSlice.js
│   │   │   │   │   ├── linksSlice.js
│   │   │   │   │   └── analyticsSlice.js
│   │   │   │   └── middleware/
│   │   │   ├── hooks/
│   │   │   │   ├── useAuth.js
│   │   │   │   ├── useLinks.js
│   │   │   │   └── useAnalytics.js
│   │   │   ├── utils/
│   │   │   │   ├── formatters.js
│   │   │   │   ├── validators.js
│   │   │   │   └── constants.js
│   │   │   ├── styles/
│   │   │   │   ├── globals.css
│   │   │   │   └── tailwind.config.js
│   │   │   ├── App.jsx
│   │   │   └── index.jsx
│   │   ├── tests/
│   │   │   ├── unit/
│   │   │   ├── integration/
│   │   │   └── e2e/
│   │   ├── package.json
│   │   ├── .env.example
│   │   └── README.md
│   │
│   └── backend/
│       ├── src/
│       │   ├── controllers/
│       │   │   ├── auth.controller.js
│       │   │   ├── links.controller.js
│       │   │   ├── analytics.controller.js
│       │   │   ├── earnings.controller.js
│       │   │   └── networks.controller.js
│       │   ├── models/
│       │   │   ├── User.js
│       │   │   ├── Link.js
│       │   │   ├── Click.js
│       │   │   ├── Earning.js
│       │   │   └── Network.js
│       │   ├── routes/
│       │   │   ├── index.js
│       │   │   ├── auth.routes.js
│       │   │   ├── links.routes.js
│       │   │   ├── analytics.routes.js
│       │   │   └── networks.routes.js
│       │   ├── middleware/
│       │   │   ├── auth.middleware.js
│       │   │   ├── validation.middleware.js
│       │   │   ├── rateLimit.middleware.js
│       │   │   └── errorHandler.middleware.js
│       │   ├── services/
│       │   │   ├── auth.service.js
│       │   │   ├── link.service.js
│       │   │   ├── click.service.js
│       │   │   ├── analytics.service.js
│       │   │   └── integration/
│       │   │       ├── amazon.service.js
│       │   │       ├── shareasale.service.js
│       │   │       └── cj.service.js
│       │   ├── utils/
│       │   │   ├── database.js
│       │   │   ├── cache.js
│       │   │   ├── logger.js
│       │   │   ├── emailer.js
│       │   │   └── validators.js
│       │   ├── config/
│       │   │   ├── database.config.js
│       │   │   ├── redis.config.js
│       │   │   ├── jwt.config.js
│       │   │   └── app.config.js
│       │   ├── db/
│       │   │   ├── migrations/
│       │   │   │   ├── 001_create_users_table.sql
│       │   │   │   ├── 002_create_networks_table.sql
│       │   │   │   ├── 003_create_links_table.sql
│       │   │   │   ├── 004_create_clicks_table.sql
│       │   │   │   └── 005_create_earnings_table.sql
│       │   │   └── seeds/
│       │   │       ├── networks.seed.js
│       │   │       └── demo_data.seed.js
│       │   ├── jobs/
│       │   │   ├── syncNetworks.job.js
│       │   │   ├── generateReports.job.js
│       │   │   └── cleanupOldData.job.js
│       │   ├── app.js
│       │   └── server.js
│       ├── tests/
│       │   ├── unit/
│       │   ├── integration/
│       │   └── fixtures/
│       ├── package.json
│       ├── .env.example
│       └── README.md
│
├── docs/
│   ├── api/
│   │   ├── authentication.md
│   │   ├── links.md
│   │   ├── analytics.md
│   │   └── openapi.yaml
│   ├── guides/
│   │   ├── getting-started.md
│   │   ├── api-integration.md
│   │   ├── deployment.md
│   │   └── contributing.md
│   └── architecture/
│       ├── system-design.md
│       ├── database-schema.md
│       └── security.md
│
├── scripts/
│   ├── setup.sh
│   ├── build.sh
│   ├── deploy.sh
│   └── db-migrate.sh
│
├── docker/
│   ├── Dockerfile.frontend
│   ├── Dockerfile.backend
│   └── docker-compose.yml
│
├── .gitignore
├── .env.example
├── README.md
├── PROJECT_ANALYSIS.md
├── PROJECT_STRUCTURE.md
├── LICENSE
└── package.json (root)
```

## Alternative: Separate Repositories

If you prefer separate repositories for frontend and backend:

### Frontend Repository Structure
```
affiliateme-frontend/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── store/
│   ├── hooks/
│   ├── utils/
│   ├── styles/
│   ├── App.jsx
│   └── index.jsx
├── tests/
├── .env.example
├── package.json
└── README.md
```

### Backend Repository Structure
```
affiliateme-backend/
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── utils/
│   ├── config/
│   ├── db/
│   ├── jobs/
│   ├── app.js
│   └── server.js
├── tests/
├── .env.example
├── package.json
└── README.md
```

## Key Configuration Files

### `.env.example` (Backend)
```env
# Server
NODE_ENV=development
PORT=3000
API_VERSION=v1

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=affiliateme
DB_USER=postgres
DB_PASSWORD=your_password

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password

# Affiliate Networks
AMAZON_API_KEY=
SHAREASALE_API_KEY=
CJ_API_KEY=

# Frontend URL
FRONTEND_URL=http://localhost:3001
```

### `.env.example` (Frontend)
```env
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_ENV=development
```

### `.gitignore`
```
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/
.nyc_output

# Production
build/
dist/

# Environment
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# Temp
tmp/
temp/
```

## Package Management

### Root `package.json` (Monorepo)
```json
{
  "name": "affiliateme",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "packages/frontend",
    "packages/backend"
  ],
  "scripts": {
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
    "dev:frontend": "npm run dev --workspace=packages/frontend",
    "dev:backend": "npm run dev --workspace=packages/backend",
    "build": "npm run build --workspaces",
    "test": "npm run test --workspaces",
    "lint": "npm run lint --workspaces"
  },
  "devDependencies": {
    "concurrently": "^8.0.0"
  }
}
```

## Database Migrations Structure

```
db/migrations/
├── 001_create_users_table.sql
├── 002_create_networks_table.sql
├── 003_create_links_table.sql
├── 004_create_clicks_table.sql
└── 005_create_earnings_table.sql
```

Each migration file should include both `UP` and `DOWN` migrations:

```sql
-- UP
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    ...
);

-- DOWN
DROP TABLE IF EXISTS users;
```

## Docker Setup

### `docker-compose.yml`
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: affiliateme
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7
    ports:
      - "6379:6379"

  backend:
    build:
      context: ./packages/backend
      dockerfile: ../../docker/Dockerfile.backend
    ports:
      - "3000:3000"
    depends_on:
      - postgres
      - redis
    environment:
      - NODE_ENV=development

  frontend:
    build:
      context: ./packages/frontend
      dockerfile: ../../docker/Dockerfile.frontend
    ports:
      - "3001:3001"
    depends_on:
      - backend

volumes:
  postgres_data:
```

## Next Steps

1. **Initialize Project**
   ```bash
   npm init -y
   mkdir -p packages/frontend packages/backend
   ```

2. **Set Up Frontend**
   ```bash
   cd packages/frontend
   npx create-react-app . --template typescript
   # or
   npx create-next-app . --typescript
   ```

3. **Set Up Backend**
   ```bash
   cd packages/backend
   npm init -y
   npm install express pg redis jsonwebtoken bcrypt
   ```

4. **Configure Database**
   ```bash
   createdb affiliateme
   npm run migrate
   ```

5. **Start Development**
   ```bash
   npm run dev
   ```

This structure provides a solid foundation for scaling the Affiliateme platform from MVP to a full-featured application.
