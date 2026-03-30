# Quickstart: Remove Background Orbs

**Feature**: Remove Background Orbs Effect

## Verification Steps

### 1. Pre-Implementation Check
-   Run the app: `npm run dev`
-   Navigate to `DashboardView.vue` and `BudgetsView.vue`.
-   Confirm that the floating gradient orbs are visible in the background.

### 2. Implementation Phase
-   Edit `src/shared/components/atoms/BaseBackgroundOrbs.vue` and replace the template with `<!-- Efeito removido globalmente -->`.
-   Verify that the orbs are gone on **all** screens immediately.

### 3. Cleanup Phase
-   Remove the `<BaseBackgroundOrbs />` tag and the `import BaseBackgroundOrbs ...` line from each of the 8 identified views.
-   Search for any remaining references using `rg BaseBackgroundOrbs src`.

### 4. Post-Implementation Check
-   Verify that the application still builds without errors: `npm run build`.
-   Confirm that the background remains clean and consistent across all views.
-   Ensure no console errors appear in the browser's developer tools.

## Key Files to Modify
-   `src/shared/components/atoms/BaseBackgroundOrbs.vue`
-   `src/modules/finance/ui/views/SubscriptionsView.vue`
-   `src/modules/finance/ui/views/ReportsView.vue`
-   `src/modules/finance/ui/views/LoansView.vue`
-   `src/modules/finance/ui/views/GoalsView.vue`
-   `src/modules/finance/ui/views/DashboardView.vue`
-   `src/modules/finance/ui/views/CalendarView.vue`
-   `src/modules/finance/ui/views/BudgetsView.vue`
-   `src/modules/finance/ui/views/ActivityLogView.vue`
