# Implementation Plan: Epic 1 - Fundação e Núcleo Local-First

## Phase 1: Dexie.js Setup and Database Infrastructure [checkpoint: d398b99]
- [x] Task: Project Setup & Dependencies (e3f6fc4)
    - [x] Install `dexie`, `uuid`, and `@types/uuid`.
- [x] Task: Implement `DiviDatabase` (2fcab49)
    - [x] Write tests for Dexie initialization and schema validation.
    - [x] Implement `src/infrastructure/db/DexieDB.ts` with `TransactionEntity` schema.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Dexie.js Setup and Database Infrastructure' (d398b99)

## Phase 2: Domain and Application Layers
- [x] Task: Implement Domain Contracts (a27f721)
    - [x] Write unit tests for the `Transaction` domain model if applicable.
    - [x] Create `src/modules/transactions/domain/Transaction.ts`.
- [x] Task: Implement Application Contracts (29c57c9)
    - [x] Create `src/modules/transactions/application/TransactionRepositoryPort.ts`.
- [x] Task: Implement `DexieTransactionRepository` (2c57880)
    - [x] Write integration tests for the repository adapter.
    - [x] Implement `src/modules/transactions/infrastructure/DexieTransactionRepository.ts`, handling UUID generation (v7), timestamps, and sync status.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Domain and Application Layers' (Protocol in workflow.md)

## Phase 3: Vue Dashboard Reactivity and UI
- [ ] Task: Build Dashboard Empty State
    - [ ] Write component tests for `DashboardView.vue` empty state.
    - [ ] Implement "Nenhuma transação registrada..." empty state with CTA button.
- [ ] Task: Handle Incognito Mode Failures
    - [ ] Write tests to simulate IndexedDB failure.
    - [ ] Implement the top Inline Banner for initialization errors.
- [ ] Task: Integrate VueUse `useObservable`
    - [ ] Write tests verifying reactive updates when a transaction is added.
    - [ ] Bind `DashboardView` to `DexieTransactionRepository` using `useObservable`.
    - [ ] Connect the CTA button to inject a simulated transaction and verify real-time updates.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Vue Dashboard Reactivity and UI' (Protocol in workflow.md)