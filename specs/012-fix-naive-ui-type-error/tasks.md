# Tasks: fix-naive-ui-type-error

**Input**: Design documents from `/specs/012-fix-naive-ui-type-error/`
**Prerequisites**: plan.md, spec.md, research.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create feature branch and spec directory per specification workflow
- [x] T002 Create implementation plan and research artifacts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [x] T003 [P] Verify `naive-ui` dependency version and availability in `package.json`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Resolve Build Failure (Priority: P1) 🎯 MVP

**Goal**: Restore production build capability by fixing incompatible naive-ui types.

**Independent Test**: Running `npm run type-check` and `npm run build` completes successfully.

### Implementation for User Story 1

- [x] T004 [P] [US1] Update import in `src/modules/transactions/application/composables/useTransactionForm.ts` to use `MessageApi` from `naive-ui`
- [x] T005 [US1] Update `message` parameter type in `useTransactionForm` function signature in `src/modules/transactions/application/composables/useTransactionForm.ts`
- [x] T006 [US1] Verify resolution of TS2305 error by running `npm run type-check`
- [x] T007 [US1] Validate full production build by running `npm run build`

**Checkpoint**: User Story 1 is fully functional and build is restored.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and documentation

- [x] T008 [P] Update `AGENTS.md` to point to the current implementation plan
- [x] T009 [P] Update `quickstart.md` with verification steps
- [x] T010 Commit all implementation and planning artifacts to the repository

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Complete.
- **Foundational (Phase 2)**: Complete.
- **User Story 1 (Phase 3)**: Complete.
- **Polish (Phase 4)**: Complete.

### Parallel Opportunities

- T003, T004, T008, and T009 were identified as parallelizable.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Restore build stability as the primary objective.
2. Verify with standard toolchain (`vue-tsc`, `vite build`).
3. Document the fix for future reference.
