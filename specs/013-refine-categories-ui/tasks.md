---
description: "Task list for Refine Categories UI Aesthetics"
---

# Tasks: Refine Categories UI Aesthetics

**Input**: Design documents from `/specs/013-refine-categories-ui/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Tests**: No explicit tests requested for these micro CSS changes.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Paths shown below assume single project structure.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

*(No setup tasks required for this CSS-only refinement feature)*

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

*(No foundational tasks required for this CSS-only refinement feature)*

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Consistent Card Visuals Across Themes (Priority: P1) 🎯 MVP

**Goal**: Ensure category cards and the stats sidebar panel display with visually consistent elevation and borders that adapt correctly to the active theme.

**Independent Test**: Toggle between light and dark mode on the Categories page and confirm that card shadows and hover borders adapt correctly without visual glitches.

### Implementation for User Story 1

- [X] T001 [US1] Update `.apple-category-card` default `box-shadow` to use `var(--shadow-sm)` in `src/modules/categories/ui/views/CategoriesView.vue`
- [X] T002 [US1] Update `.apple-category-card:hover` `box-shadow` to use `var(--shadow-lg)` in `src/modules/categories/ui/views/CategoriesView.vue`
- [X] T003 [US1] Update `.apple-category-card:hover` `border-color` to use `var(--border-color-hover)` in `src/modules/categories/ui/views/CategoriesView.vue`
- [X] T004 [US1] Update `.apple-category-card:active` `box-shadow` to use `var(--shadow-sm)` in `src/modules/categories/ui/views/CategoriesView.vue`
- [X] T005 [US1] Update `.apple-stat-card` `box-shadow` to use `var(--shadow-md)` in `src/modules/categories/ui/views/CategoriesView.vue`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Icon Container Consistency (Priority: P2)

**Goal**: Ensure the icon container's border-radius aligns with the design system's radius scale.

**Independent Test**: Inspect the icon container's computed border-radius and confirm it maps to a design token.

### Implementation for User Story 2

- [X] T006 [US2] Update `.apple-card-icon` `border-radius` to use `var(--radius-lg)` in `src/modules/categories/ui/views/CategoriesView.vue`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T007 Run quickstart.md validation to manually test light/dark modes

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: N/A
- **Foundational (Phase 2)**: N/A
- **User Stories (Phase 3+)**: US1 and US2 can proceed immediately.
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start immediately - No dependencies on other stories
- **User Story 2 (P2)**: Can start immediately - No dependencies on other stories

### Within Each User Story

- Story complete before moving to next priority
- All tasks are contained within `CategoriesView.vue`

### Parallel Opportunities

- Due to all changes being in a single file (`CategoriesView.vue`), tasks should be executed sequentially by a single developer to avoid merge conflicts.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 3: User Story 1
2. **STOP and VALIDATE**: Test User Story 1 independently in browser
3. Deploy/demo if ready

### Incremental Delivery

1. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
2. Add User Story 2 → Test independently → Deploy/Demo
3. Each story adds value without breaking previous stories

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
