# Implementation Plan: UI/UX Refactor to PrimeVue Exclusive

## Phase 1: Core Setup & Shared Components
Establish the foundation for PrimeVue integration with Tailwind and migrate base atomic components.

- [ ] Task: Install PrimeVue and Configure Unstyled Mode/Tailwind Integration
- [ ] Task: Define Global PrimeVue Theme and Passthrough Configuration
- [ ] Task: Implement `BaseButton` (PrimeVue `Button`) and its variants
- [ ] Task: Implement `BaseInput` and `BaseSelect` (PrimeVue `InputText`, `Select`)
- [ ] Task: Implement `BaseCard`, `BaseBadge`, and `BaseProgressBar` (PrimeVue `Card`, `Badge`, `ProgressBar`)
- [ ] Task: Conductor - User Manual Verification 'Core Setup & Shared Components' (Protocol in workflow.md)

## Phase 2: Layout & Navigation Migration
Migrate the main app structure to use PrimeVue for a unified user experience.

- [ ] Task: Refactor `AppSidebar` to use PrimeVue `Sidebar` or `Drawer`
- [ ] Task: Refactor `AppBottomBar` and `AppMobileDrawer`
- [ ] Task: Update `MainLayout` and `StandardPageLayout` to support new PrimeVue components
- [ ] Task: Conductor - User Manual Verification 'Layout & Navigation Migration' (Protocol in workflow.md)

## Phase 3: Dashboard & Visualization Migration
Update the central hub with modern, performant PrimeVue components.

- [ ] Task: Refactor `DashboardView` components (Cards, Summary Panels)
- [ ] Task: Integrate/Refactor `PatrimonialChart` and other visual elements using PrimeVue
- [ ] Task: Update Activity Log module UI to PrimeVue
- [ ] Task: Conductor - User Manual Verification 'Dashboard & Visualization Migration' (Protocol in workflow.md)

## Phase 4: Core Modules Migration (Incremental)
Migrate the primary functional modules, starting with Transactions and Auth.

- [ ] Task: Refactor `Auth` module views and components
- [ ] Task: Refactor `Transactions` module (Forms, Dialogs, Tables)
- [ ] Task: Refactor `Budgets` and `Goals` modules
- [ ] Task: Conductor - User Manual Verification 'Core Modules Migration' (Protocol in workflow.md)

## Phase 5: Secondary Modules & Final Polish
Complete the migration of remaining modules and ensure overall consistency.

- [ ] Task: Refactor `Loans`, `Subscriptions`, and `Reports` modules
- [ ] Task: Final design audit and CSS variable cleanup
- [ ] Task: Verify overall performance improvements and accessibility (A11y)
- [ ] Task: Conductor - User Manual Verification 'Secondary Modules & Final Polish' (Protocol in workflow.md)
