# Inventory Management System — Software Architecture Document

> **Version:** 1.0  
> **Author:** Senior Software Architect  
> **Stack:** Next.js 15, MongoDB, TypeScript, Tailwind CSS, shadcn/ui  
> **Date:** July 2026

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Architecture Principles](#2-architecture-principles)
3. [Technology Stack](#3-technology-stack)
4. [Project Structure](#4-project-structure)
5. [Data Models](#5-data-models)
6. [Database Design & Indexes](#6-database-design--indexes)
7. [API Architecture](#7-api-architecture)
8. [Authentication & Authorization](#8-authentication--authorization)
9. [State Management](#9-state-management)
10. [Component Architecture](#10-component-architecture)
11. [Routing Structure](#11-routing-structure)
12. [Security Strategy](#12-security-strategy)
13. [Performance Strategy](#13-performance-strategy)
14. [UI/UX Design System](#14-uiux-design-system)
15. [Error Handling Strategy](#15-error-handling-strategy)
16. [Logging & Monitoring](#16-logging--monitoring)
17. [Testing Strategy](#17-testing-strategy)
18. [Deployment Strategy](#18-deployment-strategy)
19. [Implementation Roadmap](#19-implementation-roadmap)

---

## 1. System Overview

A **Premium Inventory Management System** for small retail stores. The application provides full CRUD operations for products, categories, suppliers, stock management, inventory history, reporting, user management with role-based permissions, and a beautiful, responsive dashboard.

### Core Capabilities

- **Product Management** — Create, read, update, delete products with barcode, SKU, pricing, quantity, images
- **Category Management** — Unlimited hierarchical categories
- **Supplier Management** — Supplier profiles with contact info and product associations
- **Stock Management** — Stock-in, stock-out, adjustments, low-stock alerts
- **Inventory History** — Immutable audit log of all inventory changes
- **Dashboard** — Real-time statistics, charts, KPIs, recent activity
- **Reporting** — Inventory, sales, purchase, profit, low-stock reports with PDF/Excel export
- **User Management** — Multi-role system (Admin, Manager, Staff) with granular permissions
- **Authentication** — JWT-based secure authentication with refresh tokens
- **Backup & Restore** — Database backup and restore capabilities
- **Settings** — Configurable store settings, tax, currency, notifications

### User Roles

| Role | Description |
|------|-------------|
| **Super Admin** | Full system access, user management, settings, backup/restore |
| **Admin** | All CRUD operations, reports, stock management |
| **Manager** | Product/stock management, reports, limited settings |
| **Staff** | View products, stock-in, basic operations |

---

## 2. Architecture Principles

1. **Clean Architecture** — Separation into layers: Presentation, Application, Domain, Infrastructure
2. **SOLID Principles** — Single responsibility, open/closed, Liskov substitution, interface segregation, dependency inversion
3. **DRY** — No code duplication; extract shared logic into utilities and hooks
4. **Server-First** — Maximize Server Components, minimize client-side JavaScript
5. **Progressive Enhancement** — Core functionality works without JavaScript
6. **Accessibility** — WCAG 2.1 AA compliance
7. **Security by Design** — Input validation, output encoding, CSRF protection, rate limiting
8. **Observability** — Structured logging, error tracking, performance monitoring

---

## 3. Technology Stack

### Core
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15 (App Router) | React framework with SSR, RSC, Server Actions |
| TypeScript | 5.x | Type safety across entire codebase |
| Node.js | 20 LTS | Runtime |
| MongoDB | 7.x | Primary database |
| Mongoose | 8.x | ODM with schema validation |

### UI / Styling
| Technology | Purpose |
|------------|---------|
| Tailwind CSS | Utility-first styling |
| shadcn/ui | Accessible, composable UI primitives |
| Framer Motion | Declarative animations |
| Lucide React | Consistent icon set |
| Recharts | Dashboard charts |
| next/font | Optimized typography (Inter, JetBrains Mono) |

### Forms & Validation
| Technology | Purpose |
|------------|---------|
| React Hook Form | Performant form management |
| Zod | Schema validation (shared client/server) |

### Authentication
| Technology | Purpose |
|------------|---------|
| jose | JWT signing/verification (Edge-compatible) |
| bcryptjs | Password hashing |
| next/headers | Server-side cookie access |

### Utilities
| Technology | Purpose |
|------------|---------|
| date-fns | Date formatting |
| exceljs | Excel report export |
| jspdf + jspdf-autotable | PDF report export |
| qrcode | QR code generation |
| slugify | URL-safe slug generation |

### Development
| Technology | Purpose |
|------------|---------|
| ESLint | Code linting |
| Prettier | Code formatting |
| lint-staged | Pre-commit checks |
| husky | Git hooks |

---

## 4. Project Structure

```
inventory/
├── .env.example
├── .eslintrc.json
├── .prettierrc
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── components.json          # shadcn/ui config
│
├── public/
│   ├── images/
│   └── icons/
│
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── (auth)/                   # Auth route group
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (dashboard)/              # Dashboard route group
│   │   │   ├── dashboard/
│   │   │   ├── products/
│   │   │   ├── categories/
│   │   │   ├── suppliers/
│   │   │   ├── stock/
│   │   │   ├── history/
│   │   │   ├── reports/
│   │   │   ├── users/
│   │   │   ├── settings/
│   │   │   ├── profile/
│   │   │   ├── backup/
│   │   │   └── layout.tsx
│   │   │
│   │   ├── api/                      # REST API routes
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   ├── register/
│   │   │   │   ├── logout/
│   │   │   │   ├── refresh/
│   │   │   │   └── me/
│   │   │   ├── products/
│   │   │   ├── categories/
│   │   │   ├── suppliers/
│   │   │   ├── stock/
│   │   │   ├── history/
│   │   │   ├── reports/
│   │   │   ├── users/
│   │   │   ├── dashboard/
│   │   │   ├── settings/
│   │   │   ├── backup/
│   │   │   └── upload/
│   │   │
│   │   ├── error.tsx                 # Global error boundary
│   │   ├── global-error.tsx          # Root error boundary
│   │   ├── loading.tsx               # Global loading
│   │   ├── not-found.tsx             # 404 page
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Landing / redirect
│   │
│   ├── components/                   # Shared UI components
│   │   ├── ui/                       # shadcn/ui primitives
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── table.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── select.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── label.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── tooltip.tsx
│   │   │   ├── alert-dialog.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── switch.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── radio-group.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── command.tsx
│   │   │   ├── popover.tsx
│   │   │   ├── calendar.tsx
│   │   │   ├── date-picker.tsx
│   │   │   ├── pagination.tsx
│   │   │   ├── empty-state.tsx
│   │   │   └── error-state.tsx
│   │   │
│   │   ├── layout/                   # Layout components
│   │   │   ├── sidebar.tsx
│   │   │   ├── navbar.tsx
│   │   │   ├── mobile-nav.tsx
│   │   │   ├── breadcrumb.tsx
│   │   │   ├── page-header.tsx
│   │   │   ├── theme-toggle.tsx
│   │   │   ├── user-menu.tsx
│   │   │   └── app-shell.tsx
│   │   │
│   │   ├── data-tables/              # Reusable data table
│   │   │   ├── data-table.tsx
│   │   │   ├── data-table-column-header.tsx
│   │   │   ├── data-table-pagination.tsx
│   │   │   ├── data-table-toolbar.tsx
│   │   │   ├── data-table-faceted-filter.tsx
│   │   │   └── data-table-view-options.tsx
│   │   │
│   │   ├── forms/                    # Form components
│   │   │   ├── product-form.tsx
│   │   │   ├── category-form.tsx
│   │   │   ├── supplier-form.tsx
│   │   │   ├── user-form.tsx
│   │   │   ├── stock-form.tsx
│   │   │   ├── settings-form.tsx
│   │   │   └── profile-form.tsx
│   │   │
│   │   ├── charts/                   # Chart components
│   │   │   ├── area-chart.tsx
│   │   │   ├── bar-chart.tsx
│   │   │   ├── pie-chart.tsx
│   │   │   ├── line-chart.tsx
│   │   │   └── chart-card.tsx
│   │   │
│   │   ├── modals/                   # Modal/dialog components
│   │   │   ├── confirm-delete.tsx
│   │   │   ├── product-modal.tsx
│   │   │   ├── category-modal.tsx
│   │   │   ├── supplier-modal.tsx
│   │   │   ├── stock-modal.tsx
│   │   │   └── user-modal.tsx
│   │   │
│   │   └── shared/                   # Shared components
│   │       ├── image-upload.tsx
│   │       ├── search-input.tsx
│   │       ├── status-badge.tsx
│   │       ├── loading-spinner.tsx
│   │       ├── empty-table.tsx
│   │       ├── page-error.tsx
│   │       ├── pagination.tsx
│   │       ├── filter-bar.tsx
│   │       ├── stat-card.tsx
│   │       └── theme-provider.tsx
│   │
│   ├── lib/                          # Core utilities
│   │   ├── db/                       # Database layer
│   │   │   ├── connection.ts         # MongoDB connection singleton
│   │   │   ├── models/               # Mongoose models
│   │   │   │   ├── user.model.ts
│   │   │   │   ├── product.model.ts
│   │   │   │   ├── category.model.ts
│   │   │   │   ├── supplier.model.ts
│   │   │   │   ├── stock.model.ts
│   │   │   │   ├── history.model.ts
│   │   │   │   ├── settings.model.ts
│   │   │   │   └── backup.model.ts
│   │   │   ├── seed.ts               # Database seeder
│   │   │   └── indexes.ts            # Index definitions
│   │   │
│   │   ├── auth/                     # Authentication
│   │   │   ├── jwt.ts                # JWT utilities
│   │   │   ├── password.ts           # Hashing utilities
│   │   │   ├── session.ts            # Session management
│   │   │   ├── cookies.ts            # Cookie utilities
│   │   │   └── middleware.ts         # Auth middleware
│   │   │
│   │   ├── validations/              # Zod schemas
│   │   │   ├── auth.ts
│   │   │   ├── product.ts
│   │   │   ├── category.ts
│   │   │   ├── supplier.ts
│   │   │   ├── stock.ts
│   │   │   ├── user.ts
│   │   │   ├── settings.ts
│   │   │   └── common.ts
│   │   │
│   │   ├── services/                 # Business logic layer
│   │   │   ├── auth.service.ts
│   │   │   ├── product.service.ts
│   │   │   ├── category.service.ts
│   │   │   ├── supplier.service.ts
│   │   │   ├── stock.service.ts
│   │   │   ├── history.service.ts
│   │   │   ├── dashboard.service.ts
│   │   │   ├── report.service.ts
│   │   │   ├── user.service.ts
│   │   │   ├── settings.service.ts
│   │   │   └── backup.service.ts
│   │   │
│   │   ├── actions/                  # Server Actions
│   │   │   ├── auth.actions.ts
│   │   │   ├── product.actions.ts
│   │   │   ├── category.actions.ts
│   │   │   ├── supplier.actions.ts
│   │   │   ├── stock.actions.ts
│   │   │   ├── user.actions.ts
│   │   │   ├── settings.actions.ts
│   │   │   ├── report.actions.ts
│   │   │   └── dashboard.actions.ts
│   │   │
│   │   ├── api/                      # API route helpers
│   │   │   ├── api-response.ts       # Standardized API responses
│   │   │   ├── api-error.ts          # Error classes
│   │   │   ├── api-handler.ts        # Request wrapper
│   │   │   ├── rate-limit.ts         # Rate limiting
│   │   │   └── pagination.ts         # Pagination helpers
│   │   │
│   │   ├── permissions/              # RBAC system
│   │   │   ├── roles.ts              # Role definitions
│   │   │   ├── permissions.ts        # Permission checks
│   │   │   └── guards.ts             # Authorization guards
│   │   │
│   │   └── utils/                    # General utilities
│   │       ├── constants.ts
│   │       ├── formatters.ts         # Currency, date, number formatters
│   │       ├── validators.ts         # Client-side validation helpers
│   │       ├── cn.ts                 # clsx + twMerge utility
│   │       ├── slug.ts               # Slug generation
│   │       ├── barcode.ts            # Barcode generation
│   │       ├── image.ts              # Image optimization
│   │       ├── export.ts             # PDF/Excel export helpers
│   │       └── logger.ts             # Structured logging
│   │
│   ├── hooks/                        # React hooks
│   │   ├── use-auth.ts
│   │   ├── use-debounce.ts
│   │   ├── use-media-query.ts
│   │   ├── use-pagination.ts
│   │   ├── use-search.ts
│   │   ├── use-filters.ts
│   │   ├── use-local-storage.ts
│   │   ├── use-toast.ts
│   │   └── use-mounted.ts
│   │
│   ├── providers/                    # Context providers
│   │   ├── auth-provider.tsx
│   │   ├── theme-provider.tsx
│   │   ├── toast-provider.tsx
│   │   └── query-provider.tsx
│   │
│   ├── types/                        # TypeScript type definitions
│   │   ├── index.ts
│   │   ├── auth.ts
│   │   ├── product.ts
│   │   ├── category.ts
│   │   ├── supplier.ts
│   │   ├── stock.ts
│   │   ├── history.ts
│   │   ├── report.ts
│   │   ├── user.ts
│   │   ├── dashboard.ts
│   │   ├── settings.ts
│   │   └── common.ts
│   │
│   ├── middleware.ts                 # Next.js middleware (auth)
│   └── config.ts                     # Application configuration
│
└── scripts/
    ├── seed.ts                       # Seed script
    └── backup.ts                     # CLI backup utility
```

---

## 5. Data Models

### 5.1 User

```typescript
interface User {
  _id: ObjectId;
  name: string;
  email: string;                    // unique, indexed
  password: string;                 // bcrypt hash
  role: 'super_admin' | 'admin' | 'manager' | 'staff';
  avatar?: string;
  phone?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### 5.2 Category

```typescript
interface Category {
  _id: ObjectId;
  name: string;                     // unique
  slug: string;                     // unique, indexed
  description?: string;
  parent?: ObjectId;                // self-reference for hierarchy
  image?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### 5.3 Supplier

```typescript
interface Supplier {
  _id: ObjectId;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  notes?: string;
  isActive: boolean;
  productCount: number;             // denormalized for performance
  createdAt: Date;
  updatedAt: Date;
}
```

### 5.4 Product

```typescript
interface Product {
  _id: ObjectId;
  name: string;                     // indexed (text)
  barcode?: string;                 // unique, sparse
  sku: string;                      // unique, indexed
  category: ObjectId;               // ref Category
  description?: string;
  image?: string;
  purchasePrice: number;
  sellingPrice: number;
  quantity: number;                 // current stock
  minQuantity: number;              // low stock threshold
  supplier?: ObjectId;              // ref Supplier
  status: 'active' | 'inactive' | 'discontinued';
  tags?: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### 5.5 Stock Movement

```typescript
type StockType = 'stock_in' | 'stock_out' | 'adjustment' | 'return';

interface StockMovement {
  _id: ObjectId;
  product: ObjectId;                // ref Product, indexed
  type: StockType;
  quantity: number;                 // positive for in, negative for out
  previousQuantity: number;
  newQuantity: number;
  reference?: string;               // invoice, PO number, etc.
  notes?: string;
  performedBy: ObjectId;            // ref User
  createdAt: Date;
}
```

### 5.6 Inventory History (aggregated view)

```typescript
interface InventoryHistory {
  _id: ObjectId;
  product: ObjectId;                // ref Product, indexed
  action: 'created' | 'updated' | 'stock_in' | 'stock_out' | 'adjustment' | 'deleted';
  changes?: Record<string, { from: any; to: any }>;
  performedBy: ObjectId;            // ref User
  createdAt: Date;
}
```

### 5.7 Settings

```typescript
interface Settings {
  _id: ObjectId;
  storeName: string;
  storeEmail?: string;
  storePhone?: string;
  storeAddress?: string;
  currency: string;                 // default: 'USD'
  currencySymbol: string;           // default: '$'
  taxRate: number;                  // percentage
  lowStockThreshold: number;        // default: 10
  timezone: string;
  dateFormat: string;
  notifications: {
    lowStock: boolean;
    dailyReport: boolean;
  };
  updatedBy: ObjectId;              // ref User
  updatedAt: Date;
}
```

### 5.8 Backup Record

```typescript
interface BackupRecord {
  _id: ObjectId;
  filename: string;
  size: number;                     // bytes
  collections: string[];
  status: 'completed' | 'failed' | 'in_progress';
  createdBy: ObjectId;              // ref User
  createdAt: Date;
}
```

---

## 6. Database Design & Indexes

### Connection Strategy

- Singleton MongoDB connection with caching to prevent hot-reload connection exhaustion
- Mongoose with bufferCommands: false for fail-fast behavior
- Connection retry with exponential backoff

### Indexes

```typescript
// Users
users: { email: 1 }                           // unique
users: { role: 1 }

// Categories
categories: { slug: 1 }                       // unique
categories: { parent: 1 }
categories: { sortOrder: 1 }

// Suppliers
suppliers: { name: 1 }                        // text index
suppliers: { isActive: 1 }

// Products
products: { sku: 1 }                          // unique
products: { barcode: 1 }                      // unique sparse
products: { name: 'text', description: 'text' } // text index for search
products: { category: 1 }
products: { supplier: 1 }
products: { status: 1, isActive: 1 }
products: { quantity: 1 }                     // for low-stock queries
products: { createdAt: -1 }

// Stock Movements
stock_movements: { product: 1, createdAt: -1 }
stock_movements: { type: 1, createdAt: -1 }
stock_movements: { performedBy: 1 }
stock_movements: { createdAt: -1 }

// Inventory History
inventory_history: { product: 1, createdAt: -1 }
inventory_history: { performedBy: 1 }
inventory_history: { action: 1 }
inventory_history: { createdAt: -1 }

// Settings
settings: { storeName: 1 }
```

### Data Relationships

- Products → Category: Many-to-One (reference)
- Products → Supplier: Many-to-One (reference, optional)
- Stock Movements → Product: Many-to-One (reference)
- Stock Movements → User: Many-to-One (reference)
- History → Product: Many-to-One (reference)
- History → User: Many-to-One (reference)
- Category → Category: Self-referencing for hierarchy

### Denormalization Decisions

- `productCount` on Supplier — updated via aggregation hooks, avoids frequent count queries
- `previousQuantity` and `newQuantity` on StockMovement — provides snapshot without querying product

---

## 7. API Architecture

### REST API Pattern

All API routes follow a consistent pattern:

```
GET    /api/resource          — List (paginated, filterable, searchable)
GET    /api/resource/:id      — Get single
POST   /api/resource          — Create
PATCH  /api/resource/:id      — Update
DELETE /api/resource/:id      — Delete
```

### API Response Format

```typescript
// Success
{
  success: true,
  data: T | T[],
  pagination?: {
    page: number,
    limit: number,
    total: number,
    totalPages: number
  },
  meta?: Record<string, any>
}

// Error
{
  success: false,
  error: {
    code: string,
    message: string,
    details?: any
  }
}
```

### API Routes

| Method | Route | Auth | Roles | Description |
|--------|-------|------|-------|-------------|
| POST | /api/auth/login | No | — | Login |
| POST | /api/auth/register | No | — | Register (first user becomes super_admin) |
| POST | /api/auth/logout | Yes | * | Logout |
| POST | /api/auth/refresh | No | — | Refresh token |
| GET | /api/auth/me | Yes | * | Current user |
| GET | /api/products | Yes | * | List products |
| POST | /api/products | Yes | Admin, Manager | Create product |
| GET | /api/products/:id | Yes | * | Get product |
| PATCH | /api/products/:id | Yes | Admin, Manager | Update product |
| DELETE | /api/products/:id | Yes | Admin | Delete product |
| GET | /api/categories | Yes | * | List categories |
| POST | /api/categories | Yes | Admin, Manager | Create category |
| PATCH | /api/categories/:id | Yes | Admin, Manager | Update category |
| DELETE | /api/categories/:id | Yes | Admin | Delete category |
| GET | /api/suppliers | Yes | * | List suppliers |
| POST | /api/suppliers | Yes | Admin, Manager | Create supplier |
| PATCH | /api/suppliers/:id | Yes | Admin, Manager | Update supplier |
| DELETE | /api/suppliers/:id | Yes | Admin | Delete supplier |
| POST | /api/stock/in | Yes | Admin, Manager, Staff | Stock in |
| POST | /api/stock/out | Yes | Admin, Manager, Staff | Stock out |
| POST | /api/stock/adjust | Yes | Admin, Manager | Adjust stock |
| GET | /api/stock/movements | Yes | * | List movements |
| GET | /api/history | Yes | * | Inventory history |
| GET | /api/dashboard/stats | Yes | * | Dashboard statistics |
| GET | /api/dashboard/charts | Yes | * | Chart data |
| GET | /api/dashboard/recent | Yes | * | Recent activity |
| GET | /api/reports/inventory | Yes | Admin, Manager | Inventory report |
| GET | /api/reports/sales | Yes | Admin, Manager | Sales report |
| GET | /api/reports/low-stock | Yes | * | Low stock report |
| GET | /api/reports/profit | Yes | Admin, Manager | Profit report |
| GET | /api/reports/export | Yes | Admin, Manager | Export (PDF/Excel) |
| GET | /api/users | Yes | Super Admin | List users |
| POST | /api/users | Yes | Super Admin | Create user |
| PATCH | /api/users/:id | Yes | Super Admin | Update user |
| DELETE | /api/users/:id | Yes | Super Admin | Delete user |
| GET | /api/settings | Yes | Admin | Get settings |
| PATCH | /api/settings | Yes | Super Admin | Update settings |
| POST | /api/backup | Yes | Super Admin | Create backup |
| GET | /api/backup | Yes | Super Admin | List backups |
| POST | /api/backup/restore/:id | Yes | Super Admin | Restore backup |
| POST | /api/upload | Yes | Admin, Manager | Upload image |

### Server Actions

Server Actions are used for forms and mutations that benefit from progressive enhancement:

- `loginAction` — authenticate user
- `registerAction` — create account
- `createProductAction` — create product with validation
- `updateProductAction` — update product
- `deleteProductAction` — delete product
- `createCategoryAction` — create category
- `updateCategoryAction` — update category
- `deleteCategoryAction` — delete category
- `stockInAction` — receive stock
- `stockOutAction` — sell/dispatch stock
- `stockAdjustAction` — adjust stock
- `updateSettingsAction` — save settings
- `updateProfileAction` — update profile
- `createUserAction` — create user (admin)
- `updateUserAction` — update user
- `exportReportAction` — generate and return report file

---

## 8. Authentication & Authorization

### JWT Strategy

- **Access Token**: 15-minute expiry, stored in HTTP-only cookie
- **Refresh Token**: 7-day expiry, stored in HTTP-only cookie with `Secure`, `SameSite=Strict`
- **Algorithm**: HS256 with 256-bit secret
- **Payload**: `{ userId, role, iat, exp }`

### Authentication Flow

1. User submits credentials → `POST /api/auth/login`
2. Server validates → creates session → sets cookies
3. Next.js middleware reads cookie → attaches user to request
4. Protected routes check authentication + authorization
5. On expiry → `POST /api/auth/refresh` returns new access token
6. On logout → cookies cleared

### Middleware Chain

```
Request → Rate Limiter → JWT Verification → Role Guard → Handler
```

### Role-Based Access Control (RBAC)

```typescript
const PERMISSIONS = {
  products: {
    read: ['super_admin', 'admin', 'manager', 'staff'],
    create: ['super_admin', 'admin', 'manager'],
    update: ['super_admin', 'admin', 'manager'],
    delete: ['super_admin', 'admin'],
  },
  categories: {
    read: ['super_admin', 'admin', 'manager', 'staff'],
    create: ['super_admin', 'admin', 'manager'],
    update: ['super_admin', 'admin', 'manager'],
    delete: ['super_admin', 'admin'],
  },
  suppliers: { /* same as categories */ },
  stock: {
    read: ['super_admin', 'admin', 'manager', 'staff'],
    create: ['super_admin', 'admin', 'manager', 'staff'],
    adjust: ['super_admin', 'admin', 'manager'],
  },
  users: {
    read: ['super_admin'],
    create: ['super_admin'],
    update: ['super_admin'],
    delete: ['super_admin'],
  },
  settings: {
    read: ['super_admin', 'admin'],
    update: ['super_admin'],
  },
  backup: {
    create: ['super_admin'],
    restore: ['super_admin'],
  },
  reports: {
    read: ['super_admin', 'admin', 'manager'],
  },
};
```

### Next.js Middleware

```typescript
// src/middleware.ts
// 1. Check public routes (login, register, API auth)
// 2. Verify JWT from cookie
// 3. Redirect to login if unauthorized
// 4. Check role permissions for protected routes
// 5. Allow/deny based on role
// 6. Set user header for downstream handlers
```

---

## 9. State Management

### Strategy: Server State + Minimal Client State

| State Type | Solution | Details |
|------------|----------|---------|
| **Server State** | Server Components + Server Actions | Data fetched directly in server components, mutations via server actions |
| **URL State** | useSearchParams, useParams | Search queries, filters, pagination stored in URL |
| **Form State** | React Hook Form | Local form state with Zod validation |
| **UI State** | React useState/useReducer | Modals, toasts, sidebar, theme |
| **Auth State** | Cookies + AuthProvider | Auth context derived from cookie, verified server-side |
| **Theme** | next-themes | Light/dark mode persistence |

### Data Fetching Pattern

```typescript
// Server Component — direct DB access
async function ProductsPage() {
  const products = await productService.list({ page, limit, search });
  return <ProductsTable data={products} />;
}

// Client mutation via Server Action
'use server';
async function createProductAction(data: ProductInput) {
  const validated = productSchema.parse(data);
  await productService.create(validated);
  revalidatePath('/products');
}
```

---

## 10. Component Architecture

### Component Hierarchy

```
App Shell
├── Sidebar (Server)
│   ├── Logo
│   ├── Nav Links
│   ├── Theme Toggle
│   └── User Menu
├── Navbar (Client)
│   ├── Breadcrumbs
│   ├── Search Command (⌘K)
│   └── Notifications
└── Main Content (Server)
    ├── Page Header
    ├── Data Table / Custom Content
    └── Modals (Client via Interception)

Data Table
├── Toolbar
│   ├── Search Input
│   ├── Filter Dropdowns
│   ├── View Options
│   └── Action Button
├── Table
│   ├── Column Headers (sortable)
│   ├── Rows
│   └── Selection Checkboxes
├── Pagination
└── Empty State / Loading State
```

### Component Categories

1. **Server Components** — Pages, layouts, data-fetching wrappers, static content
2. **Client Components** — Interactive elements: forms, modals, toasts, charts, search, data tables with interactivity
3. **Shared Primitives** — shadcn/ui components, fully accessible, theme-aware
4. **Feature Components** — ProductForm, CategoryForm, StockModal, etc.
5. **Layout Components** — Sidebar, Navbar, AppShell

### Naming Conventions

- Components: `PascalCase.tsx`
- Hooks: `use-camel-case.ts`
- Utils: `camel-case.ts`
- Types: `camel-case.ts` (exported interfaces)
- Actions: `camel-case.actions.ts`
- Services: `camel-case.service.ts`
- Models: `camel-case.model.ts`

---

## 11. Routing Structure

```
/                          → Redirect to /dashboard or /login
/login                     → Login page (public)
/register                  → Register page (public)

/dashboard                 → Dashboard home (protected)
/products                  → Product list (protected)
/products/new              → Create product (protected)
/products/:id              → Product detail (protected)
/products/:id/edit         → Edit product (protected)

/categories                → Category list (protected)
/categories/new            → Create category (protected)
/categories/:id/edit       → Edit category (protected)

/suppliers                 → Supplier list (protected)
/suppliers/new             → Create supplier (protected)
/suppliers/:id             → Supplier detail (protected)
/suppliers/:id/edit        → Edit supplier (protected)

/stock                     → Stock management (protected)
/stock/movements           → Movement history (protected)

/history                   → Inventory history (protected)

/reports                   → Reports hub (protected)
/reports/inventory         → Inventory report
/reports/sales             → Sales report
/reports/purchases         → Purchase report
/reports/profit            → Profit report
/reports/low-stock         → Low stock report

/users                     → User management (Super Admin only)
/users/new                 → Create user
/users/:id/edit            → Edit user

/settings                  → Store settings (Admin+)
/profile                   → User profile

/backup                    → Backup & Restore (Super Admin only)
```

### Route Groups

- `(auth)` — Public routes (login, register), minimal layout
- `(dashboard)` — Protected routes, full dashboard layout with sidebar

### Route Interception

- `(..)products/new` — Modal-based creation from product list
- `(..)categories/new` — Modal-based creation from category list
- `(..)suppliers/new` — Modal-based creation from supplier list
- `(..)stock/movements/new` — Modal-based stock movement

### Parallel Routes

- `@modal` — Route intercept for modal dialogs
- `@sidebar` — Persistent sidebar

---

## 12. Security Strategy

### Authentication & Session
- HTTP-only cookies prevent XSS token theft
- Short-lived access tokens (15 min)
- Refresh token rotation
- Secure, SameSite=Strict cookies
- Password hashing with bcryptjs (salt rounds: 12)

### Input Validation
- Zod schemas validate all inputs server-side
- Sanitization of string inputs
- File upload type/size validation
- MongoDB injection prevention via Mongoose (parameterized queries)

### API Security
- Rate limiting headers (X-RateLimit-Limit, X-RateLimit-Remaining)
- CORS restricted to same origin
- Helmet-like security headers via Next.js
- CSRF protection via SameSite cookies + custom header check

### Data Protection
- No sensitive data in URLs
- Pagination limits enforced (max 100 per page)
- Field filtering — never expose password hashes
- Request size limits

### Infrastructure
- Environment variables for secrets (never hardcoded)
- .env.example without real values
- Error messages don't leak implementation details

---

## 13. Performance Strategy

### Next.js Optimizations
- **Server Components** by default — minimize client bundle
- **Streaming** — Suspense boundaries for progressive rendering
- **Dynamic Imports** — Heavy components (charts, editors) loaded lazily
- **Image Optimization** — next/image with remote patterns, WebP format
- **Font Optimization** — next/font with Inter and JetBrains Mono

### Data Fetching
- **React.cache** — Deduplicate requests in same render pass
- **Pagination** — Cursor or offset-based with configurable limits
- **Search** — Debounced search (300ms) with text indexes
- **Aggregation Pipeline** — MongoDB aggregation for dashboard/reports

### Caching Strategy
- **Next.js Data Cache** — Cache stable data (settings, categories)
- **Router Cache** — Client-side navigation caching
- **MongoDB** — Connection pooling, read preference for secondaries

### Bundle Optimization
- Code splitting by route segments
- Tree-shaking for unused exports
- Dynamic imports for charts, PDF generation, Excel export
- `next/dynamic` with loading states

### Loading Strategy
- Route-level `loading.tsx` with skeleton screens
- Suspense boundaries for async components
- Progressive loading: skeleton → content
- Instant navigation with pre-fetching

---

## 14. UI/UX Design System

### Visual Language

| Element | Light Mode | Dark Mode |
|---------|-----------|-----------|
| Background | `#fafafa` / white | `#0a0a0a` / `#111` |
| Surface (cards) | white / `#f5f5f5` | `#1a1a1a` / `#222` |
| Primary | `#6366f1` (indigo) | `#818cf8` |
| Secondary | `#8b5cf6` (violet) | `#a78bfa` |
| Accent | `#06b6d4` (cyan) | `#22d3ee` |
| Success | `#10b981` (emerald) | `#34d399` |
| Warning | `#f59e0b` (amber) | `#fbbf24` |
| Error | `#ef4444` (red) | `#f87171` |
| Text Primary | `#111` | `#fafafa` |
| Text Secondary | `#666` | `#888` |
| Border | `#e5e7eb` | `#2a2a2a` |
| Glass | `rgba(255,255,255,0.7)` | `rgba(0,0,0,0.4)` |

### Typography
- **Headings**: Inter (sans-serif), weight 600–700
- **Body**: Inter, weight 400–500
- **Monospace**: JetBrains Mono (code, IDs, numbers)
- **Scale**: 12, 14, 16, 18, 20, 24, 30, 36, 48px

### Spacing System
- Base unit: 4px
- `space-1` = 4px, `space-2` = 8px, ..., `space-10` = 40px
- Consistent padding/margin using Tailwind spacing scale

### Effects
- **Glassmorphism**: `backdrop-blur-xl bg-white/70 dark:bg-black/40`
- **Shadows**: Soft layered shadows, `shadow-sm` to `shadow-xl`
- **Border Radius**: `rounded-lg` (8px) for cards, `rounded-xl` (12px) for modals, `rounded-full` for avatars
- **Transitions**: 200ms ease-in-out for interactive elements

### Animations
- Page transitions: Fade + subtle slide (Framer Motion)
- Hover: Scale 1.02, shadow lift
- Modal: Backdrop blur + scale entrance
- Toast: Slide in from right
- Skeleton: Pulse animation
- Sidebar: Smooth collapse/expand
- List items: Staggered entrance
- Charts: Animated entrance (Recharts built-in)

### Responsive Breakpoints
| Breakpoint | Width | Layout |
|-----------|-------|--------|
| Mobile | < 640px | Single column, bottom nav |
| Tablet | 640–1024px | Sidebar collapsed, grid adapts |
| Desktop | 1024–1280px | Full sidebar, multi-column |
| Wide | > 1280px | Max-width container |

### Accessibility
- All interactive elements focus-visible
- Skip-to-content link
- ARIA labels on all icons
- Color contrast ratios > 4.5:1
- Reduced motion support
- Keyboard navigation for all features
- Screen reader friendly tables
- Form error announcements

---

## 15. Error Handling Strategy

### Client Errors
```typescript
// Global error boundary
// - Catches rendering errors
// - Shows friendly error UI with retry button
// - Logs to console in development

// API errors
// - Consistent error shape
// - Toast notifications for mutations
// - Inline form errors for validation
// - Fallback UI for server errors
```

### Server Errors
```typescript
// API routes
// - try/catch wrapper in apiHandler
// - Structured error logging
// - Appropriate HTTP status codes
// - No stack traces in production

// Server Actions
// - Return { success: false, error: message }
// - Client shows toast on error
// - revalidatePath on success

// Database errors
// - Connection errors → 503 Service Unavailable
// - Validation errors → 400 Bad Request
// - Duplicate key → 409 Conflict
// - Cast errors → 400 Bad Request
```

### Error Hierarchy
```
AppError (base)
├── AuthenticationError (401)
├── AuthorizationError (403)
├── NotFoundError (404)
├── ValidationError (400)
├── ConflictError (409)
├── RateLimitError (429)
└── InternalError (500)
```

---

## 16. Logging & Monitoring

### Logging Strategy
- **Structured JSON logs** via `pino` or custom logger
- **Log levels**: debug, info, warn, error, fatal
- **Context**: requestId, userId, action, duration
- **No sensitive data** in logs (passwords, tokens, PII)

### What to Log
- Authentication attempts (success/failure)
- All mutations (create, update, delete) with user info
- Stock movements (critical audit trail)
- Error stack traces (development only)
- API request durations

### Monitoring (Future)
- API response times
- Error rates
- Database query performance
- Active users
- Stock alerts

---

## 17. Testing Strategy

### Unit Tests (Vitest)
- Services (business logic)
- Utilities and helpers
- Validation schemas
- Permission guards

### Integration Tests
- API routes (request → response)
- Database operations
- Authentication flow

### Component Tests (Testing Library)
- Form components
- Data table
- Modals
- Auth flows

### E2E Tests (Playwright — Future)
- Login flow
- Product CRUD
- Stock management
- Report generation

---

## 18. Deployment Strategy

### Environment Configuration
- `.env.local` — Local development
- `.env.example` — Template with placeholders
- Variables: `MONGODB_URI`, `JWT_SECRET`, `NEXT_PUBLIC_APP_URL`, etc.

### Build Optimizations
- `next build` with static generation where possible
- Bundle analyzer for monitoring bundle size
- Image optimization during build

### Deployment Targets
- **Primary**: Vercel (optimized for Next.js)
- **Alternative**: Docker container on any Node.js host

### CI/CD Pipeline (Future)
- Lint → Type check → Test → Build → Deploy
- Preview deployments for feature branches
- Environment promotion: dev → staging → production

---

## 19. Implementation Roadmap

### Phase 1 — Architecture & Project Setup (Current)
- [x] Complete Software Architecture Document
- [ ] Initialize Next.js 15 project with TypeScript
- [ ] Configure Tailwind CSS, shadcn/ui
- [ ] Set up ESLint, Prettier
- [ ] Create folder structure
- [ ] Configure environment variables
- [ ] Set up MongoDB connection
- [ ] Create base types and constants

### Phase 2 — Authentication System
- [ ] User model with Mongoose
- [ ] JWT utilities (sign, verify, refresh)
- [ ] Password hashing service
- [ ] Login/Register API routes
- [ ] Auth middleware and Next.js middleware
- [ ] Auth provider (client context)
- [ ] Login/Register pages
- [ ] Password recovery flow

### Phase 3 — Dashboard Layout
- [ ] App shell with sidebar + navbar
- [ ] Sidebar navigation with active states
- [ ] Mobile responsive navigation
- [ ] Theme toggle (light/dark)
- [ ] User menu with dropdown
- [ ] Breadcrumb component
- [ ] Page header component
- [ ] Skeleton loading components
- [ ] Toast notification system

### Phase 4 — Dashboard Page
- [ ] Dashboard service (aggregation queries)
- [ ] Dashboard API routes
- [ ] Stats cards (today's sales, inventory value, low stock, out of stock)
- [ ] Area chart (revenue over time)
- [ ] Bar chart (top products)
- [ ] Pie chart (category distribution)
- [ ] Recent activities list
- [ ] Low stock alerts
- [ ] Server Actions for dashboard data

### Phase 5 — Product Management
- [ ] Product model with Mongoose
- [ ] Product validation schemas (Zod)
- [ ] Product service (CRUD + search + filters)
- [ ] Product API routes
- [ ] Product list page with Data Table
- [ ] Product form (create/edit)
- [ ] Product detail page
- [ ] Image upload for products
- [ ] Server Actions for products

### Phase 6 — Category Management
- [ ] Category model with Mongoose
- [ ] Category validation schemas
- [ ] Category service
- [ ] Category API routes
- [ ] Category list page
- [ ] Category form (create/edit)
- [ ] Hierarchical category display
- [ ] Server Actions for categories

### Phase 7 — Supplier Management
- [ ] Supplier model
- [ ] Supplier validation
- [ ] Supplier service
- [ ] Supplier API
- [ ] Supplier list page
- [ ] Supplier form
- [ ] Supplier detail page with products list
- [ ] Server Actions

### Phase 8 — Stock Management
- [ ] Stock movement model
- [ ] Stock validation
- [ ] Stock service (in/out/adjust)
- [ ] Stock API routes
- [ ] Stock-in form
- [ ] Stock-out form
- [ ] Stock adjustment form
- [ ] Movement history list
- [ ] Automatic history logging
- [ ] Server Actions

### Phase 9 — Inventory History
- [ ] History model
- [ ] History service with aggregation
- [ ] History API routes
- [ ] History list with filters
- [ ] History detail view
- [ ] Advanced filtering (date range, action type, user)

### Phase 10 — Reporting System
- [ ] Report service (aggregation pipelines)
- [ ] Inventory report
- [ ] Sales report
- [ ] Purchase report
- [ ] Profit report
- [ ] Low stock report
- [ ] Most sold products
- [ ] PDF export (jspdf)
- [ ] Excel export (exceljs)
- [ ] Report pages with charts

### Phase 11 — User Management
- [ ] User service (admin CRUD)
- [ ] User validation
- [ ] User API routes
- [ ] User list page
- [ ] User create/edit form
- [ ] Role assignment
- [ ] Profile page
- [ ] Password change

### Phase 12 — Settings & Backup
- [ ] Settings model (singleton)
- [ ] Settings service
- [ ] Settings page with form
- [ ] Backup service (mongodump)
- [ ] Backup list
- [ ] Backup creation
- [ ] Backup restore
- [ ] Server Actions

### Phase 13 — Final Polish
- [ ] Empty states everywhere
- [ ] Error boundaries
- [ ] Loading skeletons
- [ ] Animations refinement
- [ ] Mobile responsiveness audit
- [ ] Accessibility audit
- [ ] Performance audit
- [ ] Security audit
- [ ] SEO optimization
- [ ] Final testing

---

## Appendix A: Environment Variables

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
APP_NAME=InventoryManager

# Database
MONGODB_URI=mongodb://localhost:27017/inventory

# Authentication
JWT_SECRET=your-256-bit-secret
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Upload
UPLOAD_DIR=public/uploads
MAX_FILE_SIZE=5242880

# Rate Limit
RATE_LIMIT_WINDOW=60000
RATE_LIMIT_MAX=100

# Backup
BACKUP_DIR=./backups
```

## Appendix B: Package Dependencies

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "typescript": "^5.0.0",
    "mongoose": "^8.0.0",
    "bcryptjs": "^2.4.3",
    "jose": "^5.0.0",
    "zod": "^3.0.0",
    "react-hook-form": "^7.0.0",
    "@hookform/resolvers": "^3.0.0",
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.400.0",
    "recharts": "^2.0.0",
    "date-fns": "^3.0.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "class-variance-authority": "^0.7.0",
    "@radix-ui/react-dialog": "^1.0.0",
    "@radix-ui/react-dropdown-menu": "^2.0.0",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-tabs": "^1.0.0",
    "@radix-ui/react-toast": "^1.0.0",
    "@radix-ui/react-tooltip": "^1.0.0",
    "@radix-ui/react-popover": "^1.0.0",
    "@radix-ui/react-switch": "^1.0.0",
    "@radix-ui/react-checkbox": "^1.0.0",
    "@radix-ui/react-label": "^2.0.0",
    "@radix-ui/react-separator": "^1.0.0",
    "@radix-ui/react-slot": "^1.0.0",
    "@radix-ui/react-alert-dialog": "^1.0.0",
    "@radix-ui/react-avatar": "^1.0.0",
    "next-themes": "^0.3.0",
    "slugify": "^1.6.6",
    "exceljs": "^4.4.0",
    "jspdf": "^2.5.0",
    "jspdf-autotable": "^3.8.0",
    "sonner": "^1.0.0",
    "cmdk": "^1.0.0",
    "qrcode": "^1.5.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@types/bcryptjs": "^2.4.0",
    "eslint": "^9.0.0",
    "prettier": "^3.0.0",
    "postcss": "^8.0.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.0.0",
    "@tailwindcss/forms": "^0.5.0",
    "@tailwindcss/typography": "^0.5.0",
    "@tailwindcss/aspect-ratio": "^0.4.0",
    "husky": "^9.0.0",
    "lint-staged": "^15.0.0",
    "eslint-config-next": "^15.0.0"
  }
}
```

---

## Appendix C: Color Token Reference

```css
:root {
  --background: 0 0% 98%;
  --foreground: 0 0% 7%;
  --card: 0 0% 100%;
  --card-foreground: 0 0% 7%;
  --popover: 0 0% 100%;
  --popover-foreground: 0 0% 7%;
  --primary: 239 84% 67%;
  --primary-foreground: 0 0% 100%;
  --secondary: 271 81% 56%;
  --secondary-foreground: 0 0% 100%;
  --muted: 0 0% 96%;
  --muted-foreground: 0 0% 40%;
  --accent: 187 92% 42%;
  --accent-foreground: 0 0% 100%;
  --destructive: 0 84% 60%;
  --destructive-foreground: 0 0% 100%;
  --border: 0 0% 90%;
  --input: 0 0% 90%;
  --ring: 239 84% 67%;
  --radius: 0.75rem;
}

.dark {
  --background: 0 0% 4%;
  --foreground: 0 0% 98%;
  --card: 0 0% 7%;
  --card-foreground: 0 0% 98%;
  --popover: 0 0% 7%;
  --popover-foreground: 0 0% 98%;
  --primary: 239 91% 74%;
  --primary-foreground: 0 0% 7%;
  --secondary: 271 88% 74%;
  --secondary-foreground: 0 0% 7%;
  --muted: 0 0% 13%;
  --muted-foreground: 0 0% 53%;
  --accent: 187 88% 53%;
  --accent-foreground: 0 0% 7%;
  --destructive: 0 84% 60%;
  --destructive-foreground: 0 0% 98%;
  --border: 0 0% 16%;
  --input: 0 0% 16%;
  --ring: 239 91% 74%;
}
```

---

## Appendix D: shadcn/ui Components to Add

All components from shadcn/ui that will be customized:

- Button, Input, Textarea, Label
- Card, Badge, Avatar
- Dialog, AlertDialog, Sheet
- DropdownMenu, Popover
- Select, Tabs, Switch, Checkbox, RadioGroup
- Table, Pagination
- Skeleton, Progress
- Tooltip, Toast (Sonner)
- Command (CommandMenu)
- Separator, Calendar
- Form (via React Hook Form adapter)
- AspectRatio

---

*End of Architecture Document*
