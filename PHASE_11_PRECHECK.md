# Phase 11 Precheck: Multi-Agent Commerce OS

## 1. Reusable Components
* **AI Provider (`server/services/ai/aiProvider.js`)**: Abstraction layer for interacting with LLM models. Useful for standardizing prompt execution across agents.
* **Commerce Brain (`server/services/commerceBrain/`)**: Already contains decoupled logic for specific domains (events, recommendations, actions). We can map these to specific agents (e.g., `recommendationAgent` wrapping `recommendationEngine`).
* **Search Engine (`server/services/search/`)**: Implements FAISS-based vector search. Highly reusable for the `SearchAgent`.
* **Database Models (`server/models/`)**: Standard ORM abstractions that can be wrapped as "Controlled Tools".
* **Auth Middleware (`server/middleware/auth.js`)**: Specifically `requirePermission`, which is crucial for enforcing agent tool access.

## 2. Duplicated Logic
* Different controllers and services currently manually invoke `aiProvider.js` or parse LLM outputs independently. A centralized `AgentOrchestrator` will standardize prompt creation, tool execution, and result parsing.
* Permissions checks are currently scattered in routers. Tool-based access will centralize this logic.

## 3. Incomplete Systems
* **Multimodal Product Understanding**: The current `ProductDNA` focuses on text embeddings. It lacks structured support for visual features and hybrid multimodal retrieval.
* **AI Action Execution**: The `AIAction` model queues actions for admin approval, but there is no mechanism for an agent to actually *execute* a complex task autonomously post-approval.
* **Policy Knowledge Base**: Currently missing entirely. AI cannot reliably answer policy-related queries without hallucinating.

## 4. Performance Bottlenecks
* **Synchronous LLM calls**: AI operations currently block HTTP responses. Multi-agent workflows could amplify this. We need aggressive use of asynchronous job queues for long-running multi-agent tasks (like Admin Investigations).
* **Search Latency**: Combining visual and text embeddings sequentially will be slow.

## 5. Missing Indexes
* Needs a composite index on `CommerceEvent` for fast querying by `userId` and `eventType`.
* Need to ensure `ProductRelationship` is indexed correctly for rapid Graph traversals.

## 6. Missing Permissions
* Need new granular permissions for agent execution (e.g., `agent.shopping`, `agent.admin`).
* Risk levels need to be attached to backend operations to prevent autonomous agents from running CRITICAL operations without ADMIN_APPROVAL.

## 7. Inconsistent AI Behavior
* "Spark AI" currently handles everything (search, chat, admin advice) through a single monolithic endpoint/prompt.
* Lack of structured "Confidence" scoring. The AI often guesses instead of failing gracefully.
* Missing robust prompt injection protections.

## 8. UI Inconsistencies
* AI interfaces are scattered (SparkAIFab, AdminCopilot, AiCopilot page). A unified "Command Your Store" command palette is needed to centralize AI access.

---
**Plan**: Implement a structured `server/services/agents` directory to introduce orchestration, memory, tools, and specialized agents, migrating existing AI features to this new paradigm.
