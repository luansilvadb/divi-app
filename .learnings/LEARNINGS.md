## [LRN-20250403-001] frontend

**Logged**: 2025-04-03T17:58:00Z
**Priority**: low
**Status**: resolved
**Area**: frontend

### Summary
Mobile optimization for Chart.js components in Vue 3.

### Details
Refactored the 'Evolução Patrimonial' chart to use `useIsMobile` for dynamic configuration. Increased tick font sizes (10px -> 11px), point radii (4px -> 5px/8px), and added a large `hitRadius` (20px) for touch ergonomics. Adjusted `DashboardView.vue` to remove card padding and increase chart height on mobile viewports.

### Suggested Action
Always use `computed` properties for `chartOptions` to allow responsive adjustments beyond what simple CSS can handle.

### Metadata
- Source: task
- Related Files: src/shared/components/organisms/PatrimonialChart.vue, src/modules/dashboard/ui/views/DashboardView.vue
- Tags: chartjs, mobile, ux, accessibility
---
