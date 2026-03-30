# Research: Standardize UI Components based on Budgets screen

## Decision: Extract "Holy Grail" Patterns into Shared Atomic Components

### Rationale
The "Budgets" screen (`BudgetsView.vue`) and its related components (like `BudgetCard.vue`) contain the most polished and mature UI/UX patterns in the application, referred to by the user as the "Holy Grail". To ensure consistency and reduce code duplication, these patterns should be extracted into the `src/shared/components` library following Atomic Design principles.

### Key Patterns Identified

| Pattern | Description | Implementation Detail |
|---------|-------------|-----------------------|
| **Glassmorphism Card** | The core container style for all sections. | `bg-white/75 backdrop-blur-lg border-white/40 shadow-sm rounded-2xl` |
| **Hover Glow** | Interactive feedback for cards. | `hover:border-primary-main/30 hover:shadow-md hover:-translate-y-0.5 transition-all` |
| **Icon Box** | A rounded container for icons with a tinted background. | `w-10 h-10 rounded-xl flex items-center justify-center` |
| **Progress Track** | Standardized bar for showing limits/completion. | `h-2.5 bg-black/5 rounded-full overflow-hidden` |
| **Summary Item** | Layout for showing a label, value, and icon in a row. | Flex layout with specific typography for labels (uppercase, tracked) and values (bold, large). |

### Component Extraction Plan

1.  **Atoms**:
    *   `BaseBadge.vue`: Standardized badge for status/types.
    *   `BaseProgressBar.vue`: Reusable progress bar with "shimmer" and "pulse" animations.
    *   `BaseIconBox.vue`: Component for the tinted icon containers.
2.  **Molecules**:
    *   `BaseSummaryItem.vue`: Combines `BaseIconBox` with label/value typography.
3.  **Organisms**:
    *   `BaseViewHeader.vue`: Standardizes the page title and primary action area.

### Refactoring Strategy
1.  Implement the new shared components in `src/shared/components`.
2.  Update `BudgetsView.vue` and `BudgetCard.vue` to use these new shared components (Verifying the "Source of Truth" remains identical).
3.  Incrementally update other views (`DashboardView.vue`, `TransactionsView.vue`, etc.) to replace custom styles with shared components.

## Technical Unknowns Resolved

| Unknown | Decision | Rationale |
|---------|----------|-----------|
| **CSS Implementation** | Use Tailwind classes + CSS Variables | Already established in `GEMINI.md` and provides best flexibility for theme support. |
| **Animation Library** | Vanilla CSS Keyframes | Keeps the bundle small and matches the existing `animate-fade-in` pattern. |
| **Component Props** | Highly flexible/Generic | To support the "50/30/20" specific colors while allowing other features to use their own palettes. |

## Alternatives Considered

1.  **Copy-pasting styles**: Rejected. Leads to maintenance nightmare and inconsistency.
2.  **Using a 3rd party UI Library**: Rejected. The user specifically asked to use the existing "Budgets" screen as the reference, which has a custom "Holy Grail" look that might be hard to replicate perfectly with a library like Vuetify or PrimeVue without heavy customization.
