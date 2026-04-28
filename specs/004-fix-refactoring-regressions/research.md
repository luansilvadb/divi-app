# Research: Fix Refactoring Regressions

## Domain: Build and Type Stability

### Decision: Interface Unification
**Rationale**: Duplicated interfaces with mismatched naming conventions (`save` vs `create`/`update`, `createdAt` vs `created_at`) are causing DI failures.
**Findings**:
- `shared/domain/contracts/ITransactionRepository.ts` uses `save()`.
- `modules/ledger/domain/contracts/ITransactionRepository.ts` uses `create()` and `update()`.
- The `ledger` interface incorrectly references `createdAt`/`updatedAt` which do not exist on the `Transaction` entity.
**Action**: Standardize on `create()` and `update()` for all repositories to match modern persistence patterns, but ensure naming matches the entity schema (`created_at`). Deprecate the `shared` version or align it.

### Decision: BigInt Handling
**Rationale**: Precision is critical for financial data (Principle III - Simplicity & Consistency). Centralizing BigInt logic prevents fragmented implementations and "missing member" errors.
**Findings**:
- `parseDecimalToBigInt` is a common requirement in UI components (e.g., `TransferForm.vue`).
- `shared/utils/bigint-adapter` exists but is missing exports or implementation.
**Action**: Populate and export `parseDecimalToBigInt` and `formatBigIntToDecimal` from `shared/utils/bigint-adapter`.

### Decision: Vitest Configuration
**Rationale**: Type errors in `vitest.config.ts` block the build pipeline.
**Findings**:
- `mergeConfig` with `defineConfig` from `vitest/config` is causing overload mismatches in Vite 7/Vitest 3.
- Using `defineConfig` from `vite` for the base config and `defineConfig` from `vitest/config` for the test specific part is the standard pattern, but the types sometimes clash.
**Action**: Simplify `vitest.config.ts` to use a single `defineConfig` from `vitest/config` if possible, or cast to `UserConfig` to resolve type ambiguity.

### Decision: Test Mocking
**Rationale**: Test rot occurs when mocks don't match evolving types.
**Findings**:
- `LocalTransaction`, `Budget`, and `Wallet` types were updated with mandatory metadata (`created_at`, `deleted`, `version`, `sync_status`).
- Mocks in tests like `SyncEngine.spec.ts` and `VaultDatabase.spec.ts` are outdated.
**Action**: Implement `src/__tests__/factories/` for each core entity.

## Alternatives Considered
- **Manual Mock Updates**: Rejected because it's error-prone and unsustainable (Principle II - Consistency).
- **Local BigInt Utils**: Rejected to maintain a single source of truth (Principle IX - Consistency).
