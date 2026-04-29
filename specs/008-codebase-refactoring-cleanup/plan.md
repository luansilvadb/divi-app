# Implementation Plan: Codebase Refactoring and Cleanup

**Branch**: `008-codebase-refactoring-cleanup` | **Date**: 2026-04-29 | **Spec**: [spec.md](file:///d:/software/divi/divi-app/specs/008-codebase-refactoring-cleanup/spec.md)
**Input**: Feature specification from `/specs/008-codebase-refactoring-cleanup/spec.md`

## Summary

The primary objective is to reduce technical debt by simplifying complex logic, removing dead code, and consolidating architectural primitives (Errors/Loggers) into the Core layer. The approach involves using static analysis findings (ESLint, Knip, ts-prune) to target the most complex and unused parts of the system while maintaining 100% functional parity.

## Technical Context

**Language/Version**: TypeScript 5.9+, Vue 3.5+  
**Primary Dependencies**: Vite, Vitest, ESLint, Knip  
**Storage**: Dexie (IndexedDB) - cleanup focuses on repository mapping complexity.  
**Testing**: Vitest (Unit & Integration)  
**Target Platform**: Web (PWA)
**Project Type**: Web Application (Hexagonal Architecture)  
**Performance Goals**: Reduction in bundle size and improved maintenance velocity.  
**Constraints**: Must maintain 100% test pass rate; no changes to business logic behavior.  
**Scale/Scope**: Entire codebase (src/ folder).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle VIII (Architecture)**: Refactoring must consolidate shared primitives into `core/` or `shared/`. (PASS)
- **Principle IX (No Dead Code)**: All identified orphan files and unused exports must be removed. (PASS)
- **Principle XVI (SSOT)**: Redundant error definitions must be centralized. (PASS)
- **Principle III (Simplicity)**: High complexity functions (>10) must be broken down. (PASS)

## Project Structure

### Documentation (this feature)

```text
specs/008-codebase-refactoring-cleanup/
├── plan.md              # This file
├── research.md          # Findings from ESLint, Knip, ts-prune
├── data-model.md        # Refactoring strategy for data structures
└── quickstart.md        # Summary of refactored areas
```

### Source Code (repository root)

The structure follows the established Hexagonal Architecture. Refactoring will touch files across all layers:

```text
src/
├── core/
│   ├── errors/          # CONSOLIDATION: Base DomainError
│   └── logger/          # CONSOLIDATION: ILogger interface
├── infrastructure/
│   ├── logging/         # WIRING: ConsoleLogger
│   └── repositories/    # SIMPLIFICATION: Dexie mappings
├── modules/
│   └── transactions/
│       └── domain/
│           └── errors/  # CLEANUP: Remove redefinitions
└── shared/
    ├── components/      # SIMPLIFICATION: Complex Vue components
    └── utils/           # SIMPLIFICATION: bigint-adapter.ts
```

**Structure Decision**: No changes to the directory structure are planned, but files within these directories will be deleted or modified to align with responsibilities.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|---------------------------|
| None | N/A | N/A |

## Refactoring Strategy (Design)

1. **Error Centralization**:
    - Update `src/core/errors/DomainError.ts` to be the single base class.
    - Migrate all module-specific errors to extend this base.
    - Remove `DomainError` redefinition in `src/modules/transactions/domain/errors/index.ts`.

2. **Complexity Reduction**:
    - **PatrimonialChart.vue**: Extract theme mapping logic into a dedicated `useChartTheme` composable.
    - **bigint-adapter.ts**: Refactor `parseDecimalToBigInt` using early returns and specialized regex for part extraction.
    - **WalletForm.vue**: Split validation logic into a separate composable/validator class.

3. **Purge Phase**:
    - Delete orphan files identified in `research.md`.
    - Remove all unused exports reported by `ts-prune`.
    - Strip all obsolete comments and unused imports.
