# Implementation Plan - Standardize UI & Design System

**Feature Branch**: `004-standardize-ui-design-system`  
**Created**: 2026-03-29  
**Status**: Draft  
**Reference**: [specs/004-standardize-ui-design-system/spec.md]

## Technical Context

### Architecture & Stack
- **Framework**: Vue 3 (Composition API) com TypeScript (Strict Mode).
- **Styling**: Tailwind CSS + CSS Variables para Design Tokens.
- **Components**: Atomic Design (Atoms, Molecules, Organisms) em `src/shared/`.
- **Layout**: Grid system padronizado (`view-content-grid`, `main-column`, `side-column`).

### Implementation Strategy
1. **Extração de Padrões**: Identificar classes e estruturas de layout em `BudgetsView.vue` que devem se tornar globais.
2. **Componentização**: Refatorar componentes existentes em `src/shared/` para suportar o "Santo Graal".
3. **Padronização de Views**: Aplicar a nova estrutura de layout e componentes em `DashboardView.vue`, `GoalsView.vue`, `LoansView.vue` e `SubscriptionsView.vue`.
4. **Eliminação de CSS Scoped**: Migrar estilos específicos de views para classes utilitárias ou componentes compartilhados.

## Constitution Check

| Principle | Impact & Handling |
|-----------|-------------------|
| I. Vertical Slicing | As views específicas de cada módulo continuam em `src/modules/*/ui/views/`, mas consomem layouts padronizados de `src/shared/`. |
| V. Atomic Design | Reforço do uso de `src/shared/` para componentes puramente visuais, garantindo que as regras de negócio fiquem nas views/stores de módulo. |
| Tech Stack | Mantém o uso de Vue 3, Tailwind e TypeScript conforme a constituição. |

## Gates Evaluation

- [x] **Architecture Gate**: O plano segue o Atomic Design e o Vertical Slicing? Sim.
- [x] **Security Gate**: Há exposição de dados sensíveis na UI? Não.
- [x] **Testing Gate**: Como validar a paridade visual? Através de testes visuais manuais e comparação de estrutura de DOM em testes unitários de componentes.

## Phase 0: Research & Outline

### Unknowns & Research Tasks
- **Pesquisa de Layout Global**: Verificar se as classes `.view-content-grid`, `.main-column` e `.side-column` já estão no `main.css` ou se precisam ser criadas.
- **Gap Analysis**: Identificar quais componentes de `BudgetsView` ainda não são genéricos (ex: a lógica de timeline da metodologia 50/30/20).

## Phase 1: Design & Contracts

### Data Model & Schema (Design Tokens)
- **Cores Semânticas**: Garantir que `error`, `success`, `warning` e `info` estejam mapeados para variáveis CSS consistentes.
- **Tipografia**: Padronizar tamanhos de fonte para cabeçalhos de cards e títulos de view.

### Contracts
- **UI Contract**: Definir as `props` obrigatórias para `BaseViewHeader` e `BaseCard` para garantir a consistência.

## Phase 2: Implementation Steps

### Step 1: Core Styles & Shared Components
- Centralizar classes de layout de view em `src/core/styles/main.css`.
- Atualizar `BaseViewHeader.vue` para suportar o estilo "highlight" da tela de Orçamentos.
- Validar `BaseCard.vue` e `BaseSummaryItem.vue`.

### Step 2: Refatoração de Views (Módulo Finance)
- Aplicar o novo padrão em `DashboardView.vue`.
- Aplicar o novo padrão em `GoalsView.vue`.
- Aplicar o novo padrão em `LoansView.vue`.
- Aplicar o novo padrão em `SubscriptionsView.vue`.

### Step 3: Validação e Ajustes Finais
- Revisar espaçamentos (gaps) e alinhamentos em todas as telas.
- Garantir que o modo escuro (Dark Mode) funcione perfeitamente com os tokens de cor.
