# TraviQ — Architecture & Repository Baseline

Generated: 2026-09-02

This document captures the current architecture and repository baseline for TraviQ (moustafanabil365-web/Moustafa-Nabil). It is read-only: no code changes are proposed here. It reflects the current implementation as found in the repository.

1. System Overview

TraviQ is a React + Vite frontend coupled with a lightweight Node/Express server (server.ts) run alongside the frontend in the same repository. Domain types and business logic live under src/server/domain and static normalized data under src/data. The app integrates with Firebase for authentication and storage, and uses Gemini (@google/genai) for AI-assisted itinerary generation and chat.

High-level flow:
- User (browser) -> React frontend (src/) -> Express API (/api/*) -> Domain & data -> External services (Gemini, Firebase, maps)

2. Architecture Diagram

```mermaid
flowchart LR
  Browser[User Browser - React (src/)] -->|HTTP| ExpressAPI[Express API (server.ts)]
  ExpressAPI --> Domain[Domain (src/server/domain)]
  Domain --> DataLayer[src/data (airlines, hotels, indexes)]
  Domain --> Firebase[Firebase (Auth, Firestore, Storage)]
  Domain --> ExternalAI[Gemini - @google/genai]
  Domain --> ExternalMaps[Maplibre / Geocoding]
  Browser -->|Firebase SDK| Firebase
  Browser -->|Maps| Maplibre
  note right of Domain: Money model (EP0-002) enforces integer minor-units
```

3. Repository Structure (important directories)

- src/
  - main.tsx, App.tsx: React entry and application shell
  - components/: many UI components (Navbar, ConstraintForm, ItineraryViewer, DecisionAssistantChat, DirectBookingExecutionHub, etc.)
  - hooks/: reusable React hooks
  - lib/: client-side libraries (firebase init + helpers)
  - utils/: client utilities (offline storage, i18n)
  - data/: static data (airlines, hotels, destinations) and normalization helpers
  - server/: Express API routes and server entry (server.ts)
  - server/domain/: canonical domain types and EP0-002 Money model; domain tests live under src/server/domain/tests
  - types.ts: shared TypeScript shapes used across frontend and domain tests
  - utils/runAllTests.ts: simple test harness that runs airline, hotel, and domain tests

- docs/: documentation (this file)
- package.json: scripts: dev, build, start, lint (tsc), test (runs runAllTests.ts)
- .github/workflows/ci.yml: CI pipeline (test, lint, build)

4. Runtime Request Flows

A. Itinerary generation (client-triggered)
- User submits constraints in the React UI (ConstraintForm)
- Frontend POST /api/generate-plan with constraints
- Express route (server.ts) forwards request to domain AI orchestration which calls Gemini to generate itineraryMarkdown and localExperiences
- Response returned to frontend which creates a GeneratedPlan and persists locally and optionally to Firestore via client-side firebase helpers

B. AI request
- Frontend triggers DecisionAssistantChat or generate-plan
- Server-side AI orchestration uses @google/genai (Gemini) or direct client SDK depending on code path
- Prompts are constructed in server/domain or server helpers and sent to Gemini
- Response used to build markdown itinerary, local experiences, and recommendations
- AI-generated content is cached in plan and stored locally; no authoritative booking action is taken based solely on AI

C. Weather/Geocoding (maps)
- Frontend uses maplibre-gl for maps and may call server endpoints for geocoding or use external APIs client-side (maplibre setup in components)
- Weather (if used) integration appears as an external API call — search codebase for references to confirm provider (none hard-coded beyond maplibre)

D. Authentication & data sync
- Firebase client (lib/firebase) handles sign-in
- onAuthStateChanged in App.tsx synchronizes local saved plans with Firestore via saveTripToCloud / fetchUserTripsFromCloud
- Offline caching occurs via utils/offlineStorage

5. Domain Model

- src/server/domain/types.ts contains canonical types:
  - Money: { amountMinor: number; currency: Currency } (EP0-002 enforced integer minor-units)
  - TravelProduct, Supplier, Quote, BookingSession, Booking, CancellationPolicy, PriceBreakdown, etc.
- src/server/domain/money.ts implements canonical money operations (add, subtract, multiplyByInteger, divideAndRoundInteger, allocate) with integer-safety and deterministic rounding
- Domain tests:
  - src/server/domain/tests/domain.test.ts
  - src/server/domain/tests/money.test.ts
  - src/server/domain/tests/priceBreakdown.test.ts

Boundaries:
- Domain layer is pure TypeScript types and deterministic helpers; it intentionally avoids runtime network or DB calls in EP0 tasks. UI uses these types when constructing plans and prices.

6. Data & Intelligence Layer

- src/data/: contains static normalization data for airlines and hotels (OFFICIAL_AIRLINES_DATABASE, OFFICIAL_HOTEL_CHAIN, etc.)
- Normalization utilities are used in tests and likely in server-side adapters
- No duplicate normalization or index layers are present — current assets are authoritative; future work must reuse these data sources

7. Firebase

- Client-side Firebase initialization exists under src/lib/firebase (app and helpers)
- Firebase Auth is used in the frontend for user session and syncing saved plans
- Firestore/Storage usage: saveTripToCloud, fetchUserTripsFromCloud, deleteTripFromCloud implemented in lib/firebase; Firebase rules not in this repo (server-side rules live in Firebase project)
- Security: credentials are expected to be provided via environment variables and not committed

8. External services

- Gemini: integrated via @google/genai dependency; server or client code constructs prompts and calls model
- Maps: maplibre-gl used for mapping; leaflet may be present for other map components
- Firebase: Auth & Firestore
- No explicit Open-Meteo or weather provider is committed; weather integration appears planned but not hard-wired to a specific provider

9. Testing

- Test runner: custom harness at src/utils/runAllTests.ts executed by npm test (tsx)
- Tests cover:
  - Airline normalization (src/data tests)
  - Hotel normalization
  - Domain types and money model
- Coverage gaps:
  - UI integration tests are missing
  - End-to-end server API tests are missing
  - AI prompt/response validation tests are limited

10. CI/CD

- .github/workflows/ci.yml runs on PRs and pushes:
  - Setup Node
  - Install deps
  - Run tests (npm test)
  - Run lint (tsc --noEmit)
  - Build (vite build + esbuild server bundle)
- No deployment workflow to Vercel/Netlify in repo (deploy likely manual or via separate pipeline)

11. Configuration & secrets

- dotenv is a dependency; .env not committed to repo
- package.json uses type: module and TS config present
- No API keys or secrets are committed in repository (searches done show no API key literals)

12. Confirmed Architecture Risks (observed in codebase)

| Risk | Evidence | Severity | Recommended Future Phase |
| ---- | -------- | -------- | ------------------------ |
| AI responses used without structured validation | AI-generated itinerary is passed as markdown from Gemini with limited structured validation in domain; domain tests exist but prompt/response schema validation is limited | P1 | EP2 — add JSON schema / structured output validation & retries |
| Money arithmetic scattered risk | Some helpers existed (addMoney), but centralized money ops implemented only recently; risk remains where code may do ad-hoc arithmetic | P1 | EP1 — refactor consumers to use money helpers consistently |
| Lack of E2E tests for API flows | No server API integration tests found | P1 | EP6 — add integration tests and contract tests |
| Potential client-side exposure of privileged logic | Some booking-related logic and Firebase sync performed on client; ensure server-side checks exist before any booking/purchase | P0 | EP5 — move authoritative actions server-side before real bookings |
| No runtime AI guardrails for hallucinations | No structured source-tracking for AI claims | P1 | EP2/EP5 — add provenance, citations, and confidence scoring |

13. Recommended Evolution (phased)

EP0 — Foundation
- Domain types (done), Money model (done), normalization datasets (existing)
EP1 — Core Travel Domain
- Supplier adapter contract, Product model, Quote canonicalization
EP2 — Search & Discovery
- Add search index, place lookup, geocoding adapter, structured AI outputs
EP3 — Travel Products
- Flight/hotel adapters, availability revalidation, price engines
EP4 — UX & Offline
- Improve offline resume, shared trips, multilingual polish
EP5 — Backend & Integrations
- Secure supplier credentials, server-side booking orchestration, payment boundary
EP6 — Quality & Security
- E2E tests, load tests, runtime monitoring, secrets vaulting
EP7 — Production
- Multi-supplier marketplace, scaling, SLA, observability

14. Architecture Decision Summary

- Keep unchanged: Money model (EP0-002), existing normalization data and utilities, frontend UI behavior
- Reuse: src/data normalization datasets and domain types across future adapters
- Refactor later: align all numeric/price ops to canonical money helpers (EP1)
- Must NOT duplicate: normalization/index layers or Money model

15. Validation (local commands)

The repository is validated by CI. Locally the following scripts are available:
- npm test  (runs tsx src/utils/runAllTests.ts)
- npm run lint (tsc --noEmit)
- npm run build (vite build + esbuild server bundle)

Run these in CI (the PR will trigger them).

---

End of architecture baseline.
