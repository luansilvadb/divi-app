# Research: UI Standardization (Holy Grail Patterns)

## Decision: Centralized UI Strategy

The application will adopt the visual patterns found in `src/modules/finance/ui/views/BudgetsView.vue` as the global standard. This will be achieved through a combination of shared layout classes, centralized formatting utilities, and refactoring atomic components into the `shared/` directory.

### Rationale:
- **Consistency**: Ensures a single "source of truth" for the UI/UX.
- **Maintainability**: Changes to the design system (e.g., border-radius, primary colors) only need to be made in one place.
- **Velocity**: Developers can build new screens faster by using pre-defined layout blocks.

## Findings

### 1. Layout Pattern
All feature views MUST follow this structure:
```vue
<template>
  <div class="view-wrapper animate-fade-in">
    <BaseBackgroundOrbs />
    <BaseViewHeader title="..." highlight="..." subtitle="...">
      <template #action><!-- Optional CTA --></template>
    </BaseViewHeader>
    <div class="view-content-grid">
      <main class="main-column"><!-- Main content --></main>
      <aside class="side-column"><!-- Sidebar/Summary panels --></aside>
    </div>
  </div>
</template>
```

### 2. Centralized Utilities
Formatting logic found in views should move to `src/shared/utils/formatters.ts`:
- `formatCurrency(value: number)`
- `formatCurrencySign(value: number)`
- `formatDate(dateStr: string)`
- `formatDateShort(dateStr: string)`

### 3. Shared Components Migration
The following components should be reviewed and potentially improved in `src/shared/components`:
- `BaseSummaryItem.vue`: Ensure it supports different statuses (success, error, warning) consistently.
- `BaseProgressBar.vue`: Standardize height and border-radius.
- `BaseCard.vue`: Standardize header and footer padding.

## Alternatives Considered
- **CSS Framework-only (Tailwind)**: Rejected because it leads to "class soup" and duplication across views. Shared Vue components provide better abstraction.
- **Global Stylesheet**: Rejected in favor of Tailwind + CSS Variables + Shared Components to maintain modularity.
