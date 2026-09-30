# Phase 5 Pre-Check Audit

## Existing Functionality
- **Products**: Has `id`, `name`, `price`, `category`, `stock`, `description`, `image`, `images`, `rating`, `reviewsCount`.
- **Reviews**: Users can leave 1 review per product. Reviews have `rating`, `comment`, `UserId`, `ProductId`. Updating a review updates product's average `rating` and `reviewsCount`.
- **Product Page**: `client/src/pages/ProductDetails.jsx` already has a static "AI Review Summary" placeholder which needs to be made dynamic. It also renders reviews and has basic specs.
- **Comparison**: Currently no product comparison feature exists (missing functionality).
- **AI Buying Assistant**: Phase 3 added Spark AI (Copilot), but we need to extend it into a structured Smart Buying Assistant.

## Missing Functionality & Database Changes
1. **Review Moderation / Verification**:
   - `Review` model needs: `isVerifiedPurchase` (boolean), `status` (enum: 'Approved', 'Pending', 'Flagged', 'Rejected'), `flaggedReason` (string).
2. **Review Analysis Caching**:
   - Need a new model `ProductReviewAnalysis` containing:
     - `ProductId`
     - `summary` (JSON or string)
     - `positiveThemes` (JSON)
     - `negativeThemes` (JSON)
     - `sentimentDistribution` (JSON - positive/neutral/negative percentages)
     - `analyzedReviewCount` (integer)
     - `isStale` (boolean)
3. **Product Comparison**:
   - Need frontend UI for selecting up to 4 products and comparing their properties side-by-side.
   - AI service to compare differences and answer comparison queries.
4. **Smart Buying Assistant / Use-Case Comparison**:
   - AI logic to gather preferences (budget, use case, priority) and filter the catalog appropriately.
5. **Smart Cart Insights / Bundle Intelligence**:
   - Need to analyze cart and order items to recommend compatible products.

## Files to Modify
- `server/models/Review.js` (add verification and moderation fields)
- `server/models/ProductReviewAnalysis.js` (NEW)
- `server/models/index.js` (associations)
- `server/controllers/productController.js` (check verified purchase logic upon review creation, invalidate AI cache)
- `server/services/ai/reviews/*` (NEW - analysis, summary, sentiment, theme, search, question services)
- `server/routes/aiRoutes.js` or `server/routes/productRoutes.js` (NEW endpoints for analysis)
- `client/src/pages/ProductDetails.jsx` (Dynamic AI summary, Ask About Product, Compare button)
- `client/src/pages/Compare.jsx` (NEW - Comparison UI)
- `client/src/components/SparkAI.jsx` (extend with structured buying workflow)
- `server/routes/adminRoutes.js` & `client/src/pages/AdminDashboard.jsx` (Review Moderation Panel)
