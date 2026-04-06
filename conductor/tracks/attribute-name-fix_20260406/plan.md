# Implementation Plan: Fix Malformed Attribute Error in Search Empty States

## Phase 1: BudgetsView.vue Refactor
- [x] Task: Write Tests for BudgetsView search empty state [0555582]
    - [x] Create `src/modules/budgets/ui/views/__tests__/BudgetsView.spec.ts` (if it doesn't exist)
    - [x] Add unit tests for the new computed property (e.g., `searchEmptySubtitle`)
- [x] Task: Implement computed property in BudgetsView.vue [0555582]
    - [x] Define `searchEmptySubtitle` computed property in the script section
    - [x] Update the template to use `:empty-subtitle="searchEmptySubtitle"`
- [ ] Task: Conductor - User Manual Verification 'Phase 1' (Protocol in workflow.md)

## Phase 2: GoalsView.vue Refactor
- [ ] Task: Write Tests for GoalsView search empty state
    - [ ] Create `src/modules/goals/ui/views/__tests__/GoalsView.spec.ts`
    - [ ] Add unit tests for the `searchEmptySubtitle` computed property
- [ ] Task: Implement computed property in GoalsView.vue
    - [ ] Define `searchEmptySubtitle` computed property
    - [ ] Update template to use the new computed property
- [ ] Task: Conductor - User Manual Verification 'Phase 2' (Protocol in workflow.md)

## Phase 3: LoansView.vue Refactor
- [ ] Task: Write Tests for LoansView search empty state
    - [ ] Create `src/modules/loans/ui/views/__tests__/LoansView.spec.ts`
    - [ ] Add unit tests for the `searchEmptySubtitle` computed property
- [ ] Task: Implement computed property in LoansView.vue
    - [ ] Define `searchEmptySubtitle` computed property
    - [ ] Update template to use the new computed property
- [ ] Task: Conductor - User Manual Verification 'Phase 3' (Protocol in workflow.md)

## Phase 4: SubscriptionsView.vue Refactor
- [ ] Task: Write Tests for SubscriptionsView search empty state
    - [ ] Create `src/modules/subscriptions/ui/views/__tests__/SubscriptionsView.spec.ts`
    - [ ] Add unit tests for the `searchEmptySubtitle` computed property
- [ ] Task: Implement computed property in SubscriptionsView.vue
    - [ ] Define `searchEmptySubtitle` computed property
    - [ ] Update template to use the new computed property
- [ ] Task: Conductor - User Manual Verification 'Phase 4' (Protocol in workflow.md)
