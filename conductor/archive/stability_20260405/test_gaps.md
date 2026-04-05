# Test Coverage Gaps - Track: stability_20260405

## Overview
Current overall line coverage is **24.88%**, significantly below the **80%** requirement. The following areas are high-priority for test development.

## High Priority Gaps (0% Coverage)

### Core Views
- `src/modules/dashboard/ui/views/DashboardView.vue`
- `src/modules/budgets/ui/views/BudgetsView.vue`
- `src/modules/goals/ui/views/GoalsView.vue`
- `src/modules/activity-log/ui/views/ActivityLogView.vue`
- `src/modules/calendar/ui/views/CalendarView.vue`
- `src/modules/reports/ui/views/ReportsView.vue`

### Organisms & Molecules
- `src/shared/components/organisms/PatrimonialChart.vue`
- `src/shared/components/organisms/AccountCarousel.vue`
- `src/shared/components/organisms/BaseViewHeader.vue`
- `src/shared/components/molecules/BudgetCard.vue`
- `src/shared/components/molecules/GoalCard.vue`

### Application Stores
- `src/modules/budgets/application/stores/budgetStore.ts`
- `src/modules/dashboard/application/stores/dashboardStore.ts`
- `src/modules/goals/application/stores/goalStore.ts`

### Utilities
- `src/shared/utils/formatters.ts`
- `src/shared/utils/performance.ts`

## Action Plan
1.  **Phase 2/3/4:** Ensure every bug fix is accompanied by tests that contribute to closing these gaps.
2.  **Phase 5:** Dedicated effort to reach the 80% threshold.
