# Implementation Plan: Search System Harmonization

## Phase 1: Component Refinement

- [x] **Step 1.1: Design Alignment**
  - [x] Modify `src/shared/components/molecules/BaseSearchInput.vue`.
  - [x] Replace hardcoded `emerald-400` with the project's primary or secondary colors (`primary.500`, `secondary.main`, etc.).
  - [x] Align border radius and focus ring with the `DiviPreset`.
- [x] **Step 1.2: Functional Improvements**
  - [x] Add `debounce` property to `BaseSearchInput.vue`.
  - [x] Implement debouncing logic for the `update:modelValue` emit.
  - [x] Add a `loading` prop and display a spinner or loading icon when active.

## Phase 2: Implementation Across Modules

- [x] **Step 2.1: Budgets Search Integration**
  - [x] Add search query state to `budgetStore`.
  - [x] Implement filtered computed property in `BudgetsView.vue`.
  - [x] Add `BaseSearchInput` to `BudgetsView.vue`.
- [x] **Step 2.2: Goals Search Integration**
  - [x] Add search query state to `goalStore`.
  - [x] Implement filtered computed property in `GoalsView.vue`.
  - [x] Add `BaseSearchInput` to `GoalsView.vue`.
- [x] **Step 2.3: Loans Search Integration**
  - [x] Add search query state to `loanStore`.
  - [x] Implement filtered computed property in `LoansView.vue`.
  - [x] Add `BaseSearchInput` to `LoansView.vue`.
- [x] **Step 2.4: Subscriptions Search Integration**
  - [x] Add search query state to `subscriptionStore`.
  - [x] Implement filtered computed property in `SubscriptionsView.vue`.
  - [x] Add `BaseSearchInput` to `SubscriptionsView.vue`.

## Phase 3: Validation & Testing

- [x] **Step 3.1: Unit Tests**
  - [x] Create or update unit tests for `BaseSearchInput.vue` to verify debouncing and loading states.
- [x] **Step 3.2: E2E Tests**
  - [x] Add a Playwright test case to verify search functionality in one of the new modules (e.g., Budgets).
