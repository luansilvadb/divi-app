# Tasks: Codebase Refactoring and Cleanup

**Input**: Design documents from `/specs/008-codebase-refactoring-cleanup/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Tests**: Tests are explicitly requested in the specification to ensure functional parity after refactoring. Existing tests MUST be used as the source of truth, and new tests should be added for extracted logic (composables).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure verification

- [X] T001 Verify ESLint, Knip, and ts-prune configurations in repository root
- [X] T002 Ensure project builds successfully with `npm run build` before starting refactoring

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure consolidation that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 [P] Finalize `src/core/errors/DomainError.ts` as the canonical base error class
- [X] T004 [P] Wire `src/infrastructure/logging/ConsoleLogger.ts` to implement `src/core/logger/ILogger.ts`

**Checkpoint**: Foundation ready - architectural primitives are consolidated.

---

## Phase 3: User Story 1 - Simplify Complex Logic (Priority: P1) 🎯 MVP

**Goal**: Reduce cyclomatic complexity in the most "fragile" parts of the system (Charts, Forms, Utils).

**Independent Test**: ESLint `complexity` rule passes with threshold 10 for all modified files.

### Tests for User Story 1
- [X] T005 [P] [US1] Create unit tests for new composable `src/shared/composables/useChartTheme.ts`
- [X] T006 [P] [US1] Create unit tests for new validation composable `src/shared/composables/useWalletValidation.ts`
- [X] T007 [P] [US1] Verify existing tests for `src/shared/utils/bigint-adapter.ts` pass before refactoring

### Implementation for User Story 1
- [X] T008 [P] [US1] Extract theme mapping logic from `src/shared/components/organisms/PatrimonialChart.vue` to `src/shared/composables/useChartTheme.ts`
- [X] T009 [US1] Refactor `updateChartTheme` in `src/shared/components/organisms/PatrimonialChart.vue` to use the new composable
- [X] T010 [P] [US1] Refactor `parseDecimalToBigInt` in `src/shared/utils/bigint-adapter.ts` using guard clauses and early returns
- [X] T011 [P] [US1] Extract form validation from `src/presentation/components/WalletForm.vue` to `src/shared/composables/useWalletValidation.ts`
- [X] T012 [US1] Refactor `handleSubmit` and form logic in `src/presentation/components/WalletForm.vue` to use the validation composable

**Checkpoint**: User Story 1 complete - high complexity hotspots are simplified.

---

## Phase 4: User Story 2 - Purge Dead Code (Priority: P2)

**Goal**: Remove all orphan files, unused exports, and obsolete comments.

**Independent Test**: `npm run lint:knip` and `npx ts-prune` report zero unused artifacts.

### Implementation for User Story 2
- [X] T013 [P] [US2] Remove unused orphan files: `src/shared/messages/index.ts`
- [X] T014 [P] [US2] Remove unused exports in `src/core/errors/index.ts` (AppError, ValidationError, etc.)
- [X] T015 [P] [US2] Remove unused local interfaces in `src/infrastructure/storage/VaultDatabase.ts` (ILocalPayee, ILocalActivity)
- [X] T016 [P] [US2] Remove all obsolete TODO comments and unused imports across the src/ directory

**Checkpoint**: User Story 2 complete - codebase is lean and free of artifacts.

---

## Phase 5: User Story 3 - Modular Densification (Priority: P3)

**Goal**: Align module-specific logic with the project constitution (Architecture/SSOT).

**Independent Test**: Module-specific errors inherit from the central base; zero redefinitions.

### Implementation for User Story 3
- [X] T017 [US3] Delete redundant `DomainError` redefinition in `src/modules/transactions/domain/errors/index.ts`
- [X] T018 [US3] Update all transaction module error classes to extend `src/core/errors/DomainError.ts`
- [X] T019 [P] [US3] Move internal storage interfaces to a private scope in `src/infrastructure/storage/VaultDatabase.ts` or `src/infrastructure/storage/types/internal.ts`
- [X] T020 [P] [US3] Ensure `src/shared/messages/catalog.ts` is the single source for all strings in refactored components

**Checkpoint**: All user stories complete - architecture is strictly aligned.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and documentation updates

- [X] T021 Run `npm run lint:all` to verify zero violations
- [X] T022 Run `npm run test:unit` to ensure 100% functional parity
- [X] T023 Run `npm run build` to verify production build stability
- [X] T024 Update `AGENTS.md` with any new project structure patterns established

---

## Dependencies & Execution Order

### Phase Dependencies
- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Phase 1 completion.
- **User Stories (Phase 3-5)**: All depend on Foundational completion.
- **Polish (Final Phase)**: Depends on all user stories completion.

### Parallel Opportunities
- Foundational tasks (T003, T004) can run in parallel.
- User Story 1 and 2 can run in parallel as they touch different files (UI/Utils vs. Core/Infra).
- Most tasks marked with [P] within a phase can run in parallel.

---

## Implementation Strategy

### MVP First (User Story 1 Only)
1. Complete Foundation (T003-T004).
2. Refactor Charts and Utils (US1).
3. Validate parity with tests.

### Incremental Delivery
1. Foundational alignment.
2. Logic simplification (US1).
3. Code purging (US2).
4. Structural densification (US3).
