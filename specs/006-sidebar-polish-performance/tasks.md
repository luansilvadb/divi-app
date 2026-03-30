# Tasks: Sidebar Polish & Performance

**Input**: Design documents from `/specs/006-sidebar-polish-performance/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)

---

## Phase 1: Setup & Environment Detection [COMPLETE]

**Purpose**: Definir as ferramentas de detecção de performance e estado global da UI.

- [x] T001 Implement battery and FPS heuristic detection in `src/shared/utils/performance.ts`
- [x] T002 Create Pinia store for global sidebar and performance state in `src/shared/stores/sidebarStore.ts`
- [x] T003 Integrate performance detection utility with the sidebar store in `src/shared/stores/sidebarStore.ts`

---

## Phase 2: Foundational Refactoring [COMPLETE]

**Purpose**: Migrar de propriedades de Layout para propriedades de Composite (GPU).

- [x] T004 [P] Refactor `AppSidebar.vue` CSS to use `transform: translateX()` for expand/collapse instead of `width`
- [x] T005 [P] Replace `window.resize` listener with `window.matchMedia` for breakpoint detection in `src/shared/components/organisms/AppSidebar.vue`
- [x] T006 Update `AppSidebar.vue` script to use the new `sidebarStore` for state management

---

## Phase 3: [US1] Smooth Interaction [COMPLETE]

**Purpose**: Garantir 60 FPS estáveis nas animações de navegação.

- [x] T007 [P] [US1] Apply `will-change: transform` and `contain: paint` to sidebar and nav items in `src/shared/components/organisms/AppSidebar.vue`
- [x] T008 [US1] Optimize sidebar transition timing and cubic-bezier for perceived speed in `src/shared/components/organisms/AppSidebar.vue`
- [x] T009 [US1] Implement hardware-accelerated hover effects for navigation items in `src/shared/components/organisms/AppSidebar.vue`

---

## Phase 4: [US2] Efficient Resource Usage [COMPLETE]

**Purpose**: Otimizar o uso de CPU/GPU e implementar o modo de economia.

- [x] T010 [US2] Convert dynamic SVG turbulence filter to a static Data URI background in `src/shared/components/organisms/AppSidebar.vue`
- [x] T011 [US2] Implement conditional CSS logic to disable `backdrop-filter` and noise when `isLowPowerMode` is active in `src/shared/components/organisms/AppSidebar.vue`
- [x] T012 [P] [US2] Add global `.low-power-mode` utility classes to disable animations and heavy effects in `src/core/styles/main.css`

---

## Phase 5: [US3] Instant Theme Switching [COMPLETE]

**Purpose**: Garantir que a troca de tema seja instantânea e sem engasgos.

- [x] T013 [US3] Optimize `themeManager.ts` to update CSS variables with zero-latency in `src/core/theme/themeManager.ts`
- [x] T014 [US3] Ensure sidebar theme transitions use CSS transitions exclusively without JS-driven style forced-reflows in `src/shared/components/organisms/AppSidebar.vue`

---

## Phase 6: Polish & Performance Validation [COMPLETE]

**Purpose**: Auditoria final e limpeza de código.

- [x] T015 Perform deep performance audit using Chrome DevTools (Rendering/Performance) to verify 60 FPS and Paint reduction.
- [x] T016 [P] Cleanup legacy SVG filters and unused CSS variables in `src/shared/components/organisms/AppSidebar.vue`
- [x] T017 Final verification of mobile behavior (collapsed state enforcement) in `src/shared/components/organisms/AppSidebar.vue`
