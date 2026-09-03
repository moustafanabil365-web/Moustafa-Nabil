# Residential Stays Classification & Normalization Architecture

## Overview

In the **TraviQ** travel intelligence system, **Residential Stays** (such as apartments, flats, serviced suites, chalets, and villas) are treated as a first-class travel accommodation domain, structurally separate from standard Hotels and Airlines.

The domain architecture adheres to the core engineering principle: **Deterministic logic and official registries are the source of truth for classification and normalization**, ensuring zero hallucination and strict multi-dimensional classification.

---

## Domain Boundaries

```
                 TraviQ Core Travel Domains
                            │
       ┌────────────────────┼────────────────────┐
       ▼                    ▼                    ▼
  [ Airlines ]         [ Hotels ]       [ Residential Stays ]
  - IATA/ICAO codes    - Hotel Chains   - Property Types (10)
  - Full / LCC tiers   - Star Ratings   - Service Levels (4)
  - Fleet / Routes     - Room Keys      - Stay Types (5)
                                        - Segments (10)
```

---

## Data Models & Types

### 1. Service Level (`ResidentialServiceLevel`)
- `LUXURY`: Bespoke residences, ultra-luxury penthouses, presidential villas, 24/7 dedicated butler.
- `PREMIUM`: Executive serviced apartments, upscale residences (e.g., Marriott Executive Apartments, Fraser Suites, Ascott).
- `STANDARD`: Quality furnished apartments, aparthotels, reliable mainstream stays (e.g., Citadines).
- `BUDGET`: Economy apartments, basic furnished studios, student accommodation.

### 2. Property Type (`ResidentialPropertyType`)
- `APARTMENT`: General furnished apartment.
- `FLAT`: Residential flat.
- `SERVICED_APARTMENT`: Professionally managed serviced apartments with hotel-grade amenities.
- `STUDIO`: Single open-plan residential studio.
- `PENTHOUSE`: Rooftop luxury suite with panoramic views and private terrace.
- `DUPLEX`: Multi-level two-floor apartment.
- `VILLA`: Standalone private villa or chalet.
- `TOWNHOUSE`: Multi-story connected family home.
- `RESIDENCE`: Compound or residential complex unit.
- `APARTHOTEL`: Hybrid hotel-apartment accommodation with front desk.

### 3. Stay Type (`ResidentialStayType`)
- `SHORT_STAY`: Daily and weekend stays (1–6 nights).
- `LONG_STAY`: Extended multi-week stays (7–29 nights).
- `MONTHLY`: Monthly leases and corporate housing (30+ nights).
- `FAMILY_STAY`: Vacation accommodation tailored for families.
- `BUSINESS_STAY`: Corporate housing and work-ready environments.

### 4. Residential Segments (`ResidentialSegment`)
- `BUSINESS`, `FAMILY`, `COUPLES`, `LUXURY`, `BUDGET`, `CITY_CENTER`, `BEACH`, `LONG_STAY`, `FAMILY_FRIENDLY`, `WORKATION`.

---

## Classification Pipeline

The classification pipeline is deterministic and rule-based:

```
[Raw Entity Input]
       │
       ▼
[Text Normalization (NFKD, Diacritics, Punctuation, Whitespace)]
       │
       ├─► classifyResidentialPropertyType()
       ├─► classifyResidentialServiceLevel()
       ├─► classifyResidentialStayType()
       └─► classifyResidentialSegment()
       │
       ▼
[Indexed Record / Canonical Profile]
```

---

## Normalization & Indexing API

The normalization module (`src/utils/residentialNormalization.ts`) provides:

1. **`normalizeResidentialPropertyName(name: string): string`**
   - Unicode NFKD normalization, lowercase conversion, punctuation removal, whitespace collapsing.
2. **`createResidentialIndexes(properties: ResidentialProperty[])`**
   - Creates in-memory `Map` indices: `byId`, `byNormalizedName`, `byType`, `byServiceLevel`, `byCity`.
3. **Lookup Functions**
   - `findResidentialPropertyByName(name, list)`: Case-insensitive, accent-insensitive, substring-tolerant lookup.
   - `findResidentialPropertyById(id, list)`: Fast O(1) identifier retrieval.
4. **Filtering Functions**
   - `filterResidentialByServiceLevel()`
   - `filterResidentialByPropertyType()`
   - `filterResidentialByStayType()`
   - `filterResidentialBySegment()`
   - `filterResidentialByBedrooms()`
   - `filterResidentialByGuests()`

---

## Unit Testing & Verification

Unit tests are located in `src/tests/` and can be executed via `npm test` or `npx tsx src/tests/runTests.ts`:
- **Airlines**: IATA/ICAO code lookup, case insensitivity, whitespace/punctuation handling, service level categorization.
- **Hotels**: Chain ID lookup, brand/sub-brand routing (e.g. Ritz-Carlton ➔ Marriott, Fairmont ➔ Accor), Arabic alias lookup.
- **Residential**: Property type determination, multi-dimensional classification, name normalization, indexing, and filtering.
