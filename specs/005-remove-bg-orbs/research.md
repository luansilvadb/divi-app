# Research: Background Orbs Removal

**Date**: 2026-03-29
**Feature**: Remove Background Orbs Effect

## Decision: Global Removal Strategy

### Primary Decision
The removal will be executed in two steps to ensure safety and maintainability:
1.  **Immediate Global Effect**: Empty the `<template>` of `src/shared/components/atoms/BaseBackgroundOrbs.vue`. This instantly removes the visual effect from all screens without breaking imports.
2.  **Code Cleanup**: Systematically remove the `<BaseBackgroundOrbs />` tags and corresponding imports from all views to keep the codebase clean.

### Rationale
-   **Safety**: Emptying the template first prevents build errors if we miss any file during the manual cleanup.
-   **Performance**: Removing the DOM elements and CSS animations reduces browser workload (though minimal, it's a positive side effect).
-   **Clarity**: Removing unused code (imports) is a standard development practice.

## Findings

### Usage Analysis
The component `BaseBackgroundOrbs.vue` is used in the following 8 views:
1.  `src/modules/finance/ui/views/SubscriptionsView.vue`
2.  `src/modules/finance/ui/views/ReportsView.vue`
3.  `src/modules/finance/ui/views/LoansView.vue`
4.  `src/modules/finance/ui/views/GoalsView.vue`
5.  `src/modules/finance/ui/views/DashboardView.vue`
6.  `src/modules/finance/ui/views/CalendarView.vue`
7.  `src/modules/finance/ui/views/BudgetsView.vue`
8.  `src/modules/finance/ui/views/ActivityLogView.vue`

### Component Structure
-   Uses CSS variables for orb colors (`--color-primary-main`, etc.).
-   Uses CSS animations for the floating effect.
-   Scoped styles ensure that removing the HTML will also effectively stop the animation and rendering logic.

## Alternatives Considered

### 1. Delete the component file entirely
-   **Rejected because**: This would cause immediate build errors in all 8 files where it's imported. The "empty template" approach is safer for a multi-file cleanup.

### 2. Disable via CSS (opacity: 0)
-   **Rejected because**: The elements would still exist in the DOM and the animations might still run, consuming unnecessary resources.

## Implementation Details
-   The template should be replaced with `<!-- Efeito removido globalmente -->` to maintain a visual marker for developers.
-   All 8 identified views will have their `<BaseBackgroundOrbs />` usage and `import BaseBackgroundOrbs ...` lines removed.
