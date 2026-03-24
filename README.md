# Pharma POS

A full-stack Pharmacy Point of Sale system with inventory management, customer handling, and transaction processing.

## Overview

Pharma POS is a monorepo containing:
- **Client** – Angular 21 frontend for POS operations
- **Server** – NestJS REST API with PostgreSQL database

## Features

- **Medicine Management** – CRUD operations with filtering, search, pagination, and stock tracking
- **Order Processing** – Transactional order creation with VAT calculation, payment processing, and stock management
- **Customer Management** – Customer creation and searchable selection
- **Draft Orders** – Save and restore cart snapshots via localStorage
- **Barcode Scanner** – Quick product lookup
- **Payment Processing** – Cash, Card, and Mobile Financial Service (MFS) options
- **Security** – Rate limiting, helmet headers, CORS, input validation

## Tech Stack

### Client
- Angular 21
- Tailwind CSS 3
- RxJS 7
- TypeScript 5.9

### Server
- NestJS 11
- TypeORM 0.3
- PostgreSQL 15
- class-validator / class-transformer

## Prerequisites

- Node.js 18+
- PostgreSQL 15+
- npm 11+

## Quick Start

### 1. Database Setup

```bash
# Install PostgreSQL and create a database
createdb pharma-pos-dev
```

### 2. Server

```bash
cd server
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run migration:run
npm run seed      # optional: load sample data
npm run start:dev
```

Server runs on `http://localhost:3000`

### 3. Client

```bash
cd client
npm install
npm start
```

App runs on `http://localhost:4200`

## Project Structure

```
pharma-pos/
├── client/                 # Angular frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/      # Services, models
│   │   │   ├── features/  # Feature components
│   │   │   ├── shared/    # Reusable components
│   │   │   └── store/     # State management
├── server/                 # NestJS backend
│   ├── src/
│   │   ├── database/      # TypeORM, migrations, seeds
│   │   ├── modules/       # Feature modules
│   │   └── common/        # Shared utilities
```

## Configuration

### Server (.env)

| Variable      | Description         | Default               |
| ------------- | ------------------- | --------------------- |
| `DB_HOST`     | Database host       | localhost             |
| `DB_PORT`     | Database port       | 5432                  |
| `DB_NAME`     | Database name       | pharma-pos-dev        |
| `DB_USER`     | Database user       | postgres              |
| `DB_PASS`     | Database password   | admin123              |
| `PORT`        | Server port         | 3000                  |
| `VAT_RATE`    | VAT percentage      | 0.05                  |
| `CORS_ORIGIN` | Allowed CORS origin | http://localhost:4200 |

### Client

API URL configured in `client/src/environments/environment.ts`

## Development

```bash
# Server (watch mode)
cd server && npm run start:dev

# Client (watch mode)
cd client && npm start
```

## API Endpoints

| Method | Endpoint             | Description                               |
| ------ | -------------------- | ----------------------------------------- |
| GET    | `/medicines`         | List medicines (filter, search, paginate) |
| GET    | `/medicines/:id`     | Get medicine by ID                        |
| POST   | `/medicines`         | Create medicine                           |
| PATCH  | `/medicines/:id`     | Update medicine                           |
| GET    | `/customers`         | List customers                            |
| GET    | `/customers/:id`     | Get customer by ID                        |
| POST   | `/customers`         | Create customer                           |
| GET    | `/orders`            | List orders                               |
| GET    | `/orders/:id`        | Get order with items & payment            |
| POST   | `/orders`            | Create order (transactional)              |
| PATCH  | `/orders/:id/status` | Update order status                       |
| GET    | `/health`            | Health check                              |

> For detailed API documentation with request/response formats, see [server/README.md](server/README.md)

## License

MIT
