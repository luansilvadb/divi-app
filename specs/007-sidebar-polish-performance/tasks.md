# Tasks: Sidebar Polish & Performance Deep Research

**Input**: Design documents from `specs/007-sidebar-polish-performance/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup & Dependencies

**Purpose**: Project initialization and animation library setup.

- [x] T001 [P] Install `@vueuse/motion` dependency using `npm install @vueuse/motion`
- [x] T002 Register `MotionPlugin` in `src/main.ts` to enable directive usage

---

## Phase 2: Foundational (State & Utils)

**Purpose**: Blocking prerequisites for performance detection and state management.

- [x] T003 Update `SidebarState` in `src/shared/stores/sidebarStore.ts` to include `prefetchQueue` (Set) and performance metrics
- [x] T004 Enhance `checkIsLowPowerMode` and implement `isReducedMotionDetected` in `src/shared/utils/performance.ts`
- [x] T005 [P] Update `sidebarStore.ts` actions to handle performance detection initialization and prefetch logic skeleton

---

## Phase 3: [US1] Premium Interactive Experience

**Story Goal**: Implement organic spring physics for sidebar animations.
**Independent Test**: Click toggle and hover items; observe "bounce" and 60 FPS fluidity.

- [x] T006 [US1] Remove standard CSS transitions for width and transform in `<style>` section of `src/shared/components/organisms/AppSidebar.vue`
- [x] T007 [US1] Implement `v-motion` directive with spring configuration (`stiffness: 250, damping: 25`) on the `.sidebar` element in `src/shared/components/organisms/AppSidebar.vue`
- [x] T008 [US1] Refactor the nav item indicator to use spring-based vertical transitions in `src/shared/components/organisms/AppSidebar.vue`

---

## Phase 4: [US2] Zero-Impact Idle State

**Story Goal**: Minimize CPU/GPU usage when sidebar is idle.
**Independent Test**: Use Chrome DevTools "Paint Flashing"; no flashes should occur on idle sidebar.

- [x] T009 [US2] Implement `v-memo` for the navigation items `v-for` loop in `src/shared/components/organisms/AppSidebar.vue` to prevent unnecessary re-renders
- [x] T010 [US2] Optimize the `sidebar-noise` layer with `will-change: opacity` and ensure it stays in a separate composite layer in `src/shared/components/organisms/AppSidebar.vue`
- [x] T011 [US2] Update sidebar styles to automatically disable `backdrop-filter` and noise when `isLowPowerMode` is active in `src/shared/components/organisms/AppSidebar.vue`

---

## Phase 5: [US3] Instant Perceived Navigation

**Story Goal**: Prefetch routes on hover to reduce perceived navigation latency.
**Independent Test**: Hover over a nav item for 150ms and check Network tab for component chunk download.

- [x] T012 [US3] Implement `prefetchRoute` action in `src/shared/stores/sidebarStore.ts` with network type detection (2G/3G check)
- [x] T013 [US3] Add `@mouseenter` event listener with a 100ms debounce to navigation items in `src/shared/components/organisms/AppSidebar.vue` to trigger prefetch
- [x] T014 [US3] Ensure prefetch logic only downloads the JS chunk and avoids duplicate requests using the `prefetchQueue` in `src/shared/stores/sidebarStore.ts`

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final audit and cross-browser consistency checks.

- [x] T015 Conduct a comprehensive performance audit using Browser DevTools to verify <16ms interaction latency (SC-001)
- [x] T016 [P] Verify that "Reduced Motion" OS preference is respected (FR-007) in `src/shared/components/organisms/AppSidebar.vue`
- [x] T017 Final check for zero "Layout Shifts" (CLS) during sidebar state changes in `src/shared/components/organisms/AppSidebar.vue`

---

## Dependencies & Execution Order

1. **Setup (Phase 1)**: Must be completed first to enable `@vueuse/motion`.
2. **Foundational (Phase 2)**: Prerequisite for logic in US2 and US3.
3. **US1, US2, US3**: Can be implemented independently once Phase 2 is complete.
4. **Polish (Phase 6)**: Final validation after all implementation.

## Implementation Strategy

- **MVP First**: Complete US1 (Spring Physics) as it provides the most immediate visual value.
- **Incremental Delivery**: Deliver US2 and US3 as performance-focused enhancements.
- **Verification**: Use Chrome DevTools "Performance" and "Rendering" tabs as the primary validation tool for each story.
