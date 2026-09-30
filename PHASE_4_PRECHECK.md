# Phase 4 - AI Search & Recommendation Pre-Check

## 1. Current Search Architecture
- Endpoint: `GET /api/products` (in `productController.js`).
- Filtering: Hardcoded `keyword` (matches `name` or `description` via `Op.like`), `category` (exact match).
- Sorting: `priceAsc`, `priceDesc`, `rating`, `createdAt`.
- Pagination: Present (using `limit` and `offset`).
- It is a purely backend SQL-driven search. No semantic search, synonym support, or autocomplete intelligence currently exists.

## 2. Current AI Capabilities (Phase 3)
- An AI context extractor exists for the Spark AI Copilot (`searchProductsForAI` in `productContext.js`).
- Extracted intent schema includes `intent`, `category`, `maxPrice`, `minPrice`, `searchTerms`.
- Only powers the `/api/ai/chat` endpoint; the main site search is decoupled from AI.

## 3. Current Recommendation Architecture
- None. Homepage relies on generic product lists.
- `GET /api/ai/recommendations` exists but is a mock (returns top 4 rated products). No true behavioral tracking or collaborative filtering is present.

## 4. Existing Database Capabilities
- Express + Sequelize (PostgreSQL/SQLite).
- Missing models for: `ProductEmbedding`, `SearchQuery`, `SearchClick`, `ProductIntelligence`, `RecommendationEvent`, `UserProductInteraction`.

## 5. Missing Functionality (To Be Implemented in Phase 4)
- **Hybrid Search Engine**: Query Parsing → AI Intent Extraction → SQL Filters + Keyword Matching + Semantic Matching (Fallback) → Candidate Retrieval → Re-ranking.
- **Embeddings Pipeline**: `generateProductEmbedding`, `ProductEmbedding` DB model, index status APIs.
- **Find Similar**: Intelligent product matching.
- **Search UI**: AI interpretation indicator, Smart Autocomplete, Zero-result fallbacks.
- **Admin Tools**: Zero-result analytics, Search Intelligence Panel, Duplicate detection.

## 6. Files to be Modified
- `server/controllers/productController.js` (Delegating search logic to the new `searchService`).
- `server/routes/productRoutes.js`, `server/routes/adminRoutes.js`.
- `server/server.js` (Register new routes).
- `client/src/components/Navbar.jsx` (Smart Autocomplete).
- `client/src/pages/Home.jsx` (Search logic, Personalization rows).
- `client/src/pages/ProductDetails.jsx` (Find Similar button).
- `client/src/pages/AdminDashboard.jsx` (Search Intelligence Panel).
- `server/models/index.js` (Adding new models for analytics and embeddings).

## 7. Files that should not be modified
- The core UI structural layout, colors, or core cart/checkout logic established in Phases 1 and 2.
- The `aiProvider.js` abstraction (should be extended/used, not rebuilt).

## 8. Potential Compatibility Problems
- We don't know for sure if the DB uses PostgreSQL with `pgvector` or SQLite locally. The prompt advises: "If PostgreSQL supports pgvector, use pgvector. If vector infrastructure is unavailable: Create a clean abstraction with a safe fallback to keyword search." I will build a generic embedding model that stores vector as a JSON array (or specialized type) and computes cosine similarity in JS/SQL as a generic fallback to ensure it works on any Sequelize dialect if `pgvector` isn't strictly enforced.
