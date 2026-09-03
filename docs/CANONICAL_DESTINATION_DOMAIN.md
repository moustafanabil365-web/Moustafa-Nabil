# EP1-002: Canonical Destination Domain Architecture

## 1. Executive Summary & Vision

The **Canonical Destination Domain** establishes the single source of truth for geographical destinations, administrative divisions, cities, and transit hubs across the **TraviQ AI Travel Intelligence Platform**.

Instead of treating destinations as arbitrary text strings or mixing them directly with UI components, the domain layer cleanly abstracts travel targets into structured, type-safe, and deterministic entities.

---

## 2. Core Concepts: Destination vs. City

A frequent source of architectural confusion in travel systems is conflating **Cities** with **Destinations**:

| Aspect | City (`City`) | Destination (`Destination`) |
| :--- | :--- | :--- |
| **Domain Role** | Administrative / Geographic municipality | The intentional target of a traveler’s journey or interest |
| **Granularity** | Strict municipality borders (e.g., Cairo, Dubai, Riyadh) | Can be a City, a Region (AlUla, Asir, Luxor & Aswan), a Country (Japan, Switzerland), a Landmark (Giza Pyramids), or an Island (Maldives, Santorini) |
| **Airport Link** | Serviced by local or regional transit nodes | Associated with primary arrival gateway(s) and transit hubs |
| **Travel Context** | Pure metadata (coordinates, timezone, country) | Includes seasonality, budget tier, travel styles, ideal stay duration, and curated landmarks |

Every city can be represented as a destination, but not every destination is a single city.

---

## 3. Destination Types (`DestinationType`)

Supported canonical types:
1. `'city'`: Standard metropolitan and urban hubs (e.g., Tokyo, London, Dubai, Riyadh).
2. `'region'`: Multi-city or scenic geographical zones (e.g., AlUla, Asir & Abha, Luxor & Aswan, Swiss Alps).
3. `'landmark'`: High-value travel sites and heritage wonders (e.g., Giza Pyramids & Sphinx, Petra).
4. `'island'`: Archipelago or island escapes (e.g., Maldives, Phuket, Bali).
5. `'country'`: Country-level travel exploration scopes (e.g., Saudi Arabia, Japan, Italy).

---

## 4. Deterministic Canonical ID Strategy

All identifiers in TraviQ are **100% deterministic, reproducible, namespaced, and independent of database auto-incrementing integers or random UUIDs**.

### ID Schemes:
- **Destination**: `dst_<type>_<countryCodeLowercase>_<slug>`
  - Example (City): `dst_city_sa_riyadh`
  - Example (Country): `dst_country_sa`
  - Example (Region): `dst_region_sa_asir`
  - Example (Landmark): `dst_landmark_eg_giza_pyramids`
  - Example (Island): `dst_island_mv_maldives`
- **City**: `city_<countryCodeLowercase>_<slug>` (e.g. `city_sa_riyadh`, `city_ae_dubai`)
- **Airport**: `apt_<iataLowercase>` (e.g. `apt_ruh`, `apt_dxb`, `apt_cai`)
- **Country**: `country_<countryCodeLowercase>` (e.g. `country_sa`, `country_eg`)

---

## 5. Normalization Responsibilities

Destination normalization handles linguistic quirks across Arabic and Latin scripts safely:

1. **Unicode & Whitespace**:
   - `normalize('NFKD')` Unicode normalization.
   - Trimming and collapsing consecutive whitespace into a single space.
2. **Arabic Diacritics (Tashkeel)**:
   - Stripping Fatha, Damma, Kasra, Sukun, Shadda, Tanween (`[\u064B-\u065F\u0670\u06D6-\u06ED]`).
3. **Arabic Tatweel & Variants**:
   - Removing Tatweel (`ـ`).
   - Normalizing Alef variants (`أ`, `إ`, `آ`, `ٱ` $\rightarrow$ `ا`).
   - Normalizing Taa Marbouta (`ة` $\rightarrow$ `ه`) for search tolerance.
   - Normalizing Alef Maksura and Hamza forms (`ى`, `ئ` $\rightarrow$ `ي`, `ؤ` $\rightarrow$ `و`).
4. **Punctuation & Accent Folding**:
   - Stripping non-essential punctuation and Latin accents (`Zürich` $\rightarrow$ `zurich`).

---

## 6. Adapter & Dataset Integrity

The canonical domain acts as an adapter layer over existing datasets:
- Reads from `GLOBAL_COUNTRIES` without duplicating large JSON blobs or assets.
- Dynamically converts raw country and popular city entries into typed `Country`, `City`, `Airport`, and `Destination` entities.
- Preserves complete backward compatibility for existing UI components: `GlobalDestinationsBrowser`, `ConstraintForm`, `DestinationPhotoGallery`, and `DirectBookingExecutionHub`.

---

## 7. Domain Relationships & Hierarchy

The domain strictly models and validates the hierarchy:
$$\text{Country (ISO-2)} \longrightarrow \text{City (Canonical ID)} \longrightarrow \text{Airport (IATA / ICAO)}$$

### Hierarchy Validation (`validateDestinationHierarchy`):
- Verifies that referenced Country codes exist in the canonical ISO-2 index.
- Verifies that referenced City IDs belong to the designated Country.
- Validates geographic coordinate ranges ($-90 \le \text{lat} \le 90$, $-180 \le \text{lng} \le 180$).
- Validates ideal stay durations ($1 \le \text{minDays} \le \text{recommendedDays} \le \text{maxDays}$).

---

## 8. Lookup Foundation vs. Deferred to EP2

### Implemented in EP1-002:
- Deterministic in-memory index queries (`getDestinationById`, `getDestinationBySlug`, `findDestinationsByName`).
- In-memory lookups by `countryCode`, `type`, and `travelStyle`.
- Entity resolution for `Country`, `City`, and `Airport`.

### Explicitly Deferred to EP2 (Search & Discovery):
- Fuzzy string matching / Levenshtein distance ranking.
- Typo-tolerant autocomplete components.
- Vector search / embeddings for natural language intent ("warm sunny beach within 4 hours flight").
- External search engines (Elasticsearch, Algolia, Meilisearch, Typesense).
- User search history & popularity weighting.
