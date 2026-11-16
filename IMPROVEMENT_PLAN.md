# NOVA Commerce — Improvement Plan

**Status:** Initial assessment  
**Project:** Monorepo e-commerce platform (React + Vite frontend, Cloudflare Workers + D1 backend, shared TS/Zod package)  
**Date:** 2026-11-16

---

## 1. Executive Summary

NOVA Commerce is a well-structured monorepo with a complete design intent (README, PROJECT_ANALYSIS.md, schema, shared types/Zod schemas, UI component library, and all major page routes). However, much of it is **scaffolding rather than working functionality**:

- The backend has route handlers but **no real authentication** (fake JWT, no signature verification, passwords stored as `'hashed_' + password`), **no input validation** (Zod schemas defined but never invoked), and a **SQL injection** in the admin list endpoint.
- The frontend has all pages and components but **most pages use mock/hardcoded data** instead of calling the API (Home, ProductListing, ProductDetail partially, Cart, Checkout, OrderTracking, SellerDashboard, Admin pages).
- Several **type/reference bugs** would prevent the app from compiling or running correctly (broken shared package exports, wrong import paths, store fields that don't exist, `subtotal` used but not defined).
- Missing operational files: no `.env.example`, no Dockerfiles (referenced by docker-compose), no git commits yet, test file imports non-existent modules.

This plan is ordered by **priority (P0 = critical/security, P1 = high, P2 = medium, P3 = low)** so you can fix what breaks first, then connect frontend to backend, then harden and expand.

---

## 2. Current State — What Exists vs. What Works

| Area | Exists | Actually functional |
|------|--------|---------------------|
| Monorepo workspaces (frontend, backend, packages/shared) | ✅ | ✅ (package.json wired) |
| Database schema (25+ tables) | ✅ (migration) | ⚠️ untested (no D1 locally) |
| Shared types + Zod schemas | ✅ | ✅ types defined |
| Backend route handlers (auth, products, cart, orders, payments, seller, admin, reviews, coupons) | ✅ | ⚠️ handlers present but auth/validation broken |
| Frontend UI library (Button, Input, Card, Modal, Skeleton, Rating) | ✅ | ✅ |
| Frontend pages (all README-listed routes) | ✅ | ⚠️ mostly mock data |
| State (Zustand: auth, cart, wishlist, notifications) | ✅ | ⚠️ type bugs in stores |
| API client (TanStack Query + fetch wrapper) | ✅ | ✅ but points to hardcoded `/api` |
| Router (React Router 6, all routes) | ✅ | ✅ but some routes point to mock pages |
| CI workflow | ✅ | ⚠️ references `main` branch, repo is on `master` with no commits |
| `.env.example`, Dockerfiles, git history | ❌ missing | — |

---

## 3. Issues Found (Priority Ordered)

### P0 — Critical / Security (fix first)

| # | Issue | Location | Impact | Fix |
|---|-------|----------|--------|-----|
| P0-1 | **SQL injection** — `handleAdminList` interpolates user-controlled `resource` directly into `SELECT * FROM ${resource}` | `backend/src/index.ts:459` | Full database read exposure | Add an allowlist of permitted tables; reject anything else |
| P0-2 | **No real JWT verification** — `jwtDecode` only base64-decodes the payload; no signature check against `JWT_SECRET` | `backend/src/index.ts:135-164` | Anyone can forge a session token | Implement real JWT verification (use `jsonwebtoken`-compatible approach via Web Crypto, or validate solely via the D1 `sessions` table and skip trusting the JWT payload) |
| P0-3 | **Passwords not hashed** — stored as `'hashed_' + body.password` | `backend/src/index.ts:195`, `:209` | Plaintext-equivalent credentials | Hash with bcrypt-compatible Worker-safe crypto (e.g., `subtle.crypto` PBKDF2) or accept the Workers limitation and document it; at minimum salt + hash |
| P0-4 | **No input validation** — Zod schemas exist in `@nova/shared` but are never called in any backend handler | `backend/src/index.ts` | Invalid/malicious data reaches the DB | Call `registerSchema`, `createProductSchema`, `addToCartSchema`, etc. in their handlers; return 400 on failure |
| P0-5 | **Shared package exports are broken** — `index.ts` does `export * from './src/types'` but files live directly in `src/` | `packages/shared/src/index.ts:1-2` | Frontend `@nova/shared` imports fail at build/runtime | Change to `export * from './types'` etc. (files are in `src/`, not `src/src/`) |

### P1 — High (breaks runtime behavior)

| # | Issue | Location | Impact | Fix |
|---|-------|----------|--------|-----|
| P1-1 | **Wrong import path** — `Skeleton` imported from `'../ui/Skeleton'` | `frontend/src/pages/ProductListing.tsx:5` | Module resolution failure | Change to `'../components/ui/Skeleton'` |
| P1-2 | **`subtotal` used but not defined on cart store** | `frontend/src/pages/Cart.tsx:11`, `Checkout.tsx:11` | TypeError / undefined at runtime | Add a `subtotal` derived getter to `useCartStore`, or compute it inline from `items` |
| P1-3 | **Auth store `logout` sets nonexistent fields** — sets `cart`/`wishlist` which aren't in `AuthState` | `frontend/src/stores/index.ts:18` | TypeScript error | Remove those lines or extend `AuthState`; clear cart/wishlist via their own stores |
| P1-4 | **Unused/incorrect imports in stores** — imports `Cart`, `Order` from `@nova/shared`; `Order` unused, `Cart` misused | `frontend/src/stores/index.ts:3` | Type noise | Clean up imports |
| P1-5 | **Frontend pages use mock data, no API calls** | `Home.tsx`, `ProductListing.tsx`, `SellerDashboard.tsx`, Admin pages, `OrderTracking.tsx` | App shows empty/static content | Wire up TanStack Query `useQuery` calls to `api.get(...)` for each page |
| P1-6 | **Checkout never calls the API** — simulates with `setTimeout`, navigates to `/orders/success` which isn't a route | `frontend/src/pages/Checkout.tsx:34-39` | Orders can't be placed | Call `api.post('/orders', ...)` then `api.post('/payments/create', ...)`; navigate to a real order-tracking route |
| P1-7 | **ProductDetail casts API data as `any`** | `frontend/src/pages/ProductDetail.tsx:86,102` | Loss of type safety | Type the query data with `Product` from `@nova/shared` |
| P1-8 | **`total` count wrong in `handleListProducts`** — returns `products.results.length` instead of a COUNT | `backend/src/index.ts:249` | Pagination lies to frontend | Run a separate `COUNT(*)` query |
| P1-9 | **Auth not persisted/checked on app load** — no auth restoration middleware | `frontend/src/App.tsx`, `stores/index.ts` | User loses session on refresh | Hydrate auth from `localStorage` / Zustand persist and add a protected-route wrapper |

### P2 — Medium (harden & complete features)

| # | Issue | Location | Impact | Fix |
|---|-------|----------|--------|-----|
| P2-1 | **Missing backend handlers** — wishlist, addresses, product PATCH/DELETE, seller product/order management, admin beyond listing, coupon application in orders | `backend/src/index.ts` | Feature gaps vs. README | Implement remaining REST endpoints per README |
| P2-2 | **Coupon never applied** — `/coupons/validate` exists but checkout/order creation ignores it | `frontend/src/pages/Checkout.tsx`, `backend/src/index.ts` | Discounts don't work | Validate coupon server-side at order creation, store `coupon_id` + `discount_amount` |
| P2-3 | **R2 bucket bound but unused** — no image upload | `backend/wrangler.toml`, `src/index.ts` | Product images can't be uploaded | Add presigned-upload or direct R2 put handler; wire product image upload |
| P2-4 | **No rate limiting, no CORS** | `backend/src/index.ts` | Abuse exposure | Add simple rate-limit (in-memory or D1 counter) and CORS preflight handling |
| P2-5 | **No env var usage in backend** — `JWT_SECRET` defined in wrangler vars but never read | `backend/src/index.ts` | Config is dead | Read `env.JWT_SECRET` in auth functions |
| P2-6 | **No `.env.example` files** (referenced by README) | `frontend/`, `backend/` | Onboarding friction | Create `.env.example` with all required vars |
| P2-7 | **No Dockerfiles** (referenced by docker-compose) | `frontend/`, `backend/` | `docker-compose up` fails | Add `Dockerfile` for both workspaces |
| P2-8 | **Duplicate local `Product` interfaces** — frontend redefines types instead of using `@nova/shared` | `Home.tsx`, `ProductListing.tsx`, `ProductDetail.tsx` | Type drift | Import `Product`, `CartItem`, `Order` from `@nova/shared` |
| P2-9 | **Test file broken** — imports `'../shared/src/validation'` and tests `verifyToken`/`verifyRole`/`calculateDiscount` which don't exist | `frontend/src/lib/__tests__/validation.test.ts` | Tests fail/import errors | Fix import path; write tests for functions that actually exist, or remove placeholder tests |
| P2-10 | **No protected routes** — `/seller`, `/admin` accessible without auth | `frontend/src/lib/router.tsx` | Unauthorized UI access | Add role-based route guards |

### P3 — Low (polish & V2)

| # | Issue | Location | Fix |
|---|-------|----------|-----|
| P3-1 | Add loading/error/empty states consistently across pages | Frontend pages | Use Skeleton + error UI |
| P3-2 | Add wishlist page API integration (frontend calls backend) | `Wishlist.tsx` | Wire to `/wishlist` endpoints |
| P3-3 | Order status history timeline driven by real API data | `OrderTracking.tsx` | Call `GET /orders/:id` |
| P3-4 | Email notification abstraction → real SMTP/SendGrid | Backend | Implement when provider available |
| P3-5 | Real payment gateway (Stripe/MoMo/KPay) integration | Backend `handleCreatePayment` | Replace mock logic |
| P3-6 | CI branch mismatch (`main` vs `master`), repo has no commits | `.github/workflows/ci.yml` | Make initial commit; align branch |
| P3-7 | Accessibility audit (focus states, aria labels, color contrast) | Frontend | Run axe / manual review |
| P3-8 | Performance: image optimization, pagination COUNT, query keys | Frontend + backend | Lazy load images, TanStack Query staleTime tuning |

---

## 4. Recommended Implementation Roadmap

### Phase A — Stabilize (P0 + critical P1) — do this first
1. Fix `packages/shared/src/index.ts` export paths.
2. Fix the SQL injection allowlist in `handleAdminList`.
3. Replace fake JWT with real verification + hash passwords.
4. Add Zod validation to all mutating backend handlers.
5. Fix frontend import path (`ProductListing.tsx` Skeleton).
6. Add `subtotal` to cart store; fix `logout` state fields.
7. Create `.env.example` for frontend and backend.
8. Make the initial git commit and align CI branch name.

### Phase B — Connect frontend to backend (P1)
1. Wire up real API calls in `Home`, `ProductListing`, `ProductDetail` (TanStack Query).
2. Fix `Cart`/`Checkout` to compute totals correctly and call `POST /orders` + `POST /payments/create`.
3. Replace `OrderTracking` mock with real `GET /orders/:id` data.
4. Add protected routes + auth restoration on app load.
5. Use `@nova/shared` types throughout frontend.

### Phase C — Complete features (P2)
1. Implement missing backend handlers (wishlist, addresses, product CRUD, seller, admin, coupon application).
2. Add R2 image upload handler.
3. Add rate limiting + CORS + env var usage.
4. Add Dockerfiles.
5. Fix/extend the test suite.

### Phase D — Polish & V2 prep (P3)
1. Consistent loading/error/empty states.
2. Accessibility review.
3. Real payment gateway + email notifications.
4. Performance tuning.

---

## 5. Detailed File Changes

### `packages/shared/src/index.ts`
```ts
export * from './types';
export * from './validation';
export * from './constants';
```

### `backend/src/index.ts` — security & validation
- Add `TABLE_ALLOWLIST = ['users','products','orders',...]`; in `handleAdminList`, reject `resource` not in allowlist.
- Replace `jwtDecode`-only trust with D1 `sessions` lookup as source of truth (or add real signature verification).
- Hash passwords (Worker-safe: `crypto.subtle.digest('SHA-256', ...)` with a per-user salt stored in DB, or note bcrypt is unavailable in Workers).
- At top of each mutating handler: `const parsed = XxxSchema.safeParse(body); if (!parsed.success) return 400`.
- `handleListProducts`: separate `COUNT(*)` query for `total`.
- Read `env.JWT_SECRET`, `env.CLOUDFLARE_R2_BUCKET`, etc.

### `frontend/src/pages/ProductListing.tsx`
- `'../ui/Skeleton'` → `'../components/ui/Skeleton'`.
- Replace hardcoded `products: []` with `useQuery({ queryKey: ['products'], queryFn: () => api.get('/products') })`.

### `frontend/src/pages/Cart.tsx` & `Checkout.tsx`
- Compute `subtotal` from `items.reduce(...)` or add store getter; remove the nonexistent store field destructure.
- `Checkout.handleSubmit` → call `api.post('/orders', {...})` then `api.post('/payments/create', {...})`; navigate to `/orders/${orderId}`.

### `frontend/src/stores/index.ts`
- Remove `cart`/`wishlist` resets from `useAuthStore.logout` (or clear via `useCartStore.clearCart()` / `useWishlistStore.clearWishlist()`).
- Add `subtotal` getter to `useCartStore`.
- Clean unused imports (`Order`, misused `Cart`).

### `frontend/src/lib/router.tsx`
- Add a `requireAuth`/`requireRole` wrapper around `/seller` and `/admin` routes.

### New files
- `frontend/.env.example`, `backend/.env.example`
- `frontend/Dockerfile`, `backend/Dockerfile`
- `frontend/src/components/layout/ProtectedRoute.tsx` (optional; can inline in router)

---

## 6. Verification Checklist (how to know each phase is done)

- [ ] `npm install` at root works; workspaces link correctly.
- [ ] `tsc --noEmit` passes in frontend, backend, and shared with no errors.
- [ ] `npm run lint` passes in all workspaces.
- [ ] `npm run test` passes (fix the broken test file first).
- [ ] `wrangler dev` starts the backend; `curl` to `/api/auth/register`, `/api/products` returns sensible JSON.
- [ ] Frontend `vite` dev server loads `/`, `/products`, `/cart`, `/checkout` without console errors.
- [ ] Register → login → add to cart → checkout → order tracking flows end-to-end against the real backend.
- [ ] `SELECT * FROM users WHERE id = 1 OR 1=1` style injection against `/admin/:resource` is rejected.

---

## 7. Suggested Next Step

Review this plan and confirm which phase to start with (recommend **Phase A — Stabilize**). Once approved, I can implement the fixes file-by-file, running `tsc`, `lint`, and `test` after each change, and verify the backend responds correctly before moving on.
