# Getting Started with Affiliateme Development

This guide will help you set up your development environment and start working on the Affiliateme project.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download/)
- **Redis** (v7 or higher) - [Download](https://redis.io/download)
- **Git** - [Download](https://git-scm.com/downloads)
- **npm** or **yarn** - Comes with Node.js

### Optional but Recommended
- **Docker** & **Docker Compose** - For containerized development
- **Visual Studio Code** - Recommended IDE with extensions:
  - ESLint
  - Prettier
  - GitLens
  - PostgreSQL
  - REST Client

## Initial Setup

### 1. Clone the Repository

```bash
git clone https://github.com/cuntung/Affiliateme.git
cd Affiliateme
```

### 2. Install Dependencies

#### Using npm (monorepo setup)
```bash
npm install
npm install --workspaces
```

#### Or install individually
```bash
# Install frontend dependencies
cd packages/frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 3. Set Up Environment Variables

#### Backend Environment
```bash
cd packages/backend
cp .env.example .env
```

Edit `.env` with your local configuration:
```env
NODE_ENV=development
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=affiliateme_dev
DB_USER=postgres
DB_PASSWORD=your_password

REDIS_HOST=localhost
REDIS_PORT=6379

JWT_SECRET=your_very_secure_jwt_secret_here
JWT_EXPIRES_IN=7d

FRONTEND_URL=http://localhost:3001
```

#### Frontend Environment
```bash
cd packages/frontend
cp .env.example .env
```

Edit `.env`:
```env
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_ENV=development
```

### 4. Set Up the Database

#### Option A: Using PostgreSQL directly

```bash
# Create the database
createdb affiliateme_dev

# Run migrations
cd packages/backend
npm run migrate
# or
node src/db/migrate.js

# (Optional) Seed with demo data
npm run seed
```

#### Option B: Using Docker

```bash
# Start PostgreSQL and Redis
docker-compose up -d postgres redis

# The database will be created automatically
# Run migrations
docker-compose exec backend npm run migrate
```

### 5. Start Development Servers

#### Option A: Start all services together (from root)
```bash
npm run dev
```

This will start:
- Backend API on http://localhost:3000
- Frontend on http://localhost:3001

#### Option B: Start services individually

Terminal 1 (Backend):
```bash
cd packages/backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd packages/frontend
npm start
```

Terminal 3 (Redis - if not using Docker):
```bash
redis-server
```

### 6. Verify Setup

Open your browser and navigate to:
- Frontend: http://localhost:3001
- API Health Check: http://localhost:3000/api/health

You should see the Affiliateme application running!

## Development Workflow

### Creating a New Feature

1. **Create a new branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write code
   - Add tests
   - Update documentation

3. **Run tests**
   ```bash
   npm test
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add feature: your feature description"
   ```

5. **Push and create a pull request**
   ```bash
   git push origin feature/your-feature-name
   ```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- path/to/test.spec.js
```

### Linting and Formatting

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code with Prettier
npm run format
```

### Database Migrations

#### Create a new migration
```bash
cd packages/backend
npm run migrate:create create_new_table
```

This creates a new migration file in `src/db/migrations/`

#### Run migrations
```bash
npm run migrate
```

#### Rollback last migration
```bash
npm run migrate:rollback
```

#### Reset database (caution: destroys all data)
```bash
npm run migrate:reset
```

### Working with the API

#### Using curl
```bash
# Register a user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","fullName":"Test User"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'

# Get links (with authentication)
curl http://localhost:3000/api/links \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Using REST Client (VS Code Extension)
Create a file `api.http`:
```http
### Register User
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test123!",
  "fullName": "Test User"
}

### Login
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test123!"
}

### Get Links
GET http://localhost:3000/api/links
Authorization: Bearer {{token}}
```

## Docker Development Setup

### Using Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild and start
docker-compose up -d --build

# Run migrations in container
docker-compose exec backend npm run migrate

# Access PostgreSQL shell
docker-compose exec postgres psql -U postgres -d affiliateme_dev

# Access Redis CLI
docker-compose exec redis redis-cli
```

### Docker Commands Reference

```bash
# List running containers
docker ps

# Enter a container shell
docker exec -it affiliateme_backend sh

# View container logs
docker logs affiliateme_backend -f

# Clean up
docker-compose down -v  # Remove volumes too
```

## Troubleshooting

### Common Issues

#### 1. Database Connection Error
**Problem**: Cannot connect to PostgreSQL

**Solution**:
```bash
# Check if PostgreSQL is running
pg_isready

# Start PostgreSQL
# On macOS with Homebrew:
brew services start postgresql

# On Linux:
sudo systemctl start postgresql

# Check connection
psql -U postgres -d affiliateme_dev
```

#### 2. Port Already in Use
**Problem**: `Error: listen EADDRINUSE: address already in use :::3000`

**Solution**:
```bash
# Find process using the port
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=3001 npm run dev
```

#### 3. Redis Connection Error
**Problem**: Cannot connect to Redis

**Solution**:
```bash
# Check if Redis is running
redis-cli ping

# Should return: PONG

# Start Redis
# On macOS:
brew services start redis

# On Linux:
sudo systemctl start redis

# Or use Docker:
docker run -d -p 6379:6379 redis:7
```

#### 4. Migration Errors
**Problem**: Database migration fails

**Solution**:
```bash
# Check migration status
npm run migrate:status

# Rollback last migration
npm run migrate:rollback

# Reset and re-run (caution: destroys data)
npm run migrate:reset
npm run migrate
```

#### 5. Module Not Found Errors
**Problem**: `Error: Cannot find module`

**Solution**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Or for monorepo:
npm install --workspaces
```

### Debug Mode

Enable detailed logging:

```bash
# Backend
DEBUG=app:* npm run dev

# Or set in .env
DEBUG=app:*
LOG_LEVEL=debug
```

## Useful Development Tools

### Database GUI Tools
- **pgAdmin** - PostgreSQL GUI
- **DBeaver** - Universal database tool
- **TablePlus** - Modern database GUI

### API Testing
- **Postman** - API development platform
- **Insomnia** - API client
- **REST Client** - VS Code extension

### Redis GUI
- **RedisInsight** - Official Redis GUI
- **Medis** - Modern Redis GUI (macOS)

## Code Style Guide

### JavaScript/Node.js
- Use ES6+ features
- Use async/await over callbacks
- Use descriptive variable names
- Add JSDoc comments for functions
- Follow Airbnb style guide

```javascript
/**
 * Create a new affiliate link
 * @param {Object} linkData - Link data
 * @param {string} linkData.url - Original URL
 * @param {string} linkData.title - Link title
 * @returns {Promise<Object>} Created link
 */
async function createLink(linkData) {
  // Implementation
}
```

### React Components
- Use functional components with hooks
- Use PropTypes or TypeScript
- Keep components small and focused
- Extract reusable logic into custom hooks

```jsx
import React from 'react';
import PropTypes from 'prop-types';

function LinkCard({ link, onEdit, onDelete }) {
  return (
    <div className="link-card">
      <h3>{link.title}</h3>
      <button onClick={() => onEdit(link)}>Edit</button>
      <button onClick={() => onDelete(link.id)}>Delete</button>
    </div>
  );
}

LinkCard.propTypes = {
  link: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default LinkCard;
```

## Git Workflow

### Branch Naming Convention
- `feature/` - New features
- `bugfix/` - Bug fixes
- `hotfix/` - Urgent production fixes
- `refactor/` - Code refactoring
- `docs/` - Documentation updates

Examples:
- `feature/add-link-analytics`
- `bugfix/fix-login-error`
- `refactor/optimize-queries`

### Commit Message Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance

Example:
```
feat(links): add bulk import functionality

- Add CSV import endpoint
- Add frontend upload component
- Add validation for import data

Closes #123
```

## Additional Resources

- [Project Analysis Document](./PROJECT_ANALYSIS.md)
- [Technical Specifications](./TECHNICAL_SPECS.md)
- [Project Structure](./PROJECT_STRUCTURE.md)
- [Contributing Guidelines](./CONTRIBUTING.md) (coming soon)
- [API Documentation](./docs/api/) (coming soon)

## Getting Help

- **Issues**: [GitHub Issues](https://github.com/cuntung/Affiliateme/issues)
- **Discussions**: [GitHub Discussions](https://github.com/cuntung/Affiliateme/discussions)
- **Documentation**: Check the `/docs` folder

## Next Steps

Now that your development environment is set up:

1. **Explore the codebase**: Familiarize yourself with the project structure
2. **Read the documentation**: Review PROJECT_ANALYSIS.md and TECHNICAL_SPECS.md
3. **Run the tests**: Make sure everything works
4. **Pick an issue**: Find a good first issue to work on
5. **Start coding**: Make your first contribution!

Happy coding! 🚀
