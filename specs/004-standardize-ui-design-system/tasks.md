# Tasks: Standardize UI & Design System

**Input**: Design documents from `specs/004-standardize-ui-design-system/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

## Implementation Strategy
A implementação seguirá uma abordagem incremental, focando primeiro na infraestrutura global de estilos e componentes compartilhados (Foundational), para então refatorar cada visualização (US1) de forma independente. As melhorias de feedback visual e polimento (US2, US3) serão aplicadas transversalmente após a estrutura base estar consolidada.

---

## Phase 1: Setup & Global Styles

**Purpose**: Estabelecer a base de CSS e tokens de design para todo o sistema.

- [X] T001 Centralizar classes de layout global (`.view-wrapper`, `.view-content-grid`, `.main-column`, `.side-column`) em `src/core/styles/main.css`
- [X] T002 [P] Mapear cores semânticas e configurar transição global de 300ms em `src/core/styles/theme.css` (FR-012)

---

## Phase 2: Foundational UI Components (Shared)

**Purpose**: Atualizar os componentes de `src/shared/` para servirem como base para todas as views.

- [X] T003 [P] Atualizar `BaseViewHeader.vue` para suportar as props `subtitle` e `highlight` em `src/shared/components/organisms/BaseViewHeader.vue`
- [X] T004 [P] Refatorar `BaseCard.vue` para suportar glassmorphism, slots de header/footer, estados de erro inline (FR-009) e acessibilidade por teclado (FR-011) em `src/shared/components/atoms/BaseCard.vue`
- [X] T005 [P] Atualizar `BaseSummaryItem.vue` para aceitar status semânticos, cores de tokens e estados de erro inline (FR-009) em `src/shared/components/molecules/BaseSummaryItem.vue`
- [X] T006 [P] Garantir posicionamento consistente de `BaseBackgroundOrbs.vue` em `src/shared/components/atoms/BaseBackgroundOrbs.vue`
- [X] T007 [P] Padronizar estilização de `BaseIconBox.vue` com cores de fundo translúcidas em `src/shared/components/atoms/BaseIconBox.vue`
- [X] T007b [P] Criar componente `BaseSkeleton.vue` (shimmer effect) para animações de carregamento inicial em `src/shared/components/atoms/BaseSkeleton.vue` (FR-010)

---

## Phase 3: [US1] Dashboard View Refactoring (Priority P1)

**Story Goal**: Aplicar o padrão "Santo Graal" na Dashboard principal.

- [X] T008 [US1] Implementar estrutura de layout `view-content-grid` em `src/modules/finance/ui/views/DashboardView.vue`
- [X] T009 [US1] Substituir componentes locais por `BaseCard` e `BaseSummaryItem` em `src/modules/finance/ui/views/DashboardView.vue`
- [X] T010 [US1] Remover todos os estilos `<style scoped>` e classes locais de layout em `src/modules/finance/ui/views/DashboardView.vue`

**Independent Test**: Navegar entre a Dashboard e a tela de Orçamentos; o cabeçalho, fundo e estrutura de colunas devem ser visualmente idênticos.

---

## Phase 4: [US1] Goals View Refactoring (Priority P1)

**Story Goal**: Padronizar a visualização de Metas.

- [X] T011 [US1] Migrar `GoalsView.vue` para o padrão de layout de duas colunas em `src/modules/finance/ui/views/GoalsView.vue`
- [X] T012 [US1] Refatorar `GoalCard.vue` para herdar estilos de `BaseCard` e usar tokens semânticos em `src/modules/finance/ui/components/GoalCard.vue`

**Independent Test**: Verificar se os cards de metas possuem o mesmo efeito de vidro e espaçamento que os cards de orçamentos.

---

## Phase 5: [US1] Loans & Subscriptions Refactoring (Priority P1)

**Story Goal**: Finalizar a padronização das views de Empréstimos e Assinaturas.

- [X] T013 [US1] Aplicar layout `view-content-grid` e `BaseViewHeader` em `src/modules/finance/ui/views/LoansView.vue`
- [X] T014 [US1] Aplicar layout `view-content-grid` e `BaseViewHeader` em `src/modules/finance/ui/views/SubscriptionsView.vue`

**Independent Test**: Confirmar a paridade visual total (bordas, sombras, fontes) nestas telas em relação à tela de Orçamentos.

---

## Phase 6: [US2] Layout Component Reuse & Empty States (Priority P2)

**Story Goal**: Garantir que estados vazios e componentes de layout sejam reutilizados globalmente.

- [X] T015 [US2] Implementar componente ou padrão de `Empty State` baseado em `BudgetsView` em `src/shared/components/atoms/BaseCard.vue`
- [X] T016 [US2] Padronizar `BaseProgressBar.vue` para utilizar estritamente tokens de cor semântica em `src/shared/components/atoms/BaseProgressBar.vue`

**Independent Test**: Simular uma lista vazia em Metas e verificar se o visual segue o padrão centralizado de Orçamentos.

---

## Phase 7: [US3] Visual Feedback & Interactivity (Priority P3)

**Story Goal**: Unificar o comportamento de badges e estados interativos.

- [X] T017 [US3] Padronizar `BaseBadge.vue` para usar as cores semânticas (`success`, `error`, etc.) em `src/shared/components/atoms/BaseBadge.vue`
- [X] T018 [US3] Atualizar estilo visual de `TransactionItem.vue` para consistência com o novo design em `src/modules/finance/ui/components/TransactionItem.vue`

**Independent Test**: Verificar se o badge de "estouro" em Orçamentos é idêntico ao badge de "alerta" em outras telas.

---

## Final Phase: Polish & Cross-Cutting Concerns

**Purpose**: Ajustes finos de UX e validação final.

- [X] T019 [P] Auditar todas as views para garantir Gaps de `1.5rem` e Radii de `20px` consistentes
- [X] T020 [P] Validar acessibilidade (navegação por teclado) e contraste em Dark Mode em `src/core/theme/themeManager.ts`

---

## Dependencies & Execution Order

1. **Foundational First**: T001 até T007 devem ser concluídos antes das refatorações de Views.
2. **View Migration (US1)**: As fases 3, 4 e 5 podem ocorrer em qualquer ordem ou em paralelo após a Phase 2.
3. **Refinement (US2, US3)**: Devem ser as últimas a serem aplicadas para garantir que todos os componentes já estejam nos novos layouts.

## Parallel Execution Examples

- **Shared Components**: T003, T004, T005, T006 e T007 podem ser feitos simultaneamente.
- **Independent Views**: T008 (Dashboard), T011 (Goals) e T013 (Loans) não possuem dependências entre si.
