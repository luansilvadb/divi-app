# Tasks: Codebase Refactoring

**Input**: Design documents from `/specs/002-refatorar-codebase/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Initialize and install dependencies (e.g., `npm install`)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Baseline analysis that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 Run `npx knip` to identify all unused files, exports, and dependencies across `src/`
- [x] T003 Run `npm run lint:eslint` to identify functions exceeding the cyclomatic complexity threshold of 15 across `src/`
- [x] T004 Run `npm run test:unit` to ensure the current baseline has 100% passing tests

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Reduce Cyclomatic Complexity (Priority: P1) 🎯 MVP

**Goal**: Break down complex branching and nested conditionals into smaller, cohesive units (max complexity 15).

**Independent Test**: Code analysis tools confirm no function exceeds cyclomatic complexity of 15, and all existing tests pass.

### Implementation for User Story 1

- [x] T005 [P] [US1] Refactor complex functions in `src/core/` to respect max complexity of 15
- [x] T006 [P] [US1] Refactor complex functions in `src/modules/` to respect max complexity of 15
- [x] T007 [P] [US1] Refactor complex functions in `src/infrastructure/` and `src/stores/` to respect max complexity of 15
- [x] T008 [US1] Run `npm run test:unit` to ensure no regressions were introduced by the refactoring
- [x] T009 [US1] Run `npm run lint:eslint` to verify all functions are under the complexity threshold

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Eliminate Dead Code (Priority: P1)

**Goal**: Remove unused variables, orphan functions, and obsolete comments.

**Independent Test**: Static analysis tools (`knip`) confirm there are no unused exports, variables, or unreachable code paths.

### Implementation for User Story 2

- [x] T010 [P] [US2] Remove unused files, exports, and variables identified by Knip in `src/core/` and `src/shared/`
- [x] T011 [P] [US2] Remove unused files, exports, and variables identified by Knip in `src/modules/` and `src/infrastructure/`
- [x] T012 [P] [US2] Remove unused files, exports, and variables identified by Knip in `src/stores/`, `src/router/` and `src/styles/`
- [x] T013 [US2] Clean up any obsolete comments across all refactored files in `src/`
- [x] T014 [US2] Run `npx knip` to verify 0 unused exports, files, or dependencies remain

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Densify Project Structure (Priority: P2)

**Goal**: Ensure each file, function, and module has a clear, single responsibility and actively used purpose.

**Independent Test**: Architectural review confirms files without active purpose are removed, and modules have single, clear responsibilities.

### Implementation for User Story 3

- [x] T015 [US3] Consolidate fragmented or orphaned code into cohesive modules within `src/modules/`
- [x] T016 [US3] Remove any empty directories and structural remnants in `src/`
- [x] T017 [US3] Verify Hexagonal Architecture boundaries are respected (e.g., no adapters imported inside `src/core/`)

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T018 [P] Run `npm run test:unit` to guarantee 100% passing tests after all changes
- [x] T019 [P] Run `npm run type-check` and `npm run build-only` to ensure the project builds successfully
- [x] T020 Run quickstart.md validation commands to confirm all success criteria are met

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Best executed after US2 (dead code removal) to avoid consolidating dead code

### Parallel Opportunities

- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel
- Refactoring different directories for US1 and US2 marked [P] can run in parallel by different team members

---

## Parallel Example: User Story 1 & 2

```bash
# Developer A focuses on core logic
Task: "Refactor complex functions in src/core/ to respect max complexity of 15"
Task: "Remove unused files, exports, and variables identified by Knip in src/core/ and src/shared/"

# Developer B focuses on infrastructure and modules
Task: "Refactor complex functions in src/modules/ to respect max complexity of 15"
Task: "Remove unused files, exports, and variables identified by Knip in src/modules/ and src/infrastructure/"
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
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories
