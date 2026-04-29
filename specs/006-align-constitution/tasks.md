---
description: "Task list template for feature implementation"
---

# Tasks: Align Project with Constitution

**Input**: Design documents from `/specs/006-align-constitution/`
**Prerequisites**: plan.md (required), spec.md (required)

## Implementation Plan

### Phase 1: Setup and Foundation
- [X] T001 Verify existing build and tests pass before starting
- [X] T002 Configure `ts-prune` or ESLint `no-unused-vars` to detect dead code (Constitution Principle VI)
- [X] T003 Create directory structure for Hexagonal modules (src/modules/) and shared resources (src/shared/messages/)
- [X] T004 Setup dependency injection (DI) using a simple container in `src/core/di.ts` (Constitution Principle VII)

### Phase 2: User Story 1 - Structural Refactoring
- [X] T005 [P] [US1] Identify existing domain boundaries (Auth, Transactions, Budgets, etc.)
- [X] T006 [US1] Extract pure business logic and entities into `src/modules/[module]/core/` (Constitution Principle VI)
- [X] T007 [US1] Define `I`-prefixed interfaces for all services and repositories in `src/modules/[module]/ports/` (Constitution Principle VII, VIII)
- [X] T008 [US1] Move concrete implementations (Supabase, Dexie) to `src/modules/[module]/adapters/`
- [X] T009 [US1] Refactor Pinia stores in `src/stores/` to inject adapter implementations via DI rather than direct instantiation
- [X] T010 [US1] Run TypeScript compiler (`npm run type-check`) to ensure all interfaces are correctly implemented and injected

### Phase 3: User Story 2 - String Externalization
- [X] T011 [US2] Create central message catalog at `src/shared/messages/catalog.ts` (Constitution Principle XI)
- [X] T012 [US2] Create utility function `formatMessage` to handle simple placeholders in strings
- [X] T013 [P] [US2] Scan `core/` for hardcoded strings and move them to catalog
- [X] T014 [US2] Scan Vue components for hardcoded strings (prioritize user-facing messages) and replace with catalog references

### Phase 4: Integration and Stability
- [X] T015 [P] [US1, US2] Update existing tests to reflect new directory structure and DI pattern
- [X] T016 [US1, US2] Ensure application entry point (`src/main.ts`) correctly registers all implementations in the DI container

### Phase 5: User Story 3 - Eliminate Dead Code
- [X] T017 [P] [US3] Run static analysis tool (`knip` or `ts-prune`) to find unused exports and files
- [X] T018 [US3] Safely delete unused files and empty directories in `src/`
- [X] T019 [US3] Remove unused imports and variables in remaining files
- [X] T020 [US3] Verify that the application builds successfully (`npm run build`) after code deletion

### Phase N: Polish
- [X] T021 [P] Run global formatting and linting (`npm run lint` and `npm run format`)
- [X] T022 Run the full test suite (`npm run test:unit`) to ensure 100% pass rate
- [X] T023 Validate the `quickstart.md` instructions against the final codebase

## Execution Rules
- **Sequential**: Phase 1 -> Phase 2 -> Phase 3 -> Phase 5.
- **Parallel [P]**: Tasks within the same phase marked with [P] can be executed concurrently.
- **Validation**: Each Phase must be validated by running `npm run build` and `npm run test:unit`.

## Definition of Done
- [X] Codebase follows Hexagonal Architecture: `core/`, `ports/`, `adapters/`.
- [X] Dependency Injection is used for all external adapters and cross-module services.
- [X] All interfaces are prefixed with `I`.
- [X] No hardcoded user strings in `core/` logic.
- [X] 0 unused files/exports in `src/`.
- [X] Application build and full test suite pass.
- [X] `quickstart.md` is updated and accurate.

## Progress Tracking
- **Phase 1**: Completed.
- **Phase 2**: Completed.
- **Phase 3**: Completed.
- **Phase 4**: Completed.
- **Phase 5**: Completed.
- **Phase N**: Completed.

### Milestone Checkpoints
1. Foundation -> DI setup and directory layout.
2. Logic Migration -> Core logic moved, build passes.
3. String Purity -> No hardcoded strings in core.
4. Clean Code -> Unused files removed, tests pass.

### Incremental Delivery
1. Structural Refactoring (US1) -> Verify stability.
2. String Externalization (US2) -> Verify stability.
3. Dead Code Cleanup (US3) -> Verify stability.
