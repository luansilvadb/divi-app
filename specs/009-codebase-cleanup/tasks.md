---
description: "Task list for Codebase Refactoring and Cleanup"
---

# Tasks: Codebase Refactoring and Cleanup

**Input**: Design documents from `/specs/009-codebase-cleanup/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: This feature relies strictly on the existing Vitest suite to prevent regressions. No new test tasks are generated, but executing tests is mandatory.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Configure ESLint complexity rule to threshold 10 in `.eslintrc.cjs` (or equivalent config file).
- [X] T002 Verify `knip` is configured correctly in `package.json`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 Verify existing test suite passes by running `vitest` command in project root before starting any refactoring.

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Reduce Cyclomatic Complexity (Priority: P1) 🎯 MVP

**Goal**: Simplify complex functions and conditionals to make the code easier to maintain.

**Independent Test**: ESLint complexity rule passes and tests maintain 100% coverage.

### Implementation for User Story 1

- [X] T004 [US1] Run ESLint complexity check to identify target functions across `src/`.
- [X] T005 [P] [US1] Refactor complex functions in `src/core/` and verify unit tests.
- [X] T006 [P] [US1] Refactor complex functions in `src/infrastructure/` and verify unit tests.
- [X] T007 [P] [US1] Refactor complex functions in `src/modules/` and verify unit tests.

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Purge Dead Code (Priority: P2)

**Goal**: Eliminate unused variables, orphan functions, obsolete comments, and unneeded imports.

**Independent Test**: Code analysis tools (knip/eslint) report no unused code or imports.

### Implementation for User Story 2

- [X] T008 [US2] Run `knip` to identify dead code across `src/`.
- [X] T009 [P] [US2] Remove unused variables, functions, and imports in `src/core/`.
- [X] T010 [P] [US2] Remove unused variables, functions, and imports in `src/infrastructure/`.
- [X] T011 [P] [US2] Remove unused variables, functions, and imports in `src/modules/`.
- [X] T012 [P] [US2] Remove unused dependencies from `package.json`.

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Modular Densification (Priority: P3)

**Goal**: Ensure every file, function, and module has a clear, active responsibility.

**Independent Test**: Code compiles and tests pass after removing redundant modules.

### Implementation for User Story 3

- [X] T013 [US3] Review and consolidate redundant files in `src/shared/`.
- [X] T014 [US3] Merge or remove files lacking active responsibility in `src/modules/`.

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T015 Run full test suite to verify 100% pass rate in project root.
- [X] T016 Run type checking and linting for final verification in project root.
- [X] T017 Revert ESLint complexity rule to `warn` or project default in `.eslintrc.cjs` if it was temporarily tightened for the cleanup process.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Should be independently testable

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- Tasks marked [P] within stories (e.g., refactoring different directories like `src/core/`, `src/modules/`) can run in parallel.
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 2

```bash
# Launch dead code removal for User Story 2 together:
Task: "Remove unused variables, functions, and imports in src/core/"
Task: "Remove unused variables, functions, and imports in src/infrastructure/"
Task: "Remove unused variables, functions, and imports in src/modules/"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → MVP!
3. Add User Story 2 → Test independently
4. Add User Story 3 → Test independently
5. Each story adds value without breaking previous stories
