# Quickstart: UI Standardization Refactor

## Prerequisites
- Familiarity with the `BudgetsView.vue` implementation.
- Knowledge of Atomic Design (Atoms, Molecules, Organisms).
- Tailwind CSS experience.

## Steps to Implement Consistency in a New View

1.  **Wrap the Template**:
    Ensure the main view uses `<div class="view-wrapper animate-fade-in">`.
2.  **Add Background Orbs**:
    Add `<BaseBackgroundOrbs />` as the first child of the view wrapper.
3.  **Setup Header**:
    Use `<BaseViewHeader />` with `title`, `highlight`, and `subtitle` props.
4.  **Define Content Grid**:
    Use `<div class="view-content-grid">` with `<main class="main-column">` and `<aside class="side-column">`.
5.  **Refactor Components**:
    Replace local UI blocks with `BaseCard`, `BaseSummaryItem`, and `BaseProgressBar`.
6.  **Centralize Formatting**:
    Use shared utilities for currency and date display.
7.  **Verify Dark Mode**:
    Check the view with the `.dark` class to ensure all components and text remain readable.
