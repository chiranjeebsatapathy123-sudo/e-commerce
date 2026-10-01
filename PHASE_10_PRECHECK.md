# Phase 10 Pre-Check: Autonomous Commerce Intelligence + Adaptive Experience

## 1. Existing System Analysis
* **Frontend Architecture:** React/Vite based UI using glassmorphism, depth, and premium animations. Navigation handles Home, Search, Product, Cart, Checkout, Orders, Compare, Wishlist, AdminDashboard.
* **Backend Architecture:** Express.js REST API with modular services for Search, AI, and Intelligence (Admin Copilot).
* **AI Architecture:** `aiProvider.js` provides `generateText` and `generateStructured`. Copilots are implemented manually inside controllers/services. Spark AI floating action button exists.
* **Database Schema:** Standard Sequelize models (User, Product, Order, Review, CartItem, WishlistItem, UserInteraction, ProductEmbedding, SearchQuery).
* **Missing Systems for Phase 10:**
    * Commerce Brain structure (`server/services/commerceBrain/`).
    * Central Event system (`CommerceEvent` model).
    * User preferences (`UserExperiencePreference` model).
    * Recommendation Graph (`ProductRelationship` model).
    * Autonomous Action Audit (`AIAction` model).

## 2. Identify Reusable Services
* `aiProvider.js` handles LLM calls and caching.
* `hybridSearch.js` and `queryParser.js` handle natural language search and semantic intent.
* `salesAnalyticsService.js` and `forecastService.js` handle analytics and stock forecasting.

## 3. Identify Gaps & Missing Integrations
* **Database Gaps:** No graph data model for `SIMILAR`, `ALTERNATIVE`, `COMPATIBLE` relations. No dedicated table for storing pending/approved AI autonomous actions. No table for fine-grained user personalization preferences.
* **UX Inconsistencies:** The frontend lacks a unified "Personalization Center", "Decision Workspace", and "Shopping Radar". The home page does not adapt automatically based on user intent.
* **Events:** Currently relying on basic `UserInteraction`. Needs a rich `CommerceEvent` that can handle payloads and async processing.

## 4. Execution Plan
1. **Schema Updates:** Create `UserExperiencePreference`, `CommerceEvent`, `ProductRelationship`, `AIAction`. Update `models/index.js`.
2. **Commerce Brain Foundation:** Scaffold `server/services/commerceBrain/` with `eventEngine`, `recommendationEngine`, `actionEngine`, etc.
3. **User-Controlled Personalization:** Implement API and UI for toggling personalization features (Personalization Center).
4. **Adaptive Store Interface & Smart Home Feed:** Modify `Home.jsx` to consume the new `recommendationEngine` and adapt sections dynamically.
5. **Recommendation Graph:** Build graph logic and seed relationships based on categories.
6. **"What Should I Buy?" Mode & AI Decision Workspace:** New UI flows and backend intent parsing for guided shopping and saving comparisons.
7. **Proactive Price Intelligence & Shopping Radar:** Allow users to watch products for price drops or restocks.
8. **AI Order Assistant & AI Support:** Expand Spark AI capabilities to check orders and return policies securely.
9. **Natural-Language Filter Builder:** Upgrade AI search to parse filters explicitly and allow users to modify them.
10. **Action Approval Center:** Admin UI to review and approve/reject pending autonomous AI actions.
