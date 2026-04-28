# Tasks: Align Project with Constitution

**Input**: Design documents from `/specs/005-align-with-constitution/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/di-contracts.md

**Tests**: Existing tests assume enough coverage. No new tests requested in spec, but refactoring MUST NOT break existing tests.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel
- **[Story]**: [US1] Interface-First, [US2] Hexagonal, [US3] Dead Code
- All paths are relative to repository root

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and refactoring scripts

- [X] T001 Configure `knip.json` to strictly target `src/` and ignore tests per Principle IX
- [X] T002 [P] Add refactoring helper scripts to `package.json` (e.g., `lint:knip`)
- [X] T003 Create directory structure for module template in `src/modules/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Manual Dependency Injection mechanism

**⚠️ CRITICAL**: All subsequent refactoring depends on this DI mechanism

- [X] T004 Define architectural interfaces for DI in `src/core/di.ts` per `contracts/di-contracts.md`
- [X] T005 [P] Populate initial tokens in `src/core/di-tokens.ts` for existing services
- [X] T006 Implement manual DI registration and resolution in `src/core/di.ts`
- [X] T007 [P] Create `useService` Vue composable in `src/core/di.ts` for component-level injection
- [X] T008 Update `src/main.ts` to initialize and provide the DI container to the Vue app

**Checkpoint**: DI Foundation ready - can now begin refactoring modules to interfaces

---

## Phase 3: User Story 1 - Enforce Interface-First Design (Priority: P1) 🎯 MVP

**Goal**: All cross-module dependencies use interfaces prefixed with `I`.

**Independent Test**: Static analysis of module imports showing zero concrete class dependencies across boundaries.

### Implementation for User Story 1

- [X] T009 [P] [US1] Rename all existing interfaces in `src/shared/types/` and `src/core/` to use `I` prefix
- [X] T010 [US1] Extract `IAuthService` to `src/modules/auth/core/ports/IAuthService.ts`
- [X] T011 [US1] Extract `ITransactionRepository` to `src/modules/transactions/core/ports/ITransactionRepository.ts`
- [X] T012 [US1] Extract `IWalletRepository` to `src/modules/wallets/core/ports/IWalletRepository.ts`
- [X] T013 [US1] Refactor `AuthService` in `src/modules/auth/application/services/AuthService.ts` to use constructor injection
- [X] T014 [US1] Refactor `TransactionService` in `src/modules/transactions/application/services/TransactionService.ts` to use constructor injection
- [X] T015 [US1] Register all extracted services and repositories in `src/core/di.ts`
- [X] T016 [US1] Update `useAuthStore` to resolve `IAuthService` from the container in `src/modules/auth/application/stores/authStore.ts`

**Checkpoint**: User Story 1 complete - Interface-first design enforced for core modules.

---

## Phase 4: User Story 2 - Standardize Hexagonal Architecture (Priority: P2)

**Goal**: Modules reorganized into Core/Ports/Adapters with strict boundary enforcement.

**Independent Test**: Directory structure verification and import linting (no imports from `adapters` into `core`).

### Implementation for User Story 2

- [X] T017 [US2] Reorganize `auth` module: move logic to `core/`, interfaces to `ports/`, supabase to `adapters/` in `src/modules/auth/`
- [X] T018 [US2] Reorganize `transactions` module: move logic to `core/`, interfaces to `ports/`, repositories to `adapters/` in `src/modules/transactions/`
- [X] T019 [P] [US2] Move shared entities from `src/shared/domain/entities/` to their respective module `core/` directories
- [X] T020 [US2] Refactor `TransactionFormContent.vue` to use `useService` helper instead of direct imports or `new` in `src/shared/components/organisms/TransactionFormContent.vue`
- [X] T021 [US2] Handle circular dependencies in manual DI using Lazy resolution in `src/core/di.ts` for complex module interactions
- [X] T022 [US2] Enforce boundary rules: check that `core/` never imports from `adapters/` across all refactored modules

**Checkpoint**: User Story 2 complete - Hexagonal architecture standardized across major modules.

---

## Phase 5: User Story 3 - Elimination of Dead Code (Priority: P3)

**Goal**: Zero unreferenced code in `src/` directory.

**Independent Test**: `npx knip` returns zero unused exports/files.

### Implementation for User Story 3

- [X] T023 [US3] Run `npx knip` to identify orphaned files and unused exports
- [X] T024 [US3] Delete unreferenced Pinia stores identified in the scan
- [X] T025 [US3] Delete unreferenced services and utility functions in `src/shared/utils/`
- [X] T026 [US3] Remove orphaned module directories or files leftover from the reorganization
- [X] T027 [US3] Final `knip` verification run to confirm 100% compliance with Principle IX

**Checkpoint**: All user stories complete - Project fully aligned with Constitution.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and documentation

- [X] T028 Update `README.md` to reflect the new architectural standards
- [X] T029 [P] Run all project tests `npm test` to ensure zero regressions
- [X] T030 Final check of `AGENTS.md` context markers

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Initial configuration.
- **Foundational (Phase 2)**: MUST complete before US1/US2.
- **User Story 1 (P1)**: Foundational requirement for US2 (need interfaces before reorganization).
- **User Story 2 (P2)**: Depends on US1 completion.
- **User Story 3 (P3)**: Can run concurrently with US1/US2 but final verification depends on their completion.

### Parallel Opportunities

- T002, T003 (Setup)
- T005, T007 (DI Prep)
- T009, T010, T011, T012 (Interface extraction)
- T019 (Entity migration)
- T029, T030 (Final verification)

---

## Implementation Strategy

### MVP First (User Story 1)

1. Complete DI Foundation (Phase 2)
2. Refactor `auth` and `transactions` to use Interfaces (Phase 3)
3. **VALIDATE**: Verify that dependencies are injected and prefixed with `I`.

### Incremental Delivery

1. Foundation -> US1 (Interfaces) -> US2 (Structure) -> US3 (Cleanup)
2. Each step brings the project closer to the Constitution while maintaining a working state.
