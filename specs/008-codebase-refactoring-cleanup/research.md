# Research: Codebase Refactoring and Cleanup

**Feature**: Codebase Refactoring and Cleanup (008)
**Date**: 2026-04-29

## High Complexity Analysis

Using ESLint with `complexity` rule, the following files were identified as "worst offenders" (complexity > 10) or significant candidates for simplification:

| File | Complexity | Rationale for Refactoring |
|------|------------|---------------------------|
| `src/shared/components/organisms/PatrimonialChart.vue` | 11 | `updateChartTheme` has too many nested conditionals for theme mapping. |
| `src/presentation/components/WalletForm.vue` | 12 | Form validation and submission logic is coupled and heavily branched. |
| `src/shared/utils/bigint-adapter.ts` | 9 | `parseDecimalToBigInt` uses complex string manipulation and multiple paths. |
| `src/infrastructure/repositories/DexieWalletRepository.ts` | 7 | Mapping logic between local and domain entities has redundant checks. |

## Dead Code Analysis

Analysis using `knip` and `ts-prune` identified the following orphan artifacts:

### Unused Files
- `src/core/errors/DomainError.ts`: Redundant redefinition exists in modules.
- `src/core/logger/ILogger.ts`: Interface defined but not consistently implemented/injected.
- `src/infrastructure/logging/ConsoleLogger.ts`: Implementation exists but not wired to DI.
- `src/shared/messages/index.ts`: Redundant wrapper for the catalog.

### Unused Exports (High Value)
- `src/core/errors/index.ts`: Multiple error types (`ValidationError`, `NotFoundError`) are exported but never used.
- `src/infrastructure/storage/VaultDatabase.ts`: Several local interfaces (`ILocalPayee`, `ILocalActivity`) are exported but only used internally.
- `src/modules/transactions/domain/errors/index.ts`: Local `InfrastructureError` is exported but potentially redundant if centralized.

## Architecture & Responsibility Alignment

### Redundant Domain Errors
The `transactions` module redefines `DomainError` and `InfrastructureError`. This violates Principle XVI (Single Source of Truth) and Principle XII (Typed Domain Errors - should extend a common base if applicable).

### Service Responsibility
`bigint-adapter.ts` contains complex parsing logic that should be simplified with specialized utility functions or a more declarative approach.

## Decisions

- **Decision 1: Centralize Errors**: Remove local `DomainError` from `src/modules/transactions/domain/errors/index.ts` and make all module-specific errors inherit from the central `src/core/errors/DomainError.ts`.
- **Decision 2: Simplify UI Logic**: Move theme mapping from `PatrimonialChart.vue` to a shared theme utility or use a more declarative mapping object.
- **Decision 3: Purge Orphans**: Delete the files identified as unused by `knip` unless they are explicitly required for upcoming (unspecified) tasks.
- **Decision 4: Densify Storage Interfaces**: Move internal interfaces in `VaultDatabase.ts` to a private scope or a dedicated types file if they are not shared.

## Rationale
Centralizing primitives like Errors and Loggers ensures that the "Core" layer remains the source of truth, as per Principle VIII. Purging dead code reduces cognitive load and build times (Principle IX).
