---
description: "Task list template for feature implementation"
---

# Tasks: Align Project with Constitution

**Input**: Design documents from `/specs/006-align-constitution/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Tests**: Existing unit/integration tests must pass after refactoring. New tests are optional unless strictly needed for the message catalog format.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Verify existing build and tests pass before starting the refactoring (PARTIALLY FIXED - Vite build passes, type-check/tests still broken)
- [X] T002 [P] Configure `ts-prune` or ESLint `no-unused-vars` in `package.json` and ESLint config to prepare for dead code elimination
---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 Create directory structure for Hexagonal modules (`src/modules/`) and shared resources (`src/shared/messages/`)
- [X] T004 Setup dependency injection root mechanism in `src/main.ts` (using Vue's `app.provide`)

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Apply Hexagonal Architecture & Interface-First Design (Priority: P1) 🎯 MVP

**Goal**: Isolate business logic in the core and inject dependencies via ports/adapters (Principles VI, VII, VIII).

**Independent Test**: Can be fully tested by verifying that domain core files have zero imports from infrastructure or external libraries, and that all services depend only on `I`-prefixed interfaces.

### Implementation for User Story 1

- [X] T005 [P] [US1] Identify existing domain boundaries and create subdirectories under `src/modules/` (e.g., `src/modules/auth`, `src/modules/user`, etc.)
- [X] T006 [P] [US1] Extract pure business logic and entities into `src/modules/[module]/core/`
- [X] T007 [US1] Define `I`-prefixed interfaces for external dependencies (e.g., repositories, external APIs) in `src/modules/[module]/ports/`
- [X] T008 [US1] Move concrete implementations (e.g., Supabase/Dexie interaction) into `src/modules/[module]/adapters/` making sure they implement the respective `I` interface
- [X] T009 [US1] Refactor Pinia stores in `src/stores/` to inject adapter implementations via Vue's `inject` or constructor injection, rather than direct instantiation
- [X] T010 [US1] Run TypeScript compiler (`npm run type-check`) and fix any import path breaks across the project

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Implement Centralized Message Catalog (Priority: P2)

**Goal**: Centralize all user-facing strings into a message catalog (Principle X).

**Independent Test**: Verify that no user-facing string literals exist in business logic or handlers, and instead reference `MSG_*` codes.

### Implementation for User Story 2

- [X] T011 [P] [US2] Create the central message catalog dictionary and types in `src/shared/messages/catalog.ts`
- [X] T012 [P] [US2] Create utility function `formatMessage(code, params)` in `src/shared/messages/catalog.ts` for parameterized messages
- [X] T013 [US2] Scan `src/modules/[module]/core/` for hardcoded error/success strings and replace them with `MSG_E_*` and `MSG_S_*` keys imported from the catalog
- [X] T014 [US2] Scan Vue components in `src/` (and `App.vue`) for hardcoded alerts, information, or feedback strings and replace them with `MSG_A_*` and `MSG_I_*` keys

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Eliminate Dead Code (Priority: P3)

**Goal**: Remove all unused files, functions, and variables from the codebase (Principle IX).

**Independent Test**: Run a static analysis tool and find zero orphaned references.

### Implementation for User Story 3

- [ ] T015 [P] [US3] Run static analysis (e.g., `npx ts-prune` or `npm run lint:all`) to identify unused files, functions, or exports resulting from the refactoring
- [ ] T016 [US3] Safely delete unused files and empty directories in `src/`
- [ ] T017 [US3] Remove unused imports and variables in remaining files
- [ ] T018 [US3] Verify that the application builds successfully (`npm run build`) after code deletion

**Checkpoint**: All user stories should now be independently functional

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T019 [P] Run global formatting and linting (`npm run format` and `npm run lint`)
- [ ] T020 Run the full test suite (`npm run test:unit`) to ensure refactoring didn't break functionality
- [ ] T021 Validate the `quickstart.md` instructions against the finalized code structure

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories proceed sequentially in priority order (US1 → US2 → US3) since refactoring touches the same files.
- **Polish (Final Phase)**: Depends on all user stories being complete

### Parallel Opportunities

- Within US1, extracting core logic (T006) and defining ports (T007) can happen somewhat in parallel across different modules.
- Within US2, creating the catalog (T011, T012) can be done independently of US1, but applying it (T013, T014) is best done after US1 structural changes.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 & 2.
2. Complete Phase 3 (Hexagonal Refactoring).
3. Stop and ensure the build and tests pass. This is the structural foundation.

### Incremental Delivery

1. Structural Refactoring (US1) -> Verify stability.
2. String Externalization (US2) -> Verify stability.
3. Dead Code Cleanup (US3) -> Verify stability.
