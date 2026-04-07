# CURRENT_SPRINT: Sprint 1 (v0.2.0)
**Goal:** Connect the Dashboard to real data from Pinia stores and implement historical balance visualization.

---

## Kanban Board

### [ ] Implementation Tasks (Tech Lead)
- [ ] Implement Historical Balance calculation logic in `dashboardStore.ts`.
- [ ] Update `DashboardView.vue` to use real data for Income, Expense, and Balance cards.
- [ ] Connect `PatrimonialChart.vue` to dynamic data from `dashboardStore`.
- [ ] Implement empty state for the chart when no transactions exist.
- [ ] Refine `AccountCarousel.vue` with dynamic wallet data from `dashboardStore`.

---

## Technical Guidelines
- **Store Source of Truth:** All data for the dashboard must come from `dashboardStore` or `transactionStore`.
- **Formatting:** Use `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })` for currency.
- **Modularity:** Ensure chart and carousel logic remain decoupled from the view as much as possible.
