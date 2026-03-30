# Tasks: Standardize UI Design System

**Input**: Design documents from `/specs/004-standardize-ui-consistency/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Foundational Utilities)

**Purpose**: Create centralized utilities for data formatting to be used across all modules.

- [X] T001 Create shared formatting utilities in `src/shared/utils/formatters.ts`
- [X] T002 [P] Centralize shared UI types/interfaces in `src/shared/types/ui.ts`

---

## Phase 2: [US2] Reusable Financial Components (Foundational UI)

**Purpose**: Refine shared components to match the "Holy Grail" design of the Budgets screen.

- [X] T003 [P] [US2] Update `BaseCard.vue` in `src/shared/components/atoms/BaseCard.vue` to support clickable states and standardized padding
- [X] T004 [P] [US2] Update `BaseProgressBar.vue` in `src/shared/components/atoms/BaseProgressBar.vue` with enhanced styling
- [X] T005 [P] [US2] Enhance `BaseSummaryItem.vue` in `src/shared/components/molecules/BaseSummaryItem.vue` with status variants (success, error, warning)
- [X] T006 [P] [US2] Standardize `BaseViewHeader.vue` in `src/shared/components/organisms/BaseViewHeader.vue` props and action slot

---

## Phase 3: [US1] Consistent Layout & Visual Identity (P1)

**Purpose**: Apply the unified layout structure (Header, Background, Grid) to all feature views.

- [X] T007 [US1] Apply `view-wrapper` and `BaseBackgroundOrbs` to `src/modules/finance/ui/views/DashboardView.vue`
- [X] T008 [US1] Apply `view-wrapper` and `BaseBackgroundOrbs` to `src/modules/finance/ui/views/TransactionsView.vue`
- [X] T009 [US1] Implement `view-content-grid` layout (main/side columns) in `src/modules/finance/ui/views/DashboardView.vue`
- [X] T010 [US1] Implement `view-content-grid` layout (main/side columns) in `src/modules/finance/ui/views/TransactionsView.vue`
- [X] T011 [US1] Migrate other views (Loans, Goals, Reports) to the new layout pattern in `src/modules/finance/ui/views/`

---

## Phase 4: [US2] Reusable Financial Components (P2)

**Purpose**: Replace local UI blocks with standardized shared components.

- [X] T012 [P] [US2] Replace custom summary cards with `BaseSummaryItem` in `src/modules/finance/ui/views/DashboardView.vue`
- [X] T013 [P] [US2] Replace custom summary items with `BaseSummaryItem` in `src/modules/finance/ui/views/TransactionsView.vue`
- [X] T014 [P] [US2] Standardize `BaseCard` usage across `src/modules/finance/ui/views/DashboardView.vue`
- [X] T015 [P] [US2] Use `BaseProgressBar` for category breakdowns in `src/modules/finance/ui/views/TransactionsView.vue`

---

## Phase 5: [US3] Unified Data Formatting (P3)

**Purpose**: Integrate centralized formatting utilities to ensure consistent currency and date display.

- [X] T016 [US3] Integrate `formatCurrency` and `formatDate` from `src/shared/utils/formatters.ts` into `src/modules/finance/ui/views/DashboardView.vue`
- [X] T017 [US3] Integrate `formatCurrency` and `formatDate` from `src/shared/utils/formatters.ts` into `src/modules/finance/ui/views/TransactionsView.vue`
- [X] T018 [US3] Integrate `formatCurrency` and `formatDate` from `src/shared/utils/formatters.ts` into `src/modules/finance/ui/views/BudgetsView.vue`

---

## Phase 6: Polish & Quality Audit

**Purpose**: Final review of responsiveness, dark mode, and code cleanup.

- [X] T019 Audit all views for Dark Mode consistency and responsiveness (1100px breakpoint)
- [X] T020 Remove redundant CSS and unused local components across all feature modules

---

## Dependencies & Execution Order

1. **Foundational Utilities & UI (Phase 1 & 2)**: MUST be completed first to provide the building blocks.
2. **User Story 1 (Phase 3)**: P1 Priority - Establish the layout shell.
3. **User Story 2 (Phase 4)**: P2 Priority - Refine component usage.
4. **User Story 3 (Phase 5)**: P3 Priority - Final formatting consistency.
5. **Polish (Phase 6)**: Final verification.

---

## Parallel Execution Examples

- **UI Refactoring**: T003, T004, T005, and T006 can be worked on simultaneously.
- **View Migration**: Once Phase 1 & 2 are done, T012 and T013 can be worked on in parallel.
