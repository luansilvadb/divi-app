# Tasks: UI Polish and Consistency

**Feature Branch**: `011-ui-polish-consistency`  
**Plan**: [plan.md](plan.md)  
**Status**: Ready for Implementation

## Implementation Strategy
We will follow an incremental delivery approach, starting with the highest priority visual fix (the broken icon in the sidebar), followed by the visibility improvements in the header. Each phase is independently testable.

## Phase 1: Setup
- [x] T001 Initialize task tracking for 011-ui-polish-consistency

## Phase 2: Foundational
- [x] T002 Verify current unit tests for `src/shared/components/molecules/__tests__/SyncStatusIndicator.spec.ts` are passing
- [x] T003 Verify `src/shared/components/organisms/AppSidebar.vue` renders without console errors in dev mode

## Phase 3: User Story 1 - Fix Sidebar Icons Rendering
**Story Goal**: Correct the wallet icon in the sidebar and ensure alignment.
**Independent Test**: User can navigate to the sidebar and see a valid icon for "Orçamentos".

- [x] T004 [P] [US1] Rename icon `i-lucide-IWallet` to `i-lucide-wallet` in `src/shared/components/organisms/AppSidebar.vue`
- [x] T005 [US1] Adjust vertical alignment and spacing in `src/shared/components/organisms/AppSidebar.vue` to ensure pixel-perfect 18px bounds

## Phase 4: User Story 2 - Enhance Sync Status Visibility
**Story Goal**: Improve contrast and visibility of the sync indicator and notification bell.
**Independent Test**: The "Sincronizado" status and notification bell are clearly legible and visually balanced.

- [x] T006 [P] [US2] Increase default opacity of label and apply `text-success-main` to `synced` state in `src/shared/components/molecules/SyncStatusIndicator.vue`
- [x] T007 [US2] Remove `scale-90` from `SyncStatusIndicator` in `src/shared/components/organisms/GlobalHeader.vue`
- [x] T008 [US2] Update notification bell button styling in `src/shared/components/organisms/GlobalHeader.vue` to match the sync indicator's pill style

## Phase 5: Polish & Cross-Cutting Concerns
- [x] T009 Verify light/dark mode legibility for all changed elements
- [x] T010 Update `src/shared/components/molecules/__tests__/SyncStatusIndicator.spec.ts` to reflect styling changes if needed
- [x] T011 Final visual audit against the user-provided screenshot

## Dependencies
1. US1 and US2 are independent and can be implemented in parallel.
2. Phase 5 requires completion of Phase 3 and Phase 4.

## Parallel Execution Examples
- **Worker A**: T004, T005 (Sidebar)
- **Worker B**: T006, T007, T008 (Header)
