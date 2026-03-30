# Tasks: Refactor Design System Color Palette

**Input**: Design documents from `/specs/002-refactor-color-palette/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/themes.md

**Tests**: Test tasks are included as requested by the independent test criteria in spec.md.

**Organization**: Tasks follow the Design System architecture (Global/Core, Shared/Atomic Design).

---

## Phase 1: Setup & Global Styles (Core/Styles)

**Purpose**: Definição das variáveis CSS e integração com Tailwindcss.

- [x] T001 [P] Create Global Theme CSS in `src/core/styles/theme.css` with Light/Dark variables
- [x] T002 Update `tailwind.config.ts` (or `tailwind.config.js`) to extend theme with CSS variable mappings
- [x] T003 Verify Tailwind utility classes (`text-primary-main`, `bg-bg-main`) are available in a dummy component

---

## Phase 2: Theme Management & Logic (Core/Theme)

**Purpose**: Implementação da lógica de persistência e detecção de preferência do sistema.

- [x] T004 Create Theme Manager in `src/core/theme/themeManager.ts` to handle theme state and LocalStorage
- [x] T005 [P] Implement system preference detection (`prefers-color-scheme`) in `src/core/theme/themeManager.ts`
- [x] T006 Initialize Theme Manager in `src/main.ts` and apply theme class to the root element on load

---

## Phase 3: [US1] Consistent Brand Visuals (Priority: P1)

**Story Goal**: Implementar as cores de marca (Navy, Emerald, Gold) em componentes-chave.
**Independent Test**: Alternar temas e verificar se as cores `primary`, `secondary` e `accent` atualizam corretamente mantendo o contraste.

- [x] T007 [US1] Define Brand Tokens (`primary-main`, `secondary-main`, `accent-main`) in `src/core/styles/theme.css`
- [x] T008 [P] [US1] Update `src/shared/components/atoms/BaseButton.vue` to use new brand tokens
- [x] T009 [P] [US1] Update `src/shared/components/organisms/AppSidebar.vue` to use new brand tokens via Tailwind classes

---

## Phase 4: [US2] Accessible Content (Priority: P1)

**Story Goal**: Garantir alto contraste em todos os textos do sistema (WCAG AA).
**Independent Test**: Utilizar ferramentas de acessibilidade para validar o contraste dos tokens de texto sobre os fundos.

- [x] T010 [US2] Define Text Tokens (`text-primary`, `text-secondary`, `text-disabled`) in `src/core/styles/theme.css`
- [x] T011 [P] [US2] Update base text styles in `src/core/styles/theme.css` to use accessible tokens (standardizing styles)
- [x] T012 [P] [US2] Audit and update `src/shared/components/atoms/BaseInput.vue` for contrast compliance

---

## Phase 5: [US3] Semantic Clarity (Priority: P2)

**Story Goal**: Implementar cores de status (Sucesso, Erro, Aviso) claras e distintas.
**Independent Test**: Verificar feedback visual de cores semânticas em formulários e indicadores de status.

- [x] T013 [US3] Define Semantic Tokens (`success`, `error`, `warning`, `info`) in `src/core/styles/theme.css`
- [x] T014 [P] [US3] Update `src/modules/finance/ui/components/TransactionForm.vue` to use semantic colors for feedback
- [x] T015 [P] [US3] Update `src/shared/components/atoms/BaseBadge.vue` to support semantic color variants

---

## Phase 6: Polish & Verification

**Purpose**: Refinamentos visuais, transições e prevenção de FOUC.

- [x] T016 Add smooth transitions (~300ms) for color properties in `src/core/styles/theme.css`
- [x] T017 [P] Implement FOUC inhibition in `index.html` via inline script for theme application
- [x] T018 Document color tokens usage and best practices in `GEMINI.md`
- [ ] T019 Create a "Theme Preview" dev-only view to visualize all tokens in both themes for final verification
- [ ] T020 [US1] Create third-party theme bridge mapping CSS variables to external library tokens (e.g., PrimeVue, Vuetify) - Resolves FR-014

---

## Dependencies & Execution Order

1. **Setup First**: CSS Variables and Tailwind config must be ready (T001-T003).
2. **Logic Integration**: Theme manager must be initialized before UI updates (T004-T006).
3. **P1 User Stories**: Implement brand and text tokens (US1, US2) before semantic colors.
4. **Parallelism**: UI component updates ([P]) can happen in parallel once tokens are defined.
5. **Final Polish**: Transitions and FOUC inhibition depend on a stable base implementation.

## Parallel Execution Examples

- **By User Story**: Implement T008, T009, T011, T012, T014, T015 in parallel across different components once Phase 1/2 are done.
- **By File Scope**: T001 and T002 can be started together as they define the contract between CSS and Tailwind.

## Implementation Strategy

- **MVP First**: Complete Phase 1 and 2, then US1/US2 to deliver a functional core and accessible UI.
- **Incremental Delivery**: Roll out US3 (Semantic Colors) followed by Phase 6 (Polish) for final delivery.
