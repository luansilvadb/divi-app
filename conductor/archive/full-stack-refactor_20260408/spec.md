# Specification: Full Stack Alignment & Refactor

## Overview
This track aims to address architectural inconsistencies ("gohorse" code) by implementing a robust local-first synchronization engine, secure Google Authentication via Supabase, a complete Transaction CRUD with audit logging, and comprehensive unit/integration test coverage across the application.

## Functional Requirements
1.  **Google Authentication:**
    -   Implement Google Login using Supabase Native OAuth (PKCE).
    -   Manage user sessions (login, logout, session persistence).
    -   Secure user-specific data in Supabase (RLS policies).
2.  **Sync Engine (Local-First):**
    -   Implement bi-directional synchronization between Dexie.js (local) and Supabase (remote).
    -   Strategy: "Last Write Wins" based on time-sorted UUIDs (v7) or timestamps.
    -   Handle offline/online transitions gracefully (background sync).
3.  **Transaction CRUD & Audit Logs:**
    -   Complete implementation of Transaction module (Create, Read, Update, Delete).
    -   Implement automated audit logging for every transaction state change.
4.  **Test Coverage:**
    -   Achieve full unit and integration test coverage for all core modules (Auth, Sync, Transactions).
    -   Target: >80% code coverage using Vitest.

## Non-Functional Requirements
- **Performance:** Optimized database indexing and minimal sync overhead.
- **Reliability:** Data integrity must be maintained during sync; no data loss on offline transitions.
- **Privacy:** User data must be securely isolated per account.

## Acceptance Criteria
- [ ] Users can successfully authenticate via Google and maintain a persistent session.
- [ ] Transactions created while offline are automatically synced to Supabase when a connection is restored.
- [ ] Modifications to transactions are reflected in an audit log with correct timestamps and user IDs.
- [ ] The test suite (Vitest) passes with >80% coverage for the affected modules.
- [ ] No regressions in existing dashboard or module features.

## Out of Scope
- Manual conflict resolution UI.
- Extensive E2E (Playwright) testing (focus remains on Unit/Integration).
- Support for multiple social login providers beyond Google.
