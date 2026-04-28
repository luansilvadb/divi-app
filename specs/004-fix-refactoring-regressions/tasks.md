# Tasks: Restore Application Stability and Build Integrity

**Input**: Design documents from `/specs/004-fix-refactoring-regressions/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: This feature includes a dedicated phase (User Story 3) for resolving test suite regressions and ensuring 100% pass rate.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of build stability, functional integrity, and logic verification.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Infrastructure alignment and utility standardization

- [x] T001 [P] Fix type overloads and configuration in `vitest.config.ts`
- [x] T002 [P] Implement and export `parseDecimalToBigInt` and `formatBigIntToDecimal` in `src/shared/utils/bigint-adapter.ts`
- [x] T003 Implement base `test factories` for core entities (Transaction, Budget, Wallet) in `src/__tests__/factories/entityFactories.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Interface and core logic standardization required for a stable build

- [x] T004 Standardize `ITransactionRepository` interface to include `create` and `update` in `src/shared/domain/contracts/ITransactionRepository.ts`
- [x] T005 [P] Audit and align `src/modules/ledger/domain/contracts/ITransactionRepository.ts` with the standardized shared interface
- [x] T006 [P] Audit all core ports (Budgets, Wallets, Categories) for naming consistency (`created_at` vs `createdAt`) in `src/shared/domain/contracts/`

**Checkpoint**: Core interfaces and utilities are standardized.

---

## Phase 3: User Story 1 - Reliable Build and Deployment (Priority: P1) 🎯 MVP

**Goal**: Achieve a 100% successful production build by resolving all TypeScript regressions.

**Independent Test**: Running `npm run build` and `npm run type-check` completes with zero errors.

### Implementation for User Story 1

- [x] T007 [US1] Implement missing `create` and `update` methods in `src/infrastructure/storage/VaultTransactionRepository.ts`
- [x] T008 [P] [US1] Fix constructor signature and argument mismatches in `src/core/sync/SyncEngine.ts`
- [x] T009 [P] [US1] Update `src/modules/ledger/infrastructure/repositories/VaultTransactionRepository.ts` to implement the latest `ITransactionRepository` interface
- [x] T010 [US1] Resolve property naming mismatches (`createdAt` -> `created_at`) in `src/modules/ledger/application/services/WalletService.ts`
- [x] T011 [US1] Verify build success via `npm run build`

**Checkpoint**: At this point, the application should be deployable and build-stable.

---

## Phase 4: User Story 2 - Functional Integrity of Financial Operations (Priority: P2)

**Goal**: Restore end-to-end functionality for critical UI flows (Dashboard, Category Management, Transfers).

**Independent Test**: Dashboard displays errors correctly; Category saving and Wallet transfers function without type errors.

### Implementation for User Story 2

- [x] T012 [P] [US2] Update `src/main.ts` to use `hasInitializationError` instead of `initializationError` for dashboard store
- [x] T013 [P] [US2] Restore `saveCategory` method in the transactions store at `src/modules/transactions/application/stores/transactionStore.ts`
- [x] T014 [US2] Fix null/undefined checks and integrate `bigint-adapter` in `src/modules/ledger/ui/components/TransferForm.vue`
- [x] T015 [US2] Resolve type narrowing (`never`) in `src/modules/transactions/application/services/AutoCategorizationService.ts`
- [x] T016 [US2] Add missing `localId` property to `Transaction` interface in `src/shared/domain/entities/Transaction.ts` (if required for UI/IndexedDB tracking)

**Checkpoint**: At this point, the application UI flows should be functional and type-safe.

---

## Phase 5: User Story 3 - Verified Logic and Data Consistency (Priority: P3)

**Goal**: Restore the test suite to a 100% pass rate with updated types and data models.

**Independent Test**: `npm run test:unit` completes with zero failures.

### Implementation for User Story 3

- [x] T017 [P] [US3] Update `src/core/sync/__tests__/SyncEngine.spec.ts` to use `bigint` for amounts and include mandatory sync metadata
- [x] T018 [P] [US3] Update `src/modules/budgets/__tests__/budgetsIntegration.spec.ts` to use `bigint` for limit values and metadata
- [x] T019 [P] [US3] Refactor `src/modules/auth/application/__tests__/authStore.spec.ts` to resolve non-callable expression errors
- [x] T020 [P] [US3] Align `src/modules/categories/application/services/__tests__/CategoryService.spec.ts` mocks with the `Category` entity requirement (name, icon, color)
- [x] T021 [US3] Systematically update all remaining failed test files identified in the build log to use centralized test factories
- [x] T022 [US3] Final verification of the test suite via `npm run test:unit`

**Checkpoint**: All business logic is verified and the test suite is green.

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Final audit and documentation updates

- [x] T023 [P] Update `docs/` or `README.md` to reflect the mandatory use of the `bigint-adapter` for monetary logic
- [x] T024 Perform a final check for unreferenced code (Principle IX) introduced during the fix in `src/`
- [x] T025 Run `quickstart.md` validation on a clean environment

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on Phase 1 completion (blocks all implementation).
- **User Story 1 (P1)**: Depends on Foundational phase completion. Unblocks the build.
- **User Story 2 (P2)**: Depends on P1 completion (ensures a base stable build before fixing UI flows).
- **User Story 3 (P3)**: Depends on P2 completion (ensures logic is stable before finalizing tests).
- **Polish (Final Phase)**: Depends on all user stories being complete.

---

## Parallel Opportunities

- T001 and T002 can be implemented simultaneously.
- T005 and T006 can be handled in parallel once T004 is defined.
- Once User Story 1 (T007-T010) is complete, User Story 2 and 3 can technically overlap if different team members handle UI vs. Test logic, although sequential order is safer for this restoration task.
- Most tasks in User Story 3 (T017-T020) are strictly parallelizable as they touch different test files.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 & 2.
2. Fix all build-blocking errors in User Story 1.
3. **Verify Build**: `npm run build` must pass. This is the MVP goal.

### Incremental Delivery

1. Achieve build stability (US1).
2. Restore UI functionality (US2).
3. Finalize automated verification (US3).
4. Perform final polish.

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Always prefer bringing code into alignment with the `src/core` or `src/shared` definitions.
- Commit after each task to maintain a clean history of the restoration.
