# Tasks: Divi Personal Finance App

**Input**: Design documents from `/specs/001-divi-finance-app/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

## Task Generation Rules

- **Vertical Slicing**: Tasks follow the `domain` -> `application` -> `infrastructure` -> `ui` flow within the `finance` module.
- **Story-Based**: Each phase (after setup) corresponds to a user story from the specification.
- **Independent Testing**: Each phase should result in a testable increment.

---

## Phase 1: Global Setup & Infrastructure

**Purpose**: Initializing core technologies and shared configurations.

- [x] T001 Initialize Supabase client and types in `src/core/supabase.ts`
- [x] T002 Configure `vite-plugin-pwa` with `injectManifest` strategy in `vite.config.ts`
- [x] T003 [P] Create Service Worker entry point in `src/sw.ts`
- [x] T004 Initialize Dexie.js database schema for offline storage in `src/core/db.ts`
- [x] T005 Implement global Dependency Injection (DI) container in `src/core/di.ts`
- [x] T006 [P] Create project structure for `src/modules/finance/` (domain, application, infrastructure, ui)

---

## Phase 2: Foundational Services (Auth & Shared UI)

**Purpose**: Core prerequisites for all user stories.

- [x] T007 Implement `IAuthService` contract in `src/modules/finance/domain/services/IAuthService.ts`
- [x] T008 Implement `SupabaseAuthService` in `src/modules/finance/infrastructure/services/SupabaseAuthService.ts`
- [x] T009 Register `AuthService` in `src/core/di.ts`
- [x] T010 [P] Create Atomic UI components (Button, Input, Card, Badge) in `src/shared/components/atoms/`
- [x] T011 [P] Create Layout components (Sidebar, Topbar) in `src/shared/components/organisms/`
- [x] T012 Configure core routing for all modules in `src/core/router/index.ts`

---

## Phase 3: User Story 2 - Transaction Management (Priority: P1)

**Purpose**: Core data entry and auto-categorization logic.

- [x] T013 [US2] Create `Transaction`, `Wallet`, and `Category` entities in `src/modules/finance/domain/entities/`
- [x] T014 [US2] Define Repository Interfaces (`ITransactionRepository`, `IWalletRepository`, `ICategoryRepository`) in `src/modules/finance/domain/repositories/`
- [x] T014.1 [US2] Define `IPayeeRepository` interface in `src/modules/finance/domain/repositories/IPayeeRepository.ts`
- [x] T015 [US2] Implement Repositories with offline-first logic (Dexie + Supabase) in `src/modules/finance/infrastructure/repositories/`
- [x] T015.1 [US2] Implement `PayeeRepository` in `src/modules/finance/infrastructure/repositories/PayeeRepository.ts`
- [x] T016 [US2] Create `FinanceStore` using Pinia in `src/modules/finance/application/stores/financeStore.ts`
- [x] T017 [US2] Implement `AutoCategorizationService` in `src/modules/finance/application/services/AutoCategorizationService.ts`
- [x] T018 [US2] [P] Create `TransactionForm` component in `src/modules/finance/ui/components/TransactionForm.vue`
- [x] T019 [US2] Create `TransactionsView` with monthly navigation in `src/modules/finance/ui/views/TransactionsView.vue`

**Independent Test**: Record a transaction with a title like "Netflix", verify it suggests the "Entertainment" category, and check if it persists in the monthly list.

---

## Phase 4: User Story 1 - Financial Health Dashboard (Priority: P1)

**Purpose**: Consolidated view of financial health.

- [x] T020 [US1] Implement `AccountCarousel` component in `src/modules/finance/ui/components/AccountCarousel.vue`
- [x] T021 [US1] [P] Implement `PatrimonialChart` using Chart.js in `src/modules/finance/ui/components/PatrimonialChart.vue`
- [x] T022 [US1] Create `DashboardView` aggregating account balance, active budgets, and recent transactions in `src/modules/finance/ui/views/DashboardView.vue`
- [x] T023 [US1] Implement "Near Future" and "Overdue" summary panels in `src/modules/finance/ui/components/SummaryPanels.vue`

**Independent Test**: Open the dashboard and verify that total balance, recent transaction list, and the patrimonial growth chart display accurate data from Phase 3.

---

## Phase 5: User Story 3 - Budgeting (50/30/20 Rule) (Priority: P2)

**Purpose**: Spending limits and daily cadence calculations.

- [x] T024 [US3] Create `Budget` entity and `IBudgetRepository` in `src/modules/finance/domain/`
- [x] T025 [US3] Implement `BudgetLogicService` for daily cadence calculation in `src/modules/finance/application/services/BudgetLogicService.ts`
- [x] T026 [US3] [P] Create `BudgetCard` with progress bar and cadence text in `src/modules/finance/ui/components/BudgetCard.vue`
- [x] T027 [US3] Create `BudgetsView` for managing and viewing budget history in `src/modules/finance/ui/views/BudgetsView.vue`

**Independent Test**: Create a budget of R$ 1000 for "Food", record a R$ 100 expense, and verify the card shows 10% consumption and an updated daily spending limit.

---

## Phase 6: User Story 4 - Goal Tracking (Priority: P2)

**Purpose**: Long-term saving and debt goals.

- [x] T028 [US4] Create `Goal` entity and `IGoalRepository` in `src/modules/finance/domain/`
- [x] T029 [US4] Implement `GoalLogicService` for progress and projections in `src/modules/finance/application/services/GoalLogicService.ts`
- [x] T030 [US4] [P] Create `GoalCard` with progress bar in `src/modules/finance/ui/components/GoalCard.vue`
- [x] T031 [US4] Create `GoalsView` in `src/modules/finance/ui/views/GoalsView.vue`

**Independent Test**: Create a goal of R$ 5000 for "Travel", link a transaction to it, and verify the progress percentage updates.

---

## Phase 7: User Stories 5 & 6 - Loans and Subscriptions (Priority: P3)

**Purpose**: Advanced tracking for debts and recurring bills with full Clean Arch layers.

- [x] T032 [US5] Create `Loan` entity and `ILoanRepository` in `src/modules/finance/domain/`
- [x] T032.1 [US5] Implement `LoanRepository` (Dexie/Supabase) in `src/modules/finance/infrastructure/repositories/LoanRepository.ts`
- [x] T032.2 [US5] Create `LoansView` and debt tracking logic in `src/modules/finance/ui/views/LoansView.vue`
- [x] T033 [US6] Create `Subscription` entity and `ISubscriptionRepository` in `src/modules/finance/domain/`
- [x] T033.1 [US6] Implement `SubscriptionRepository` in `src/modules/finance/infrastructure/repositories/SubscriptionRepository.ts`
- [x] T033.2 [US6] Create `SubscriptionsView` in `src/modules/finance/ui/views/SubscriptionsView.vue`
- [x] T034 [US6] Implement background sync logic for generating transactions from subscriptions in `src/sw.ts`

---

## Phase 8: Reporting, Calendar & Audit (FR-009, FR-010, FR-012)

**Purpose**: Visual reports, historical calendar and audit log.

- [x] T035 [P] Create `CalendarView` with monthly grid and activity markers in `src/modules/finance/ui/views/CalendarView.vue`
- [x] T036 [P] Create `ReportsView` with category breakdown donut chart in `src/modules/finance/ui/views/ReportsView.vue`
- [x] T037 [P] Create `ActivityLogView` for transaction auditing in `src/modules/finance/ui/views/ActivityLogView.vue`
- [x] T037.1 Implement `ActivityLogService` domain/application logic in `src/modules/finance/application/services/ActivityLogService.ts`

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Finalizing the PWA experience and extra tools.

- [x] T038 [P] Implement Theme management (Light/Dark/System) in `src/core/theme.ts`
- [x] T039 Implement `ExportService` for CSV generation in `src/modules/finance/application/services/ExportService.ts`
- [x] T040 Final PWA manifest optimization and offline asset precaching in `vite.config.ts`
- [x] T041 [P] Ensure responsive breakpoints (768px/1024px) are consistent across shared UI in `src/shared/styles/`

---

## Dependencies & Execution Order

1. **Setup (Phase 1 & 2)**: Foundations must be solid (DI, Supabase, Dexie).
2. **Transactions (Phase 3)**: Required to feed data into Dashboard, Budgets, and Reports.
3. **Dashboard (Phase 4)**: Consolidates data from Transactions and Budgets.
4. **Budgets & Goals (Phase 5 & 6)**: Independent but rely on the Finance Store.
5. **Loans & Subscriptions (Phase 7)**: Specialized modules dependent on core transaction logic.
6. **Reporting & Audit (Phase 8)**: Aggregates historical data across all modules.

## Parallel Execution Examples

- **UI Development**: T010, T011, T018, T020 can be developed in parallel with different mock data.
- **Infrastructure**: T001, T002, T004 can be configured simultaneously.
- **Domain**: T013, T024, T028 (Entities) can be defined independently.

## Implementation Strategy (MVP First)

The MVP consists of **Phase 1 through Phase 4**. Completing these phases provides a fully functional core: Authentication, Transaction tracking with auto-categorization, and a Financial Dashboard. Subsequent phases add specialized management tools (Budgets, Goals, etc.).
