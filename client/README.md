# Pharma POS Client

An Angular-based Point of Sale frontend for a Pharmacy system.

## Features

- **Medicine Catalog** – Searchable grid with filtering (in stock, out of stock, discounted) and brand selection
- **Order Cart** – Add/remove items, adjust quantities, apply line-item discounts, real-time subtotals
- **Customer Search** – Searchable dropdown to select or change the active customer
- **Draft Orders** – Save cart snapshots to localStorage, restore or delete from the navbar
- **Payment Modal** – Cash/Card/MFS payment processing with due/return calculation
- **Barcode Scanner** – Quick product lookup via barcode input
- **Responsive Layout** – Mobile-first design with fixed headers/footers and independently scrollable panels

## Tech Stack

- Angular 21
- Tailwind CSS 3
- RxJS 7
- TypeScript 5.9

## Prerequisites

- Node.js 18+
- npm 11+
- Backend API running on `http://localhost:3000`

## Setup

```bash
# Install dependencies
npm install
```

## Run

```bash
# Development
npm start

# Production build
npm run build
```

App runs on `http://localhost:4200`

## Project Structure

```
src/app/
├── core/                    # Services, models, guards
│   ├── models/              # DTOs & interfaces
│   └── services/            # API services (medicine, customer, order)
├── features/                # Feature components
│   ├── medicine-catalog/    # Medicine grid, search, category filter
│   ├── order-cart/          # Cart, cart items, barcode scanner
│   ├── navbar/              # Top navigation bar
│   └── modals/              # Payment, add customer, draft list
├── shared/                  # Reusable components & pipes
│   ├── components/          # Customer search dropdown, icons
│   └── pipes/               # Currency formatting
└── store/                   # State management (cart, UI)
```

## Configuration

| Variable | Description     | Default              |
| -------- | --------------- | -------------------- |
| `apiUrl` | Backend API URL | http://localhost:3000 |

Configured in `src/environments/environment.ts`.

## License

MIT
