# Specification: Fix malformed attribute error in Search Empty States

## Overview
A compiler error occurs in several views (`BudgetsView`, `GoalsView`, `LoansView`, `SubscriptionsView`) because of an invalid attribute name/value structure in the template. Specifically, the `:empty-subtitle` attribute in `BaseCard` uses escaped double quotes within a backtick string, which confuses the `vite-plugin-vue-inspector`.

## Functional Requirements
- Remove complex string interpolation from the templates of the affected views.
- Implement a computed property in each affected view to handle the "No search results" message.
- Ensure the search empty state displays the correct message including the search query.

## Affected Files
- `src/modules/budgets/ui/views/BudgetsView.vue`
- `src/modules/goals/ui/views/GoalsView.vue`
- `src/modules/loans/ui/views/LoansView.vue`
- `src/modules/subscriptions/ui/views/SubscriptionsView.vue`

## Non-Functional Requirements
- Maintain existing UI behavior and styling.
- Improve template readability and maintainability by moving logic to the script section.

## Acceptance Criteria
- [ ] The application builds and runs without `Internal server error` in Vite.
- [ ] Users can navigate to Budgets, Goals, Loans, and Subscriptions views without 500 errors.
- [ ] When a search returns no results, the empty state displays: "Não encontramos [items] para "[query]"" correctly.
- [ ] Unit tests are added to verify the computed properties in each view.

## Out of Scope
- Refactoring the `BaseCard` component itself.
- Changing the search logic or store implementations.
