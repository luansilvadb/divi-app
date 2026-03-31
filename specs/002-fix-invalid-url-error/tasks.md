# Tasks: Fix Invalid URL Error for Data URIs

**Branch**: `002-fix-invalid-url-error` | **Date**: 2026-03-30
**Input**: Design documents from `/specs/002-fix-invalid-url-error/`

## Phase 1: Setup (Project Initialization)

**Goal**: Preparar os ativos físicos e a infraestrutura básica para os utilitários de ativos.

- [x] T001 [P] Create directory `/public/assets/` if it does not exist
- [x] T002 [P] Extract `data:image/png;base64` from `src/shared/components/organisms/AppSidebar.vue` and save as `/public/assets/noise.png`
- [x] T003 [P] Create a safe placeholder SVG in `/public/assets/placeholder.svg` for category fallbacks

## Phase 2: Foundational (Blocking Prerequisites)

**Goal**: Implementar o utilitário `AssetLoader` que será utilizado por todas as histórias de usuário.

- [x] T004 Create `Asset` entity and validation constants in `src/shared/domain/entities/Asset.ts`
- [x] T005 [P] Create `IAssetLoader` contract in `src/shared/domain/contracts/IAssetLoader.ts`
- [x] T006 Implement `AssetLoader` utility in `src/shared/utils/asset-loader.ts` with sanitization logic (FR-001, FR-005)
- [x] T007 Integrate `AssetLoader` with `ActivityLogService` for error logging in `src/shared/utils/asset-loader.ts` (FR-006)
- [x] T008 Register `AssetLoader` in the DI container in `src/core/di.ts`

## Phase 3: User Story 1 - Error-free Store Initialization (Priority: P1)

**Story Goal**: Eliminar erros de console durante a inicialização do Dashboard e Transactions.

- [x] T009 [US1] Refactor `src/shared/components/organisms/AppSidebar.vue` to use `/assets/noise.png` instead of inline Data URI
- [x] T010 [US1] Refactor `src/modules/auth/ui/views/LoginView.vue` to use a static SVG or file for the noise overlay (Line 171)
- [x] T011 [US1] Audit `src/modules/dashboard/application/stores/dashboardStore.ts` for any implicit asset loading during `onMounted` or actions
- [x] T012 [US1] Audit `src/modules/transactions/application/stores/transactionStore.ts` for any implicit asset loading during category/wallet fetching

## Phase 4: User Story 2 - Visual Consistency for Placeholders (Priority: P2)

**Story Goal**: Garantir que ícones de categorias e carteiras tenham fallbacks seguros e sanitizados.

- [x] T013 [US2] Update `src/modules/transactions/ui/components/TransactionItem.vue` to use `AssetLoader` for category icons
- [x] T014 [P] [US2] Update `src/modules/dashboard/ui/views/DashboardView.vue` to use `AssetLoader` for wallet/category icon rendering
- [x] T015 [US2] Implement `@error` handler in any `<img>` tags found in `src/modules/transactions/ui/` components to apply fallback (FR-004)
- [x] T016 [US2] Implement `@error` handler in any `<img>` tags found in `src/modules/dashboard/ui/` components to apply fallback (FR-004)

## Phase 5: Polish & Cross-cutting Concerns

**Goal**: Garantir a consistência final e documentação.

- [x] T017 Review all remaining Data URIs in the codebase for potential `net::ERR_INVALID_URL` risks
- [x] T018 Verify that `ActivityLogService` correctly receives and stores asset sanitization errors
- [x] T019 Final manual validation in Dashboard and Transactions views (SC-001, SC-002)

---

## Dependencies & Execution Order

1. **Phase 1 & 2 (Prerequisites)**: MUST be completed first to provide the static assets and the `AssetLoader` utility.
2. **Phase 3 (US1)**: Resolves the primary P1 issue (Console Errors).
3. **Phase 4 (US2)**: Enhances UI resilience with fallbacks.
4. **Phase 5 (Polish)**: Final verification.

## Parallel Execution Examples

- **Foundational**: T004, T005 can be done in parallel.
- **UI Refactoring**: T009 and T010 can be done in parallel by different developers.
- **Validation**: T014, T015, and T016 are independent and can be executed in parallel.

## Implementation Strategy

- **MVP**: Complete Phase 1, 2, and 3 to eliminate console errors immediately.
- **Incremental**: Phase 4 adds robust fallbacks for dynamic data from Supabase/Dexie.
