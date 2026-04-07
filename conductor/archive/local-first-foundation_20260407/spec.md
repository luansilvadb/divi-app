# Specification: Epic 1 - Fundação e Núcleo Local-First (v0.2.0)

## Overview
This track establishes the foundation for the local-first architecture of the Divi application. It implements the core database layer using Dexie.js (IndexedDB) and binds it reactively to the Vue.js dashboard. This ensures that the application operates primarily offline, with real-time UI updates reflecting local data changes.

## Functional Requirements
- **Local Database Initialization:** Configure Dexie.js with a schema for the `TransactionEntity`.
- **UUID Generation:** Use `uuidv7` for generating time-sorted universal identifiers for all entities to optimize database indexing.
- **Domain & Application Contracts:** Implement the domain interface for `Transaction` and the application repository port `TransactionRepositoryPort`.
- **Dexie Adapter:** Implement `DexieTransactionRepository` to map domain entities to the Dexie schema, injecting fields like `createdAt`, `updatedAt`, and `syncStatus` ('pending').
- **Dashboard Reactivity:** Integrate the local database with the Vue dashboard using VueUse's `useObservable` to reactively bind `liveQuery` observables.
- **Empty State UI:** Display a friendly "Nenhuma transação registrada. Que tal começar?" message alongside a Call to Action button (to simulate adding a transaction) when the database is empty.
- **Incognito Mode Fallback:** Display a non-blocking Inline Banner at the top of the dashboard if IndexedDB initialization fails (e.g., in strict incognito mode).

## Non-Functional Requirements
- **Performance:** The dashboard must load in less than 100ms.
- **Concurrency:** Queries to Dexie must be non-blocking to the main thread.
- **Architecture:** Adhere strictly to the Module-Based Clean Architecture.

## Acceptance Criteria
- **Scenario 1: Empty State**
  - GIVEN the local database is empty
  - WHEN the user opens the application at `/`
  - THEN the screen loads in < 100ms
  - AND displays the text "Nenhuma transação registrada. Que tal começar?" with a Call to Action button.
- **Scenario 2: Reactive Updates**
  - GIVEN the application is loaded
  - AND the user programmatically injects a transaction via the CTA button
  - WHEN Dexie notifies the change via `useObservable`
  - THEN the View updates instantly to reflect the new transaction in the summary.
- **Scenario 3: Incognito Mode**
  - GIVEN the user is in strict incognito mode where IndexedDB is blocked
  - WHEN the application initializes
  - THEN an Inline Banner is shown explaining the limitation gracefully.

## Out of Scope
- Remote synchronization with a backend server (planned for Epic 2).
- Editing or deleting transactions via the UI.
- Complex transaction filtering or pagination.