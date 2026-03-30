# Feature Specification: Standardize UI Design System

**Feature Branch**: `004-standardize-ui-consistency`  
**Created**: 2026-03-29  
**Status**: Draft  
**Input**: User description: "quero que a tela de orçamentos segue referência e fonte da verdade como design system, atualmente ela está perfeita, quero que as outras telas segue o mesmo design system dado ao tela de orçamentos, a tela de orçamentos é o santo graal da ui/ux desenvolvida para esse projeto, para isso ocorrer precisamos organizar o projeto para seja componentes reutilizados para outras telas."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Consistent Layout & Visual Identity (Priority: P1)

As a user, I want every screen in the application to follow the same layout and visual style so that I have a predictable and professional experience across all features.

**Why this priority**: Consistency is the foundation of a good UI/UX. Using the "Budgets" screen as a reference ensures that all parts of the app feel like a single, cohesive product.

**Independent Test**: Can be tested by navigating between different views (Transactions, Dashboard, Loans, etc.) and verifying that the header, background, spacing, and card styles are identical to the Budgets screen.

**Acceptance Scenarios**:

1. **Given** I am on the Dashboard or Transactions view, **When** I compare it to the Budgets view, **Then** I should see the same `BaseBackgroundOrbs`, `BaseViewHeader`, and `view-content-grid` layout (main/side columns).
2. **Given** I am on any screen, **When** I look at the components (cards, buttons, badges), **Then** they should use the same colors, border-radii, and hover effects defined in the design system.

---

### User Story 2 - Reusable Financial Components (Priority: P2)

As a developer, I want to use standardized components for common financial UI patterns (summary items, progress bars, icon boxes) so that I can implement new screens faster and maintain consistency easily.

**Why this priority**: Reduces code duplication and ensures that a change in a base component (like `BaseSummaryItem`) reflects across the entire application.

**Independent Test**: Can be tested by modifying a shared component (e.g., changing the font size of `BaseSummaryItem`) and verifying that it updates correctly in all views that use it (Dashboard, Transactions, Budgets).

**Acceptance Scenarios**:

1. **Given** a new feature is being developed, **When** I need to display a monthly total or a category breakdown, **Then** I should be able to use existing components from `src/shared/components` without writing custom CSS for these elements.

---

### User Story 3 - Unified Data Formatting (Priority: P3)

As a user, I want to see currency and dates formatted consistently across all screens so that the data is easy to read and understand.

**Why this priority**: Prevents confusion caused by different currency formats (e.g., `R$ 1.000,00` vs `1000`) or date formats.

**Independent Test**: Can be tested by checking the currency display on the Dashboard, Transactions, and Budgets screens to ensure they all use the same `pt-BR` / `BRL` format.

**Acceptance Scenarios**:

1. **Given** any screen displaying money, **When** a value is shown, **Then** it must always include the `R$` prefix and follow the Brazilian decimal/thousands separator convention.

---

### Edge Cases

- **Screen Responsiveness**: Side column moves below main column on small screens (max-width: 1100px).
- **Empty States**: Screens should follow the same pattern (icon + title + description + CTA) as the Budgets screen when no data is available.
- **Dark Mode**: All shared components must correctly implementing dark mode transitions and colors using the `.dark` class.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a set of shared components in `src/shared/components` that encapsulate the "Holy Grail" design (from Budgets screen).
- **FR-002**: System MUST use a centralized layout pattern (`view-wrapper`, `view-content-grid`, `main-column`, `side-column`) for all feature views.
- **FR-003**: System MUST centralize data formatting logic (currency, dates) into shared utilities (e.g., `src/shared/utils/formatters.ts`) or composables to avoid duplication.
- **FR-004**: System MUST ensure all screens use the `BaseBackgroundOrbs` and `BaseViewHeader` components consistently.
- **FR-005**: System MUST migrate existing views (Dashboard, Transactions, Loans, Goals, etc.) to use the refactored shared components and layout.

### Key Entities *(include if feature involves data)*

- **UI Theme**: Centralized set of CSS variables and Tailwind classes defining the visual identity.
- **Shared Components**: Atoms, Molecules, and Organisms (Atomic Design) that compose the UI.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of main views (Dashboard, Transactions, Budgets, Loans, Goals) follow the identical layout structure.
- **SC-002**: No duplicated "currency formatting" code remains in feature-specific views.
- **SC-003**: All views achieve a visual match with the Budgets screen in terms of spacing, typography, and color tokens.
- **SC-004**: Total lines of CSS in feature views are reduced by at least 20% by moving styles to shared components.

## Assumptions

- **Budget Screen as Source of Truth**: The current implementation of `BudgetsView.vue` and its related components is considered the final desired aesthetic ("Holy Grail").
- **Atomic Design**: The project follows Atomic Design principles in `src/shared/components`.
- **Tailwind CSS**: Tailwind is the primary tool for layout and spacing.
- **Project Structure**: Vertical slicing is maintained, but UI components are shared when generic.
