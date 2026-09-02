You are now acting as the Senior Software Architect, AI Engineer, Tourism Technology Expert, UX/UI Expert, Cybersecurity Reviewer, Product Manager, and Graduation Project Reviewer for this entire project.

IMPORTANT:
Do NOT redesign the application yet.
Do NOT remove existing features.
Do NOT rewrite the project blindly.
Do NOT create a new project.
Do NOT change the GitHub repository.
Do NOT expose or hardcode any API keys.

The current project is TraviQ / SmartTravel AI — an AI Travel Intelligence Platform.

Your first task is to perform a COMPLETE INTERNAL AUDIT of the EXISTING CODEBASE.

You have access to the entire current project. Inspect all relevant files, frontend components, backend/server code, Firebase integration, AI integration, data sources, maps, itinerary generation, budget logic, authentication, storage, offline functionality, multilingual/Arabic RTL support, booking-related components, travel alerts, packing features, reminders, chat, and all API endpoints.

DO NOT make functional changes yet.

Instead, produce a detailed technical audit inside the project as:

AUDIT_REPORT.md

The audit must contain exactly these sections:

1. EXECUTIVE SUMMARY

* What the application currently does
* What is already strong
* What is incomplete
* What prevents it from being considered production-ready
* What prevents it from being considered a strong graduation project

2. CURRENT ARCHITECTURE
   Document:

* Frontend architecture
* Backend architecture
* AI architecture
* Firebase architecture
* Data flow
* API endpoints
* State management
* Local storage
* Offline functionality
* Authentication
* External APIs
* Map/location architecture

3. FEATURE INVENTORY
   Create a table containing:
   Feature
   Current Status
   Implementation Quality
   AI-powered or deterministic
   Data source
   Major problems
   Recommended action

Audit every existing feature.

4. AI AUDIT
   Analyze:

* Gemini usage
* Prompt architecture
* System instructions
* Model selection
* Retry/fallback logic
* Structured outputs
* JSON validation
* Hallucination risks
* Context handling
* Personalization
* AI explainability
* AI evaluation
* Whether AI is actually adding intelligence or simply generating text

5. TOURISM INTELLIGENCE AUDIT
   Evaluate whether the system can genuinely:

* Build realistic itineraries
* Respect travel duration
* Respect traveler type
* Respect budget
* Optimize geographic routes
* Avoid unnecessary backtracking
* Consider transportation
* Consider weather
* Consider opening/closing times
* Consider seasonality
* Distinguish verified information from estimates
* Recommend authentic local experiences responsibly

Identify every place where the application currently makes assumptions.

6. DATA RELIABILITY AUDIT
   Identify every feature that claims or implies:

* real-time data
* live alerts
* current weather
* current prices
* current transportation information
* current attraction information

For each one, determine whether the application is using:
A. Real external data
B. Static data
C. AI-generated information
D. A mixture

Flag any feature where AI-generated information could be mistaken for real-world live data.

7. SECURITY AUDIT
   Check:

* API keys
* environment variables
* client/server separation
* Firebase rules
* authentication
* authorization
* user data
* Firestore access
* API input validation
* prompt injection risks
* excessive request payloads
* rate limiting
* abuse protection
* error leakage
* secrets exposure

8. CODE QUALITY AUDIT
   Identify:

* duplicated logic
* very large files
* tightly coupled components
* unsafe any usage
* missing types
* dead code
* unnecessary dependencies
* fragile fallback logic
* error handling weaknesses
* performance problems
* maintainability problems

9. UX/UI AUDIT
   Evaluate:

* Arabic RTL
* English LTR
* mobile responsiveness
* accessibility
* navigation
* onboarding
* loading states
* empty states
* error states
* user trust
* visual hierarchy
* consistency
* information overload
* conversion to the main value proposition

10. PRODUCT AUDIT
    Evaluate TraviQ as a real product.

Answer:

* What is the core problem?
* Who is the primary user?
* What makes TraviQ different from a generic AI chatbot?
* What is the strongest USP?
* What features are unnecessary distractions?
* What should be the primary user journey?
* What should be demonstrated during the graduation presentation?

11. ACADEMIC / GRADUATION PROJECT AUDIT
    Evaluate:

* Problem definition
* Innovation
* AI contribution
* Technical complexity
* Measurable outcomes
* Evaluation methodology
* Dataset requirements
* Baselines
* Metrics
* User testing
* Reproducibility
* Research value
* Real-world impact

12. CRITICAL ISSUES
    Rank every issue:
    P0 = Critical
    P1 = High
    P2 = Medium
    P3 = Low

Explain why each issue matters.

13. RECOMMENDED TARGET ARCHITECTURE
    Design the architecture that TraviQ SHOULD have, while preserving the useful existing work.

Include:
Frontend
Backend
AI orchestration
Travel data layer
Weather layer
Geocoding layer
Routing/optimization layer
Budget engine
Evaluation engine
Database
Authentication
Security
Caching
Observability

14. TRAVIQ DIFFERENTIATION
    Define how to transform the current application from:
    "AI itinerary generator"

into:

"AI Travel Intelligence & Decision Optimization Platform"

The platform must be able to:
Plan
Optimize
Evaluate
Explain
Adapt

15. FINAL ROADMAP
    Create:
    Phase 1 — Critical fixes
    Phase 2 — AI intelligence
    Phase 3 — Tourism data reliability
    Phase 4 — UX/UI
    Phase 5 — Security
    Phase 6 — Evaluation
    Phase 7 — Deployment
    Phase 8 — Graduation demo

For every phase list:

* exact task
* priority
* expected result
* files likely affected

IMPORTANT:
At the end, provide:

TOP 10 CHANGES WE MUST MAKE FIRST

Do not implement these changes yet.

Only produce the audit report and summarize the findings in the AI Studio response.
