# Phase 1: Production Hardening & Core System Repair

## 1. Bugs Found & Fixed
- Frontend was sending calculated prices for checkout which could be manipulated. Fixed by fetching prices from DB in `addOrderItems`.
- Missing validations on inputs. Added centralized validation middleware via `Joi`.
- Missing error formatting standardization. Implemented a `formatResponse` interceptor.

## 2. Security Vulnerabilities Fixed
- Hardcoded JWT secrets removed. Now enforces `process.env.JWT_SECRET` presence.
- Authentication paths protected via `express-rate-limit` to prevent brute force attacks.
- General rate limiting, `helmet`, and strict `CORS` origins implemented.

## 3. Database Changes
- Added `OrderTracking` to handle timeline history (Order Placed -> Delivered).
- Added `CartItem` and `WishlistItem` to support server-side persistence for authenticated users.
- Added `name` and `image` snapshots to `OrderItem` so historical records are not mutated when product names/images update.
- Enabled `paranoid: true` on `Product` and `User` for soft deletes.

## 4. API Changes
- Standardized all API responses to `{ success: true, data: ... }` and `{ success: false, error: ... }`.
- Added `/api/users/cart` and `/api/users/wishlist` endpoints.

## 5. Authentication Changes
- Strengthened JWT configuration, added login rate limits.

## 6. Authorization Changes
- Replaced monolithic `admin` role with a role-permission mapping (`requirePermission('products.create')`).

## 7. Payment Architecture
- Created `paymentController` to abstract gateway integration.
- Separated payment status from order status. Default payment is `Pending`.

## 8. Inventory Changes
- Added row locking (`t.LOCK.UPDATE`) in Postgres for transactional inventory mutation.
- Verified stock logic atomically against current cart payload.

## 9. Order Changes
- Automated tracking event creation when order status changes.
- Checkout flow is fully atomic.

## 10. Remaining Limitations
- Migrations (`umzug` or Sequelize CLI) are not explicitly authored yet; using `sync()` in dev still.
- Email/Push notification adapters are mocked.
