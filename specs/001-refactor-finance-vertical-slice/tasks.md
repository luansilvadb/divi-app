# Tasks: Refatoração do Módulo Finance para Fatiamento Vertical

**Input**: Design documents from `/specs/001-refactor-finance-vertical-slice/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md

## Implementation Strategy

- **Shared Domain First**: Centralize common entities and contracts in `src/shared/domain/` to prevent circular dependencies between modules.
- **Incremental Flat Migration**: Migrate sub-modules one by one to `src/modules/` root, keeping the legacy `finance` folder until the last step.
- **DI Tokens**: Use string tokens for DI registration in `src/core/di.ts` to fully decouple UI from infrastructure.
- **Clean Layers**: Ensure each module strictly follows the `domain` -> `application` -> `infrastructure` -> `ui` flow.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2)

---

## Phase 1: Setup (Shared Domain)

**Purpose**: Criar a base compartilhada para evitar acoplamento entre os novos módulos planos.

- [X] T001 [P] Create directory structure for `src/shared/domain/entities/` and `src/shared/domain/contracts/`
- [X] T002 [P] Move `Transaction`, `Wallet`, `Category` entities to `src/shared/domain/entities/`
- [X] T003 [P] Move `Budget`, `Goal`, `Loan`, `Subscription` entities to `src/shared/domain/entities/`
- [X] T004 [P] Define core financial contracts (Interfaces) in `src/shared/domain/contracts/`

---

## Phase 2: Foundational (DI & UI Templates)

**Purpose**: Configurar o mecanismo de injeção e templates de visualização.

- [X] T005 Update `src/core/di.ts` to support string token-based registration
- [X] T006 [P] Move generic finance components from `finance/ui/components` to `src/shared/components/`
- [X] T007 [P] Create standard page templates in `src/shared/components/templates/` per FR-009

---

## Phase 3: User Story 1 - Migração para Módulos Planos (P1)

**Story Goal**: Migrar todas as telas de finanças para módulos independentes na raiz de `src/modules/`.
**Independent Test**: Cada tela deve ser acessível via nova rota e funcional sem depender do diretório `src/modules/finance`.

### Sub-phase 3.1: Transactions & Auth
- [X] T008 [P] [US1] Create `transactions` module in `src/modules/transactions/` with Clean layers
- [X] T009 [P] [US1] Implement `ITransactionRepository` using Dexie/Supabase in `src/modules/transactions/infrastructure/`
- [X] T010 [P] [US1] Create `auth` module in `src/modules/auth/` for login and user profile logic
- [X] T011 [US1] Register `transactions` and `auth` dependencies in `src/core/di.ts`
- [X] T012 [US1] Update routing for Transactions and Login in `src/core/router/index.ts`

### Sub-phase 3.2: Budgets & Goals
- [X] T013 [P] [US1] Create `budgets` module in `src/modules/budgets/` with logic services
- [X] T014 [P] [US1] Implement `IBudgetRepository` in `src/modules/budgets/infrastructure/`
- [X] T015 [P] [US1] Create `goals` module in `src/modules/goals/` with progress tracking logic
- [X] T016 [US1] Register and update routing for Budgets and Goals

### Sub-phase 3.3: Loans & Subscriptions
- [X] T017 [P] [US1] Create `loans` module in `src/modules/loans/`
- [X] T018 [P] [US1] Create `subscriptions` module in `src/modules/subscriptions/`
- [X] T019 [US1] Register and update routing for Loans and Subscriptions

### Sub-phase 3.4: Analytics (Dashboard, Reports, Calendar, Activity Log)
- [X] T020 [P] [US1] Create `dashboard` module in `src/modules/dashboard/` as a cross-module aggregator
- [X] T021 [P] [US1] Create `reports` and `calendar` modules in `src/modules/`
- [X] T022 [P] [US1] Create `activity-log` module in `src/modules/activity-log/`
- [X] T023 [US1] Register and update routing for all analytics modules

---

## Phase 4: User Story 2 - Isolamento e Validação (P2)

**Story Goal**: Garantir que as fatias sejam independentes e testáveis.
**Independent Test**: Modificar implementação de infraestrutura de um módulo sem afetar o outro.

- [X] T024 [US2] Enforce cross-module communication ONLY via `application` services/stores or `domain` contracts
- [X] T025 [P] [US2] Implement unit tests for `UseCases` in `src/modules/*/application/useCases/`
- [X] T026 [P] [US2] Implement component tests for `Views` in `src/modules/*/ui/views/`
- [X] T027 [US2] Audit all modules to ensure NO direct imports from other modules' `infrastructure` or `ui` folders

---

## Phase 5: Polimento & Cleanup

**Purpose**: Remoção final do código legado e validação global.

- [X] T028 [P] Remove the legacy monolithic directory `src/modules/finance/`
- [X] T029 [P] Update all remaining relative imports to the new flat structure
- [X] T030 Final project build and lint check
- [X] T031 Run Playwright E2E tests to validate parity

---

## Dependencies & Execution Order

1. **Setup (Phase 1)**: Obrigatório antes de qualquer migração.
2. **Foundational (Phase 2)**: Necessário para que a UI migrada funcione corretamente.
3. **Core Migration (Phase 3)**: Pode ser feito de forma incremental. Módulos agregadores (Dashboard) devem vir por último.
4. **Validation (Phase 4)**: Ocorre em paralelo com a migração ou logo após cada fatia.
5. **Cleanup (Phase 5)**: Somente após 100% de paridade funcional confirmada.

## Parallel Execution Examples

- T008 (Transactions) and T010 (Auth) can be implemented simultaneously.
- T013 (Budgets) and T015 (Goals) are independent.
- Testing tasks (T025, T026) can run as soon as a module's application/ui layers are ready.
