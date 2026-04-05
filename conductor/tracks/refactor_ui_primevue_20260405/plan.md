# Implementation Plan - Refactor UI/UX to Exclusively Use PrimeVue

## Phase 1: Shared Components & Atoms
### Goal: Refactor shared components and atoms to use PrimeVue exclusively.
- [x] Task: Audit `src/shared/components/atoms/` and identify non-PrimeVue components. [checkpoint: audit_done]
    - Result: Most components already use PrimeVue. `BaseIconBox.vue` is custom and needs refactoring or replacement.
- [x] Task: Refactor `BaseButton.vue` to use PrimeVue Button (already using, but needs review/tests). [checkpoint: base_button_done] e26e1fc
    - [x] Write tests for `BaseButton.vue`.
    - [x] Implement `BaseButton.vue` using PrimeVue.
- [x] Task: Refactor `BaseInput.vue` to use PrimeVue InputText. [checkpoint: base_input_done] 132b00f
    - [x] Write tests for `BaseInput.vue`.
    - [x] Implement `BaseInput.vue` using PrimeVue.
- [ ] Task: Refactor `BaseSelect.vue` to use PrimeVue Select.
    - [ ] Write tests for `BaseSelect.vue`.
    - [ ] Implement `BaseSelect.vue` using PrimeVue.
- [ ] Task: Refactor `BaseBadge.vue`, `BaseCard.vue`, `BaseIconBox.vue`, `BaseProgressBar.vue`, `BaseSkeleton.vue`.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Shared Atoms' (Protocol in workflow.md)

## Phase 2: Core Layout & Navigation
### Goal: Refactor the main application layout and navigation components.
- [ ] Task: Refactor `MainLayout.vue` and `StandardPageLayout.vue`.
    - [ ] Write tests for layout responsiveness.
    - [ ] Implement layouts with PrimeVue and TailwindCSS.
- [ ] Task: Refactor `AppSidebar.vue`, `AppMobileDrawer.vue`, and `AppBottomBar.vue`.
    - [ ] Write tests for navigation flows.
    - [ ] Implement navigation components with PrimeVue.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Layout & Navigation' (Protocol in workflow.md)

## Phase 3: Module Refactoring (Transactions & Dashboard)
### Goal: Refactor the primary functional modules to use PrimeVue.
- [ ] Task: Refactor Transactions module components (List, Dialog, Form).
    - [ ] Write tests for Transaction management UI.
    - [ ] Implement Transactions UI using PrimeVue.
- [ ] Task: Refactor Dashboard module views and components (Charts, Summaries).
    - [ ] Write tests for Dashboard data display.
    - [ ] Implement Dashboard UI using PrimeVue.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Core Modules' (Protocol in workflow.md)

## Phase 4: Remaining Modules & Final Polish
### Goal: Complete the refactoring for all other modules and ensure quality.
- [ ] Task: Refactor Budgets, Goals, and Accounts modules.
- [ ] Task: Refactor secondary modules (Calendar, Activity Log, Subscriptions, Loans).
- [ ] Task: Final audit of UI component dependencies and removal of unused libraries.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Finalization' (Protocol in workflow.md)
