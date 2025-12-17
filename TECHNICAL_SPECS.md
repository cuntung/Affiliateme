# Affiliateme - Technical Specifications

## API Specifications

### Authentication Endpoints

#### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "fullName": "John Doe"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "fullName": "John Doe"
    },
    "token": "jwt_token"
  }
}
```

#### POST /api/auth/login
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "fullName": "John Doe"
    },
    "token": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

#### POST /api/auth/refresh
Refresh JWT token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "refresh_token"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "token": "new_jwt_token",
    "refreshToken": "new_refresh_token"
  }
}
```

#### POST /api/auth/forgot-password
Initiate password reset process.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

### Link Management Endpoints

#### GET /api/links
Get all affiliate links for the authenticated user.

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `category` (string, optional)
- `network` (string, optional)
- `sortBy` (string: 'created' | 'clicks' | 'title', default: 'created')
- `order` (string: 'asc' | 'desc', default: 'desc')

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "links": [
      {
        "id": "uuid",
        "title": "Product Name",
        "originalUrl": "https://amazon.com/dp/...",
        "shortCode": "abc123",
        "shortUrl": "https://aff.me/abc123",
        "category": "Electronics",
        "networkId": "uuid",
        "networkName": "Amazon Associates",
        "clicks": 150,
        "createdAt": "2025-01-01T00:00:00Z",
        "updatedAt": "2025-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3
    }
  }
}
```

#### POST /api/links
Create a new affiliate link.

**Request Body:**
```json
{
  "originalUrl": "https://amazon.com/dp/...",
  "title": "Product Name",
  "description": "Product description",
  "category": "Electronics",
  "networkId": "uuid"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "link": {
      "id": "uuid",
      "title": "Product Name",
      "originalUrl": "https://amazon.com/dp/...",
      "shortCode": "abc123",
      "shortUrl": "https://aff.me/abc123",
      "category": "Electronics",
      "networkId": "uuid",
      "clicks": 0,
      "createdAt": "2025-01-01T00:00:00Z"
    }
  }
}
```

#### GET /api/links/:id
Get details of a specific link.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "link": {
      "id": "uuid",
      "title": "Product Name",
      "originalUrl": "https://amazon.com/dp/...",
      "shortCode": "abc123",
      "shortUrl": "https://aff.me/abc123",
      "description": "Product description",
      "category": "Electronics",
      "networkId": "uuid",
      "networkName": "Amazon Associates",
      "clicks": 150,
      "conversionRate": 3.5,
      "earnings": 45.50,
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-01-01T00:00:00Z"
    }
  }
}
```

#### PUT /api/links/:id
Update an existing link.

**Request Body:**
```json
{
  "title": "Updated Product Name",
  "description": "Updated description",
  "category": "Home & Garden"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "link": {
      "id": "uuid",
      "title": "Updated Product Name",
      ...
    }
  }
}
```

#### DELETE /api/links/:id
Delete a link.

**Response (204 No Content)**

### Analytics Endpoints

#### GET /api/analytics/overview
Get overview analytics for dashboard.

**Query Parameters:**
- `startDate` (ISO date string, optional)
- `endDate` (ISO date string, optional)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalClicks": 1250,
    "totalEarnings": 450.75,
    "totalLinks": 45,
    "topLinks": [
      {
        "id": "uuid",
        "title": "Product Name",
        "clicks": 350,
        "earnings": 125.50
      }
    ],
    "clicksByDate": [
      {
        "date": "2025-01-01",
        "clicks": 50
      }
    ],
    "earningsByDate": [
      {
        "date": "2025-01-01",
        "earnings": 15.25
      }
    ],
    "topNetworks": [
      {
        "networkName": "Amazon Associates",
        "clicks": 500,
        "earnings": 200.00
      }
    ]
  }
}
```

#### GET /api/analytics/links/:id/stats
Get detailed analytics for a specific link.

**Query Parameters:**
- `startDate` (ISO date string, optional)
- `endDate` (ISO date string, optional)
- `interval` (string: 'day' | 'week' | 'month', default: 'day')

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "linkId": "uuid",
    "totalClicks": 350,
    "uniqueClicks": 280,
    "totalEarnings": 125.50,
    "conversionRate": 4.2,
    "clicksByDate": [...],
    "clicksByCountry": [
      {
        "country": "US",
        "clicks": 200
      }
    ],
    "clicksByReferrer": [
      {
        "referrer": "google.com",
        "clicks": 150
      }
    ]
  }
}
```

### Earnings Endpoints

#### GET /api/earnings
Get earnings records.

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `startDate` (ISO date string, optional)
- `endDate` (ISO date string, optional)
- `networkId` (uuid, optional)
- `status` (string: 'pending' | 'confirmed' | 'paid', optional)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "earnings": [
      {
        "id": "uuid",
        "amount": 25.50,
        "currency": "USD",
        "transactionDate": "2025-01-01",
        "status": "confirmed",
        "networkName": "Amazon Associates",
        "linkTitle": "Product Name",
        "notes": "Commission for sale",
        "createdAt": "2025-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    },
    "summary": {
      "totalAmount": 3500.50,
      "pending": 150.00,
      "confirmed": 2000.50,
      "paid": 1350.00
    }
  }
}
```

#### POST /api/earnings
Add a new earnings record.

**Request Body:**
```json
{
  "amount": 25.50,
  "currency": "USD",
  "transactionDate": "2025-01-01",
  "linkId": "uuid",
  "networkId": "uuid",
  "status": "confirmed",
  "notes": "Commission for sale"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "earning": {
      "id": "uuid",
      "amount": 25.50,
      ...
    }
  }
}
```

### Network Endpoints

#### GET /api/networks
Get all affiliate networks.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "networks": [
      {
        "id": "uuid",
        "name": "Amazon Associates",
        "websiteUrl": "https://affiliate-program.amazon.com",
        "isConnected": true,
        "totalLinks": 15,
        "totalEarnings": 450.75,
        "createdAt": "2025-01-01T00:00:00Z"
      }
    ]
  }
}
```

#### POST /api/networks
Add a new affiliate network.

**Request Body:**
```json
{
  "name": "ShareASale",
  "websiteUrl": "https://shareasale.com",
  "apiEndpoint": "https://api.shareasale.com",
  "apiKey": "encrypted_api_key"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "network": {
      "id": "uuid",
      "name": "ShareASale",
      ...
    }
  }
}
```

## Database Schema Details

### Indexes

**Users Table:**
- Primary key index on `id`
- Unique index on `email`

**Affiliate Links Table:**
- Primary key index on `id`
- Index on `user_id` (for user's links lookup)
- Index on `short_code` (for redirect lookup)
- Index on `network_id` (for network filtering)
- Index on `created_at` (for sorting)

**Clicks Table:**
- Primary key index on `id`
- Index on `link_id` (for link analytics)
- Index on `clicked_at` (for date range queries)
- Composite index on (`link_id`, `clicked_at`)

**Earnings Table:**
- Primary key index on `id`
- Index on `user_id`
- Index on `link_id`
- Index on `network_id`
- Index on `transaction_date`
- Index on `status`

### Constraints

**Foreign Keys:**
- `affiliate_links.user_id` → `users.id` ON DELETE CASCADE
- `affiliate_links.network_id` → `affiliate_networks.id` ON DELETE SET NULL
- `clicks.link_id` → `affiliate_links.id` ON DELETE CASCADE
- `earnings.user_id` → `users.id` ON DELETE CASCADE
- `earnings.link_id` → `affiliate_links.id` ON DELETE SET NULL
- `earnings.network_id` → `affiliate_networks.id` ON DELETE SET NULL

**Check Constraints:**
- `earnings.amount` must be >= 0
- `earnings.currency` must be 3 characters
- `users.email` must match email pattern

## Frontend Component Specifications

### Dashboard Component
```jsx
<Dashboard>
  <StatsOverview>
    <StatCard title="Total Clicks" value={1250} change={+15%} />
    <StatCard title="Total Earnings" value={$450.75} change={+8%} />
    <StatCard title="Active Links" value={45} />
    <StatCard title="Conversion Rate" value={3.5%} change={+0.5%} />
  </StatsOverview>
  
  <Charts>
    <ClicksChart data={clicksByDate} />
    <EarningsChart data={earningsByDate} />
  </Charts>
  
  <RecentActivity>
    <ActivityList items={recentClicks} />
  </RecentActivity>
  
  <TopPerformers>
    <LinksList links={topLinks} />
  </TopPerformers>
</Dashboard>
```

### Link Management Component
```jsx
<LinkManagement>
  <LinkFilters
    onCategoryChange={handleCategoryFilter}
    onNetworkChange={handleNetworkFilter}
    onSearch={handleSearch}
  />
  
  <LinkActions>
    <Button onClick={handleCreateLink}>+ New Link</Button>
    <Button onClick={handleBulkImport}>Import Links</Button>
  </LinkActions>
  
  <LinksList>
    {links.map(link => (
      <LinkCard
        key={link.id}
        link={link}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCopy={handleCopyLink}
      />
    ))}
  </LinksList>
  
  <Pagination
    currentPage={page}
    totalPages={totalPages}
    onPageChange={handlePageChange}
  />
</LinkManagement>
```

## Performance Requirements

### Response Times
- API endpoints: < 500ms (95th percentile)
- Page load time: < 2 seconds
- Time to interactive: < 3 seconds

### Scalability Targets
- Support 10,000+ concurrent users
- Handle 1M+ clicks per day
- Store 100M+ click records

### Caching Strategy
- User session: Redis (30 minutes TTL)
- Dashboard stats: Redis (5 minutes TTL)
- Top links: Redis (15 minutes TTL)
- Network list: Redis (1 hour TTL)

## Security Specifications

### Authentication
- JWT tokens with RS256 algorithm
- Token expiration: 7 days
- Refresh token expiration: 30 days
- Password requirements:
  - Minimum 8 characters
  - At least 1 uppercase letter
  - At least 1 lowercase letter
  - At least 1 number
  - At least 1 special character

### Rate Limiting
- Authentication endpoints: 5 requests per minute
- API endpoints: 100 requests per minute
- Link creation: 10 requests per minute
- Analytics: 30 requests per minute

### Input Validation
- URL validation for affiliate links
- Email validation (RFC 5322)
- SQL injection prevention (parameterized queries)
- XSS prevention (sanitize all inputs)
- CSRF protection (CSRF tokens)

### Data Encryption
- Passwords: bcrypt (10 rounds)
- API keys: AES-256 encryption
- Data in transit: TLS 1.3
- Sensitive fields in DB: encrypted at rest

## Error Handling

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": "specific error details"
    }
  }
}
```

### HTTP Status Codes
- 200: Success
- 201: Created
- 204: No Content
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 409: Conflict
- 422: Unprocessable Entity
- 429: Too Many Requests
- 500: Internal Server Error

### Common Error Codes
- `AUTH_INVALID_CREDENTIALS`: Invalid email or password
- `AUTH_TOKEN_EXPIRED`: JWT token has expired
- `AUTH_INVALID_TOKEN`: Invalid or malformed token
- `VALIDATION_ERROR`: Input validation failed
- `RESOURCE_NOT_FOUND`: Requested resource doesn't exist
- `DUPLICATE_RESOURCE`: Resource already exists
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `NETWORK_ERROR`: External API integration failed

## Testing Requirements

### Unit Tests
- Controllers: > 80% coverage
- Services: > 90% coverage
- Models: > 85% coverage
- Utilities: > 90% coverage

### Integration Tests
- API endpoints: All endpoints tested
- Database operations: CRUD operations tested
- Authentication flow: Complete flow tested
- Network integrations: Mock external APIs

### E2E Tests
- User registration and login
- Link creation and management
- Analytics viewing
- Earnings tracking

## Monitoring & Logging

### Metrics to Track
- API response times
- Error rates
- Active users
- Database query performance
- Cache hit rates
- Network integration success rates

### Logging Levels
- ERROR: Application errors
- WARN: Warnings and deprecations
- INFO: Important business events
- DEBUG: Detailed debugging information

### Log Format
```json
{
  "timestamp": "2025-01-01T00:00:00Z",
  "level": "INFO",
  "message": "User logged in",
  "userId": "uuid",
  "requestId": "uuid",
  "duration": 150,
  "metadata": {}
}
```

This technical specification provides a comprehensive foundation for implementing the Affiliateme platform.
