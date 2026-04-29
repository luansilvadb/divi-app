# Implementation Plan: UI Polish and Consistency

**Feature Branch**: `011-ui-polish-consistency`  
**Spec**: [spec.md](spec.md)  
**Status**: Planning

## Technical Context

### Architecture & Tech Stack
- **Framework**: Vue 3 with Composition API.
- **Styling**: UnoCSS for utility-first styling and icons.
- **UI Library**: Naive UI for layout and components.
- **Icons**: Lucide via UnoCSS icon preset (`i-lucide-`).

### Existing Patterns
- **Sync Indicator**: Located in `GlobalHeader.vue`, implemented in `SyncStatusIndicator.vue`.
- **Sidebar**: Implemented in `AppSidebar.vue`, uses `NMenu`.
- **Colors**: Defined in `uno.config.ts` using Apple System Colors as base.

### Research Findings
- **Icon Typo**: "Orçamentos" uses `i-lucide-IWallet` instead of `i-lucide-wallet`.
- **Visibility**: Sync text uses `opacity-60`, which is too faint for primary status feedback.
- **Consistency**: Notification bell styling is basic compared to the "pill" style of the sync indicator.

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Clarity | ✅ Pass | Fixes descriptive icons and status text. |
| II. Consistency | ✅ Pass | Aligns notification bell with sync indicator styling. |
| III. Simplicity | ✅ Pass | Minimal adjustments to existing components. |
| X. Message Catalog | ✅ Pass | Ensures labels come from `catalog.ts`. |
| XI. TDD | ✅ Pass | Updates existing component tests. |

## Phase 0: Research & Discovery
- [x] Identify correct Lucide icon names.
- [x] Analyze current CSS for contrast violations.
- [x] Verify design tokens for header actions.

**Artifacts**: [research.md](research.md)

## Phase 1: Design & Contracts
- [x] Update data model with UI entities.
- [x] Update agent context.
- [x] Create quickstart guide.

**Artifacts**: [data-model.md](data-model.md), [quickstart.md](quickstart.md)

## Phase 2: Implementation Strategy

### 1. Sidebar Refinement
- Update `AppSidebar.vue` to use `i-lucide-wallet`.
- Review vertical alignment of icons (ensure they are centered in their 48px wrappers).

### 2. Header & Sync Indicator Refinement
- **SyncStatusIndicator.vue**:
    - Increase default opacity of label to `opacity-80`.
    - Change "Sincronizado" color to `text-success-main`.
    - Change "Sincronizando" color to `text-info-main`.
- **GlobalHeader.vue**:
    - Remove `scale-90` from `SyncStatusIndicator` for better legibility.
    - Style notification bell button:
        - Add `bg-surface-primary/80 backdrop-blur-sm border border-separator rounded-full`.
        - Match padding and height of the sync indicator pill.

### 3. Verification & Testing
- Test light/dark mode transitions.
- Verify contrast ratios in browser dev tools.
- Update `SyncStatusIndicator.spec.ts`.

## Phase 3: Delivery
- [ ] Task generation (`/speckit-tasks`).
- [ ] Implementation (`/speckit-implement`).
