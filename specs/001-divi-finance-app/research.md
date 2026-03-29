# Research: Divi Personal Finance App Technical Strategy

**Feature**: `001-divi-finance-app`
**Status**: Resolved

## 1. PWA & Offline Synchronization
**Decision**: Use `vite-plugin-pwa` with `injectManifest` and `Dexie.js`.
**Rationale**: 
- `injectManifest` provides full control over the Service Worker, which is necessary for complex synchronization logic with Supabase.
- `Dexie.js` (IndexedDB wrapper) provides a robust local storage layer that can handle transactional data offline, fulfilling the requirement for "Offline-capable" (SC-004).
- **Optimistic UI**: Pinia stores will update immediately, while a background process (Service Worker + Background Sync API) syncs local IndexedDB changes to Supabase when online.

**Alternatives Considered**:
- `generateSW`: Rejected as it's too limited for custom background sync logic.
- `localStorage`: Rejected due to storage limits and lack of structured querying.

## 2. Supabase Integration & Authentication
**Decision**: Supabase Auth with Google OAuth + Row Level Security (RLS).
**Rationale**: 
- Native Google Auth support simplifies the login flow.
- RLS ensures that users can only access their own financial data at the database level.
- Real-time subscriptions will be used to keep multiple tabs/devices in sync when online.

## 3. Dependency Injection (DI) Pattern
**Decision**: Vue 3 `provide/inject` with Injection Keys.
**Rationale**: 
- Aligns with the Constitution's mandate for DI without a complex Unit of Work pattern on the frontend.
- Injection keys provide type safety for injected services (Repositories, Services).
- Initialization happens in `src/core/di.ts` at the application root.

## 4. Data Visualization
**Decision**: `vue-chartjs` (wrapper for Chart.js).
**Rationale**: 
- Lightweight, well-supported, and integrates seamlessly with Vue 3.
- Capable of rendering area charts (patrimonial evolution) and donut charts (category breakdown) with high performance (meeting SC-003).

## 5. Multi-Currency Handling
**Decision**: Domain-level `CurrencyService` + Cached Exchange Rates.
**Rationale**: 
- A dedicated service in the domain layer handles all conversion logic, keeping the UI components clean.
- Exchange rates will be fetched from an external API (cached in IndexedDB) to allow offline conversions.
- Values are stored in their original currency but aggregated in a "Display Currency" for reports.
