# Tasks: Codebase Refactoring and Cleanup

**Input**: Design documents from `specs/010-codebase-refactoring-cleanup/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

**Tests**: Existing test suite will be used for verification. No new test files requested, but unit test parity must be maintained for extracted logic.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Configure refactoring environment (ensure `knip`, `eslint`, `oxlint` are ready)
- [ ] T002 [P] Update `eslint.config.ts` to set `complexity` rule to `error` level with max 10

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T003 Create `useTransactionForm` composable skeleton in `src/modules/transactions/application/composables/useTransactionForm.ts`
- [ ] T004 Setup fail-fast gates: ensure the project builds and all tests pass BEFORE starting refactoring

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Maintainability Improvement (Priority: P1) 🎯 MVP

**Goal**: Reduce cyclomatic complexity and remove dead code from core components.

**Independent Test**: `ITransactionFormContent.vue` complexity < 10 and 100% test pass.

### Implementation for User Story 1

- [ ] T005 [P] [US1] Extract form state and validation logic from `src/shared/components/organisms/ITransactionFormContent.vue` to `src/modules/transactions/application/composables/useTransactionForm.ts`
- [ ] T006 [P] [US1] Extract currency masking logic from `src/shared/components/organisms/ITransactionFormContent.vue` to `src/modules/transactions/application/composables/useTransactionForm.ts`
- [ ] T007 [US1] Refactor `handleSubmit` and `buildITransactionData` in `src/shared/components/organisms/ITransactionFormContent.vue` to delegate to the new composable
- [ ] T008 [P] [US1] Remove obsolete comments and finalized bigint "TODO" logic in `src/shared/utils/bigint-adapter.ts`
- [ ] T009 [US1] Verify Story 1: Run `npx eslint src` and ensure no complexity errors in modified files
- [ ] T010 [US1] Run existing unit tests: `npm test src/shared/components/organisms/__tests__/ITransactionFormContent.spec.ts` (if exists) or full suite

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Project Densification (Priority: P2)

**Goal**: Streamline stores and ensure clear responsibilities by decoupling transaction store from other domains.

**Independent Test**: `transactionStore.ts` size reduced and only contains transaction logic.

### Implementation for User Story 2

- [ ] T011 [US2] Refactor `src/modules/transactions/application/stores/transactionStore.ts` to remove `saveIWallet` delegation (move logic to `walletStore`)
- [ ] T012 [US2] Refactor `src/modules/transactions/application/stores/transactionStore.ts` to remove `saveCategory` delegation (move logic to `categoryStore`)
- [ ] T013 [US2] Simplify `transactionStore.ts` by consolidating UI-only transformation logic into the `enrichITransaction` or a dedicated mapper
- [ ] T014 [US2] Run `knip` to identify and remove any now-orphaned exports or files in the transaction module
- [ ] T015 [US2] Verify Story 2: Run full test suite to ensure no breakage in wallet/category creation flows

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T016 [P] Documentation updates: ensure `README.md` and architecture docs reflect the new composable-based structure
- [ ] T017 Final audit of all user-facing strings against `src/shared/messages/catalog.ts`
- [ ] T018 Run `quickstart.md` validation to confirm all success criteria (SLOC reduction, zero complexity errors)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on Setup.
- **User Stories (Phase 3+)**: Depend on Foundational. US1 and US2 can proceed in parallel once composable infrastructure is in place.

### Parallel Opportunities

- T005, T006, and T008 can be worked on in parallel once T003 is done.
- US1 and US2 refactor different files and can proceed in parallel.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Setup + Foundational.
2. Complete US1: Extract composable and reduce complexity in the main form.
3. Validate US1 via complexity audit and tests.

### Incremental Delivery

1. Refactor UI logic (US1) → Foundation for easier UI changes.
2. Refactor Store logic (US2) → Leaner application layer.
3. Polish → Final validation.
