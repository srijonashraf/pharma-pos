# Pharmacy POS API

A NestJS-based REST API for a Pharmacy Point of Sale system with PostgreSQL.

## Features

- **Medicines** - CRUD operations with filtering, search, pagination
- **Customers** - Customer management with search
- **Orders** - Transactional order creation with stock management, VAT calculation, payment processing
- **Security** - Rate limiting, helmet security headers, CORS
- **Validation** - class-validator with whitelist/strict mode

## Tech Stack

- NestJS v11
- TypeORM v0.3
- PostgreSQL v15
- class-validator / class-transformer

## Prerequisites

- Node.js 18+
- PostgreSQL 15+
- npm or yarn

## Setup

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Run migrations
npm run migration:run

# Seed sample data (optional)
npm run seed
```

## Run

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

Server runs on `http://localhost:3000`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/medicines` | List medicines (filter, search, paginate) |
| GET | `/medicines/:id` | Get medicine by ID |
| POST | `/medicines` | Create medicine |
| PATCH | `/medicines/:id` | Update medicine |
| GET | `/customers` | List customers |
| GET | `/customers/:id` | Get customer by ID |
| POST | `/customers` | Create customer |
| GET | `/orders` | List orders |
| GET | `/orders/:id` | Get order with items & payment |
| POST | `/orders` | Create order (transactional) |
| PATCH | `/orders/:id/status` | Update order status |
| GET | `/health` | Health check |

## Response Format

**Success:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Paginated:**
```json
{
  "success": true,
  "data": [...],
  "meta": { "page": 1, "limit": 10, "total": 50 }
}
```

**Error:**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error description",
  "errors": [...],
  "timestamp": "2026-03-23T09:00:00.000Z"
}
```

## Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | Database host | localhost |
| `DB_PORT` | Database port | 5432 |
| `DB_NAME` | Database name | pharma-pos-dev |
| `DB_USER` | Database user | postgres |
| `DB_PASS` | Database password | admin123 |
| `PORT` | Server port | 3000 |
| `VAT_RATE` | VAT percentage | 0.05 |
| `CORS_ORIGIN` | Allowed CORS origin | http://localhost:4200 |
| `NODE_ENV` | Environment | development |

## License

MIT
