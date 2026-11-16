# NOVA Commerce

> A modern, multi-vendor e-commerce platform built for the next generation of online shopping.

![NOVA Commerce](https://img.shields.io/badge/NOVA-Commerce-purple?style=for-the-badge)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript)
![Cloudflare Workers](https://img.shields.io/badge/Cloudflare_Workers-0058F2?style=for-the-badge&logo=cloudflare)
![D1 Database](https://img.shields.io/badge/D1_Database-0058F2?style=for-the-badge&logo=cloudflare)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwindcss)

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm 10+
- Docker (optional, for local development)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd onlineshop

# Install all dependencies
npm install

# Set up environment variables
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env

# Start development (frontend + backend)
npm run dev

# Start frontend only
npm run dev --workspace=frontend

# Start backend only
npm run dev --workspace=backend

# Run database migrations
npm run db:migrate

# Seed development data
npm run db:seed

# Build for production
npm run build
```

### Docker Development
```bash
docker-compose up -d
```

## 📁 Project Structure

```
onlineshop/
├── frontend/                    # React + Vite + TypeScript + Tailwind
│   ├── src/
│   │   ├── components/          # Reusable UI & feature components
│   │   │   ├── ui/             # Button, Input, Card, Modal, Skeleton, Rating
│   │   │   ├── layout/         # Navbar, Footer, RootLayout
│   │   │   └── products/       # ProductCard, ProductGallery
│   │   ├── pages/              # Route-level page components
│   │   │   ├── Home.tsx
│   │   │   ├── ProductListing.tsx
│   │   │   ├── ProductDetail.tsx
│   │   │   ├── Cart.tsx
│   │   │   ├── Checkout.tsx
│   │   │   ├── OrderTracking.tsx
│   │   │   ├── Wishlist.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── SellerDashboard.tsx
│   │   │   ├── SellerStorefront.tsx
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── AdminUsers.tsx
│   │   │   ├── AdminProducts.tsx
│   │   │   ├── AdminOrders.tsx
│   │   │   └── AdminAnalytics.tsx
│   │   ├── stores/             # Zustand state management
│   │   │   ├── auth.ts
│   │   │   ├── cart.ts
│   │   │   ├── wishlist.ts
│   │   │   └── index.ts
│   │   ├── lib/                # API client, router, helpers
│   │   ├── utils/              # Utility functions
│   │   └── index.css           # Tailwind + custom styles
│   ├── tailwind.config.ts
│   ├── vite.config.ts
│   └── package.json
├── backend/                     # Cloudflare Workers + D1 + R2
│   ├── src/
│   │   ├── index.ts           # Main worker handler & API routes
│   │   ├── seed.ts            # Development seed data
│   │   └── lib/               # Utility functions
│   ├── migrations/
│   │   └── 001_schema.sql     # Complete database schema
│   ├── wrangler.toml          # Cloudflare Workers configuration
│   └── package.json
├── packages/shared/            # Shared TypeScript types & validation
│   ├── src/
│   │   ├── types.ts           # All TypeScript interfaces
│   │   ├── validation.ts      # Zod validation schemas
│   │   └── constants.ts       # App constants
│   └── package.json
├── docker-compose.yml         # Local development with Postgres + Redis
├── wrangler.toml              # Workers configuration
├── package.json               # Root workspace configuration
└── README.md                  # This file
```

## 🏗️ Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS (dark-first design system)
- **Animation**: Framer Motion (subtle micro-interactions)
- **Routing**: React Router 6
- **Data Fetching**: TanStack Query
- **State Management**: Zustand (persist middleware)
- **Validation**: Zod
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

### Backend
- **Runtime**: Cloudflare Workers
- **Database**: D1 (serverless SQLite)
- **Storage**: R2 Object Storage
- **API**: RESTful REST APIs
- **Auth**: JWT sessions stored in D1
- **RBAC**: Server-side role-based access control

### Design System
- **Theme**: Dark-first with Nova blue primary color
- **Components**: Glassmorphism accents, subtle gradients, elegant borders
- **Typography**: Inter (UI) + Space Grotesk (display)
- **Border Radius**: Consistent system (xs: 4px, sm: 8px, md: 12px, lg: 16px, xl: 24px)
- **Animations**: fade-in, slide-up, scale-in
- **States**: Skeleton loading, empty states, error states, success states

## 🔐 Authentication & RBAC

### Roles
| Role | Permissions |
|------|-------------|
| **Customer** | Browse, search, cart, wishlist, checkout, orders, reviews |
| **Seller** | All customer + store management, product management, order updates, analytics |
| **Admin** | Full platform management, user/seller moderation, analytics, audit logs |

### Security
- JWT-based authentication with session management
- Server-side RBAC enforcement on every API request
- Password hashing (bcrypt)
- Input validation with Zod
- SQL injection prevention via parameterized queries
- IDOR protection through resource ownership verification
- Rate limiting

## 💳 Payment Architecture

```
PaymentProvider (Abstraction Layer)
├── createPayment()      → Initiates payment
├── verifyPayment()      → Confirms payment
├── refundPayment()      → Processes refunds
└── handleWebhook()      → Handles provider callbacks
```

### Supported Methods (V1)
- **Cash on Delivery (COD)**
- **Bank Transfer**
- **Mobile Payment**
- **Payment Gateway** (abstraction ready)

Payment status is tracked independently from order status. All payment calculations are validated server-side.

## 📊 Order State Machine

```
PENDING
  → PAYMENT_PENDING
    → PAID
      → PROCESSING
        → PACKED
          → SHIPPED
            → OUT_FOR_DELIVERY
              → DELIVERED

CANCELLED (from PENDING, PAYMENT_PENDING, PROCESSING)
REFUND_REQUESTED (from PAID, DELIVERED)
REFUNDED
RETURN_REQUESTED (from DELIVERED)
RETURNED
```

Every status change is recorded in `order_status_history` with timestamp and actor.

## 🔍 API Endpoints

### Authentication
```
POST   /auth/register
POST   /auth/login
POST   /auth/logout
POST   /auth/refresh
GET    /auth/me
```

### Products
```
GET    /products?page=1&limit=20&search=...&category=...
GET    /products/:id
POST   /products
PATCH  /products/:id
DELETE /products/:id
GET    /search?q=...
```

### Cart
```
GET    /cart
POST   /cart/items
PATCH  /cart/items/:id
DELETE /cart/items/:id
```

### Orders
```
POST   /orders
GET    /orders
GET    /orders/:id
POST   /orders/:id/cancel
```

### Payments
```
POST   /payments/create
POST   /payments/verify
POST   /payments/webhook
```

### Reviews
```
GET    /products/:id/reviews
POST   /products/:id/reviews
```

### Coupons
```
POST   /coupons/validate
```

### Seller
```
GET    /seller/analytics
GET    /seller/products
GET    /seller/orders
```

### Admin
```
GET    /admin/users
GET    /admin/sellers
GET    /admin/products
GET    /admin/orders
GET    /admin/analytics
```

## 🗄️ Database Schema

Key tables (25+ total):
- `users`, `sessions`, `addresses` — User management
- `sellers`, `stores` — Seller/store management
- `categories`, `brands` — Catalog taxonomy
- `products`, `product_variants`, `product_images` — Product catalog
- `inventory_transactions` — Inventory tracking
- `carts`, `cart_items` — Shopping cart
- `wishlists`, `wishlist_items` — Wishlist
- `orders`, `order_items`, `order_status_history` — Order management
- `payments` — Payment processing
- `coupons`, `coupon_usage` — Discount system
- `promotions` — Promotional campaigns
- `reviews`, `review_images` — Product reviews
- `notifications` — Notification system
- `audit_logs` — Audit trail

Full schema: See `/backend/migrations/001_schema.sql`

## 📜 Development Commands

```bash
# Development
npm run dev                    # Start both frontend and backend
npm run dev --workspace=frontend  # Frontend only (port 3000)
npm run dev --workspace=backend   # Backend only (port 8787)

# Building
npm run build                  # Build all workspaces
npm run build --workspace=frontend
npm run build --workspace=backend

# Testing
npm run test                   # Run all tests
npm run test --workspace=frontend
npm run test --workspace=backend

# Database
npm run db:migrate             # Apply D1 migrations
npm run db:seed                # Seed development data

# Linting
npm run lint                   # Lint all workspaces
```

## 🎨 Design Tokens

| Token | Value |
|-------|-------|
| Primary Color | Nova 500 (#5a7bfe) |
| Background | Surface 950 (#09090b) |
| Surface | Surface 900 (#18181b) |
| Border | Surface 800 (#27272a) |
| Text Primary | Surface 50 (#fafafa) |
| Text Secondary | Surface 400 (#a1a1aa) |
| Border Radius | xs(4px), sm(8px), md(12px), lg(16px), xl(24px) |
| Font Display | Space Grotesk |
| Font UI | Inter |
| Currency | MMK (Myanmar Kyat) |

## 🔒 Security Considerations

- **Never trust frontend values** — All prices, inventory, coupons validated server-side
- **RBAC enforced server-side** — Every API request checks role and permissions
- **Resource ownership verification** — Users can only access their own data
- **SQL injection prevention** — Parameterized queries only
- **No secrets in frontend code** — Environment variables only
- **Password security** — Hashed with bcrypt, never stored in plain text
- **Session management** — JWT with expiration, stored in D1
- **Rate limiting** — Prevents abuse of authentication and payment endpoints
- **Duplicate order prevention** — Server-side order IDempotency keys
- **Coupon abuse prevention** — Per-user limits, usage tracking, validation server-side

## 📊 Key Features

### Customer Experience
- ✅ Product discovery with search, filters, and sorting
- ✅ Product variants with price/stock/image changes
- ✅ Shopping cart with seller grouping and stock validation
- ✅ Wishlist with price-drop notifications
- ✅ Multi-step checkout (address → delivery → payment → review)
- ✅ Order tracking with visual timeline
- ✅ Reviews with images and verified purchase badge
- ✅ Coupon validation and application

### Seller Experience
- ✅ Storefront with banner, logo, description
- ✅ Product management (add, edit, delete/archive)
- ✅ Variant and inventory management
- ✅ Order management with status updates
- ✅ Analytics dashboard (revenue, orders, products)
- ✅ Review management

### Admin Experience
- ✅ User and seller management
- ✅ Product moderation
- ✅ Order management
- ✅ Platform analytics
- ✅ Coupon and promotion management
- ✅ Audit logs
- ✅ Notifications system

## 🚀 Deployment

### Cloudflare Workers
```bash
# Deploy to Cloudflare
npx wrangler deploy

# Deploy with production config
npx wrangler deploy --config wrangler.prod.toml
```

### Environment Variables (Production)
See `backend/.env.example` and `frontend/.env.example` for required variables.

## 📝 License

MIT License — See LICENSE file for details.

---

**NOVA Commerce** — Built for the future of commerce. 🚀
