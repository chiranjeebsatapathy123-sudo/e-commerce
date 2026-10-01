# Phase 13 Precheck

## Existing AI Architecture
The platform operates on a Multi-Agent architecture consisting of `agentOrchestrator.js` connected to an `agentRegistry.js`. Requests are routed to specialized agents (`shoppingAgent`, `orderAgent`, `supportAgent`, `adminAgent`). They use a centralized `agentTools.js` registry which enforces tool-level RBAC (`allowedRoles`) and risk levels (`READ_ONLY`, `MODERATE_RISK`, `HIGH_RISK`).

## Commerce Brain & Personalization
`services/commerceBrain/` coordinates personalization and recommendations.
- **Engines:** `actionEngine`, `decisionEngine`, `eventEngine`, `personalizationEngine`, `radarEngine`, `recommendationEngine`.
- **Database Models:** `CommerceEvent`, `UserExperiencePreference`, `ShoppingDecisionWorkspace`, `ShoppingRadarItem`.

## Recommendation & Search System
- **Recommendations:** Powered by `recommendationEngine.js` using the `ProductRelationship` graph model, supporting relationships like 'Similar', 'Alternative', and 'Accessories'.
- **Search:** Hybrid search (keyword + query intent extraction) found in `searchService.js`. Vectors are mocked via fallback distance calculation on `ProductEmbedding`.

## Price Intelligence & Automation
- **Price Intelligence:** Handled by `radarEngine` storing alerts in `ShoppingRadarItem`.
- **Automation System:** Supervised autonomy where high-risk actions are logged as `AIAction` awaiting admin approval (Human-in-the-loop). Notifications leverage `BusinessAlert`.

## Analytics & Observability
- **Analytics:** `salesAnalyticsService` and `inventoryAnalyticsService` provide accurate metrics filtering cancelled orders. `businessCopilotService` translates these into actionable natural language.
- **Observability:** Extremely limited. Basic error logging exists but no formal AI tracing, latency tracking, cost monitoring, or AI health dashboard.

## Background Jobs
Currently, background jobs (like anomaly detection, alert generation, AI summarizations) are triggered mostly synchronously or via ad-hoc asynchronous callbacks during page loads. There is no formalized reliable queue system (like BullMQ) or dead-letter handling.

## Database Models & Permissions
- **AI/Commerce Models:** `AIAction`, `AdminAuditLog`, `BusinessAlert`, `CommerceEvent`, `ProductMultimodalProfile`, `ProductRelationship`, `ShoppingDecisionWorkspace`, `ShoppingRadarItem`, `UserExperiencePreference`, `ProductReviewAnalysis`.
- **Permissions:** Standard JWT RBAC (`user`, `admin`, `Super Admin`). Tool execution is strictly guarded by these roles.

## Existing AI Provider Abstraction
`services/ai/aiProvider.js` and `aiService.js` handle interactions. The provider is largely simulated, returning mocked deterministic or randomized responses. No model routing (e.g., lightweight vs heavy models) or cost tracking is implemented.

## Existing Frontend AI Surfaces
- `CommandPalette.jsx` (Command Surface)
- `AiCopilot.jsx` (Chat & Response Cards)
- `ProductDetails.jsx` (AI Product Lens & Product Universe)
- `DecisionWorkspace.jsx` (Complex curation)
- `ShoppingRadar.jsx` (Price tracking)
- `PersonalizationCenter.jsx` (Privacy controls)
- `BusinessCopilot.jsx` (Admin intelligence)

## Missing Functionality
- Unified Trust Model (Confidence, Evidence, Verification).
- Centralized Decision Gate (ANSWER vs VERIFY vs DELEGATE vs REFUSE).
- AI Explanation Engine (transparent reasoning for recommendations).
- Self-Evaluating AI (accuracy, hallucination risk, success rate).
- AI Quality & Cost Intelligence Dashboards.
- Intelligent Model Routing and standardized Fallback/Recovery.
- Experimentation Platform (A/B testing prompts/models).
- Formalized Autonomy Levels (Level 0 to 4).

## Duplicated Functionality
- The frontend has overlapping logic for rendering product cards in `AiCopilot`, `DecisionWorkspace`, and `Home`.
- AI request validation is somewhat scattered across `aiRoutes.js`, `agentOrchestrator.js`, and individual agents.

## Risky Functionality
- Automated tool execution relies entirely on `allowedRoles` and `riskLevel` strings. There is no robust verification or "policy engine" governing what the AI can do with contextual data.
- AI Memory transparency is low. Users might not know why they are seeing specific items unless they check the exact workspace configuration.

## Technical Debt
- AI requests lack unique trace IDs.
- Lack of database indexes on AI/Commerce tracking tables which will scale rapidly.
- No reliable background worker pool for AI heavy lifting.
