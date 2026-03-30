# Tasks: Remove Background Orbs Effect

**Input**: Design documents from `/specs/005-remove-bg-orbs/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, quickstart.md

**Organization**: Tasks are organized by User Story to ensure incremental delivery and independent testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: Validate current state and prepare for changes.

- [x] T001 Verify current visual presence of background orbs in `DashboardView.vue` and `BudgetsView.vue`

---

## Phase 2: User Story 1 - Global Removal (Priority: P1)

**Purpose**: Immediate removal of visual noise across the entire application.

**Story Goal**: Remove the gradient orbs effect globally by modifying the core atom component.
**Independent Test**: Verify that no orbs are visible on any screen after modifying the atom component.

- [x] T002 [US1] Empty the `<template>` in `src/shared/components/atoms/BaseBackgroundOrbs.vue` and replace with a comment: `<!-- Efeito removido globalmente -->`

---

## Phase 3: User Story 2 - Code Cleanup (Priority: P2)

**Purpose**: Remove dead code (imports and component tags) from identified views.

**Story Goal**: Clean up the codebase by removing unused imports of `BaseBackgroundOrbs`.
**Independent Test**: Build the project successfully and verify no "unused component" warnings or "component not found" errors exist.

- [x] T003 [P] [US2] Remove `<BaseBackgroundOrbs />` tag and its import from `src/modules/finance/ui/views/SubscriptionsView.vue`
- [x] T004 [P] [US2] Remove `<BaseBackgroundOrbs />` tag and its import from `src/modules/finance/ui/views/ReportsView.vue`
- [x] T005 [P] [US2] Remove `<BaseBackgroundOrbs />` tag and its import from `src/modules/finance/ui/views/LoansView.vue`
- [x] T006 [P] [US2] Remove `<BaseBackgroundOrbs />` tag and its import from `src/modules/finance/ui/views/GoalsView.vue`
- [x] T007 [P] [US2] Remove `<BaseBackgroundOrbs />` tag and its import from `src/modules/finance/ui/views/DashboardView.vue`
- [x] T008 [P] [US2] Remove `<BaseBackgroundOrbs />` tag and its import from `src/modules/finance/ui/views/CalendarView.vue`
- [x] T009 [P] [US2] Remove `<BaseBackgroundOrbs />` tag and its import from `src/modules/finance/ui/views/BudgetsView.vue`
- [x] T010 [P] [US2] Remove `<BaseBackgroundOrbs />` tag and its import from `src/modules/finance/ui/views/ActivityLogView.vue`

---

## Phase 4: Polish & Validation

**Purpose**: Final verification and project integrity check.

- [x] T011 Run `npm run build` to confirm project compiles correctly without missing dependencies
- [x] T012 Perform a global search for `BaseBackgroundOrbs` to ensure no stray references remain in the `src/` directory

---

## Implementation Strategy

1. **MVP First**: Complete **User Story 1** (Task T002) first. This delivers 100% of the requested visual change immediately.
2. **Incremental Cleanup**: Complete **User Story 2** tasks in parallel to remove technical debt.
3. **Safety Gate**: Use `npm run build` as the final validator for the cleanup phase.

## Dependencies & Execution Order

- **Global First (US1)**: Must empty the template before cleanup to ensure a safe visual state.
- **Cleanup Parallel (US2)**: All view cleanup tasks (T003-T010) are independent and can be executed in any order or in parallel.
- **Validation Last**: Final build check depends on all cleanup tasks being finished.

## Parallel Execution Examples

### Story 2 Execution
- **Set A**: T003, T004, T005
- **Set B**: T006, T007, T008
- **Set C**: T009, T010
