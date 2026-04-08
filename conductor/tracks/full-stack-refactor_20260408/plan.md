# Implementation Plan: Full Stack Refactor & Sync Engine

## Phase 1: Authentication & Session Management [checkpoint: cc73b0d]
- [x] Task: Configure Supabase Google OAuth (PKCE) flow. (051d7cb)
- [x] Task: Write failing unit tests for Auth session management (login, logout, session persistence). (61ba4bb)
- [x] Task: Implement/Refactor `src/modules/auth/` to support Google Login and session persistence. (748a1b8)
- [x] Task: Verify Auth state integration with Pinia store. (748a1b8)
- [ ] Task: Conductor - User Manual Verification 'Authentication & Session Management' (Protocol in workflow.md)
- [x] Task: Conductor - User Manual Verification 'Authentication & Session Management' (Protocol in workflow.md)

## Phase 2: Local-First Sync Engine Foundation
- [x] Task: Refactor Dexie.js schemas in `src/core/db.ts` to support sync metadata (timestamps, sync status). (80a18cf)
- [x] Task: Write failing unit tests for the `SyncEngine` core logic (Online/Offline transitions, conflict resolution). (73514d2)
- [x] Task: Implement the `SyncEngine` in `src/core/sync/SyncEngine.ts` using "Last Write Wins" strategy. (2fe5e31)
- [x] Task: Integrate `SyncEngine` with Dexie.js hooks for automated background synchronization. (aa8401a)
- [x] Task: Conductor - User Manual Verification 'Local-First Sync Engine Foundation' (Protocol in workflow.md)

## Phase 3: Transaction CRUD & Audit Logs
- [x] Task: Write failing unit tests for Transaction CRUD operations (Create, Read, Update, Delete). (f6722fa)
- [ ] Task: Implement Transaction module refinement in `src/modules/transactions/` with full sync support.
- [ ] Task: Write failing unit tests for Audit Log generation and persistence.
- [ ] Task: Implement automated Audit Log mechanism for all transaction state changes.
- [ ] Task: Conductor - User Manual Verification 'Transaction CRUD & Audit Logs' (Protocol in workflow.md)

## Phase 4: Final Integration & Coverage Validation
- [ ] Task: Conduct a full integration pass, ensuring Auth, Sync, and Transactions work seamlessly together.
- [ ] Task: Run full test suite with Vitest and verify >80% code coverage for the refactored modules.
- [ ] Task: Perform final linting and type-checking across the entire codebase.
- [ ] Task: Conductor - User Manual Verification 'Final Integration & Coverage Validation' (Protocol in workflow.md)
