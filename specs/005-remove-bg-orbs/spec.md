# Feature Specification: Remove Background Orbs Effect

**Feature Branch**: `005-remove-bg-orbs`  
**Created**: 2026-03-29  
**Status**: Draft  
**Input**: User description: "quero remover esse efeito de "bola de gradiente" de todas as telas (que o projeto chama de **Orbs**), você precisa lidar com o componente `BaseBackgroundOrbs.vue`. Aqui está o passo a passo de como eu fiz e como você pode fazer em outras telas: ### 1. O que gera o efeito? O efeito é gerado pelo componente localizado em: `src/shared/components/atoms/BaseBackgroundOrbs.vue` Ele contém 3 `divs` com classes `.orb-1`, `.orb-2` e `.orb-3`, que usam filtros de desfoque (`blur`) e animações para criar as luzes flutuantes no fundo. ### 2. Para remover de uma tela específica (como fiz em Transações): Vá no arquivo `.vue` da tela (ex: `TransactionsView.vue`) e: 1. **No HTML (`<template>`)**: Apague a linha que chama o componente: ```html <BaseBackgroundOrbs /> ``` 2. **No Script**: Remova a linha de importação: ```typescript import BaseBackgroundOrbs from '@/shared/components/atoms/BaseBackgroundOrbs.vue' ``` ### 3. Para remover de todas as telas de uma vez (Globalmente): Se você decidir que não quer esse efeito em nenhuma parte do app, a maneira mais rápida é esvaziar o componente original em `src/shared/components/atoms/BaseBackgroundOrbs.vue`: Basta deixar o template dele vazio: ```html <template> <!-- Efeito removido globalmente --> </template> ``` Dessa forma, o componente ainda existe (evitando erros de importação em outros arquivos), mas não renderiza nada na tela."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Global Removal of Visual Noise (Priority: P1)

As a user, I want a cleaner interface without the floating gradient orbs in the background, so that I can focus better on the financial data.

**Why this priority**: This is the primary request from the user to improve the visual clarity of the application.

**Independent Test**: Can be tested by verifying that the background orbs are no longer visible on any screen of the application after a single modification to the core component.

**Acceptance Scenarios**:

1. **Given** the application is running, **When** the `BaseBackgroundOrbs.vue` template is emptied, **Then** no gradient orbs should be visible on any page.
2. **Given** the gradient orbs are removed globally, **When** navigating between different views (Dashboard, Budgets, etc.), **Then** no visual regressions or layout shifts related to the removal should occur.

---

### User Story 2 - Code Cleanup and Maintenance (Priority: P2)

As a developer, I want to remove unused imports and component declarations of `BaseBackgroundOrbs` from specific views, so that the codebase remains clean and maintainable.

**Why this priority**: While the global removal is faster, cleaning up the individual files prevents "dead code" (imports of a component that does nothing).

**Independent Test**: Can be tested by searching for references to `BaseBackgroundOrbs` in `.vue` files and verifying they are removed without causing build errors.

**Acceptance Scenarios**:

1. **Given** a view that previously used `BaseBackgroundOrbs`, **When** the component and its import are removed, **Then** the view should still render correctly and the build should pass.

---

### Edge Cases

- **Missing Component**: If a view expects the component to exist but it's deleted (not emptied), the application will fail to build. The strategy must favor emptying the component first.
- **SSR/Hydration**: Ensure that removing these elements doesn't cause hydration mismatches if the app is rendered server-side.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST cease rendering the `.orb-1`, `.orb-2`, and `.orb-3` elements globally.
- **FR-002**: System MUST maintain the `BaseBackgroundOrbs.vue` file to avoid breaking existing imports across the application during the transition.
- **FR-003**: The implementation SHOULD include a cleanup of manual imports in views where `BaseBackgroundOrbs` was explicitly used.
- **FR-004**: The background of the application MUST remain consistent (e.g., solid color or standard gradient) after the orbs are removed.

### Key Entities *(include if feature involves data)*

- **BaseBackgroundOrbs**: The atom component responsible for the visual effect.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of screens previously displaying gradient orbs no longer show them.
- **SC-002**: Zero console errors or warnings related to "Component not found" or "Unused import" in modified files.
- **SC-003**: Build time remains unaffected or slightly improves due to less CSS/DOM elements to process.

## Assumptions

- **Global Preference**: The user wants this removed from *all* screens, implying a global design change.
- **Tech Stack**: Assumes Vue 3 Composition API as per project guidelines.
- **No Substitute**: Assumes no other background effect is requested to replace the orbs at this time.
