# Tasks: Standardize UI Components based on Budgets screen

**Input**: Design documents from `/specs/003-standardize-design-system/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: N/A (Tests not explicitly requested in spec for this refactor)

**Organization**: Tasks follow the Vertical Slicing and Atomic Design structure.

---

## Phase 1: Setup & Foundational

**Purpose**: Configuração de tokens globais e utilitários de estilo baseados no "Santo Graal" (BudgetsView).

- [x] T001 Configure Design System tokens (Glassmorphism, hover-glow) in `src/core/styles/theme.css`
- [x] T002 [P] Add global Tailwind utility classes for Glassmorphism and View layouts in `src/core/styles/main.css`

---

## Phase 2: User Story 1 - Unified Visual Experience (Priority: P1)

**Purpose**: Extração e atualização de componentes atômicos para garantir consistência visual.

**Independent Test**: Navegação entre telas refatoradas mostra consistência total em cartões, botões e tipografia.

- [x] T003 [P] [US1] Update `src/shared/components/atoms/BaseCard.vue` to implement Glassmorphism and Hover Glow by default
- [x] T004 [P] [US1] Update `src/shared/components/atoms/BaseBadge.vue` to support flexible colors and "Holy Grail" sizing
- [x] T005 [P] [US1] Update `src/shared/components/atoms/BaseButton.vue` to support full-rounded variants and specialized shadows
- [x] T006 [P] [US1] Create `BaseProgressBar.vue` in `src/shared/components/atoms/` with shimmer and pulse animations
- [x] T007 [P] [US1] Create `BaseIconBox.vue` in `src/shared/components/atoms/` for tinted icon containers
- [x] T008 [US1] Refactor `src/modules/finance/ui/views/BudgetsView.vue` to use the updated shared components
- [x] T010 [US1] Refactor `src/modules/finance/ui/components/BudgetCard.vue` to use `BaseCard`, `BaseBadge`, and `BaseProgressBar`

---

## Phase 3: User Story 2 - Efficient Development with Reusable Components (Priority: P2)

**Purpose**: Criação de moléculas e organismos reutilizáveis para acelerar o desenvolvimento.

**Independent Test**: Criação de uma tela de "exemplo" usando apenas componentes de `src/shared/components` segue o Design System sem CSS customizado.

- [x] T011 [P] [US2] Create `BaseSummaryItem.vue` in `src/shared/components/molecules/` using `BaseIconBox`
- [x] T012 [P] [US2] Create `BaseViewHeader.vue` in `src/shared/components/organisms/` for standardized page headings
- [x] T013 [P] [US1] Refactor `src/modules/finance/ui/views/DashboardView.vue` using shared components
- [x] T014 [P] [US1] Refactor `src/modules/finance/ui/views/TransactionsView.vue` using shared components
- [x] T015 [P] [US1] Refactor `src/modules/finance/ui/views/GoalsView.vue` using shared components
- [x] T016 [P] [US1] Refactor `src/modules/finance/ui/views/LoansView.vue` using shared components

---

## Phase 4: User Story 3 - Seamless Navigation and Interaction (Priority: P3)

**Purpose**: Polimento de estados interativos e feedback visual.

**Independent Test**: Estados de hover e transições são idênticos em todos os cartões e botões da aplicação.

- [x] T017 [US3] Review and unify all interactive states (hover, active, focus) across the shared component library
- [x] T018 [US3] Implement consistent page entry animations (fade-in) for all feature views

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Auditoria final de responsividade, temas e qualidade.

- [x] T019 [P] Audit all screens for mobile responsiveness of the new shared components
- [x] T020 [P] Audit all screens for dark mode consistency and contrast accessibility
- [x] T021 [P] Final cleanup of redundant CSS styles in feature views (`src/modules/finance/ui/views/`)

---

## Dependencies & Execution Order

- **Phase 1 & 2**: MUST complete first to provide the building blocks.
- **Phase 3**: Depends on Phase 2 components.
- **Phase 4 & 5**: Final polish after implementation.

## Parallel Execution Examples

- **Atoms**: T003, T004, T005, T006, T007 can be implemented simultaneously.
- **Refactoring Views**: T013, T014, T015, T016 can be done in parallel once shared components are ready.
