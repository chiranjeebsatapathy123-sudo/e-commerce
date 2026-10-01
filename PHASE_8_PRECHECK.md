# Phase 8 Pre-Check: AI Business Intelligence & Smart Operations

## 1. Existing Business Metrics
Currently, `getAnalytics` in `adminController.js` calculates:
* `totalSales`: A simple sum of `Order.total` where the status is NOT Cancelled, Failed, or Refunded.
* `totalOrders`: Count of all orders.
* `totalProducts`: Count of all products.
* `totalUsers`: Count of all users.
* `categoryData`: Calculated directly by looping through all `OrderItem` joins.

**Limitation:** This is a monolithic function with no date filtering. It will crash or severely degrade performance on a large dataset because it fetches all `OrderItems` into memory to group by category.

## 2. Existing Analytics Data
* **Orders:** The `Order` and `OrderItem` tables contain historical purchase data (`createdAt`, `total`, `status`), which is the foundation for Sales Analytics and Forecasting.
* **Inventory:** The `Product` model has `stock`, `price`, and `category`. No historical stock movement log exists.
* **Users:** `User` model exists, but we don't have explicit customer segmentation stored. This must be derived dynamically from Order history.
* **Search/Events:** `SearchQuery` and `UserInteraction` models exist for search analytics and view/cart interactions.

## 3. Forecasting Feasibility
* **Data Volume:** Forecasting requires sufficient historical data. Since this is an active project, data might be sparse. We must implement fallback logic (e.g., "Insufficient data") if there are fewer than a baseline number of orders for a product or globally over a time range.
* **Approach:** Given node/express without heavy Python scientific libraries, we can implement simple moving averages, exponential smoothing, or basic linear regression natively, or use an AI tool approach if supported by the LLM (as Copilot insights).
* **Missing Data:** We do not have supplier lead time or wholesale cost data in the schema. Inventory value must be calculated using retail price ("Inventory retail value").

## 4. Current Admin APIs
* `GET /api/admin/analytics`: Exists but is primitive.
* `GET /api/admin/search-intelligence`, `GET /api/admin/reviews/intelligence`: Specific intelligence APIs already exist and are modular.

## 5. Existing Database Indexes
* Current models rely on default Sequelize indexes (Primary Keys, Foreign Keys).
* **Missing Indexes:** Need indexes on `createdAt` (Orders, OrderItems, UserInteractions) and `status` (Orders) for performant date-range filtering.

## 6. Files Requiring Modification
* **Backend:**
  * Create `server/services/intelligence/` (analyticsService, salesAnalyticsService, forecastService, anomalyService, alertService, copilotService).
  * Create `server/controllers/adminIntelligenceController.js`.
  * Update `server/routes/adminRoutes.js`.
  * Create new models: `BusinessAlert`, `CopilotAuditLog`.
* **Frontend:**
  * Refactor the Admin Dashboard UI.
  * Create new dashboard components using Phase 7 CSS architecture.
  * Implement Copilot chat interface in the Admin panel.
