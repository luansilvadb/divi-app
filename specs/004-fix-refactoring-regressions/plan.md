# Implementation Plan: Restore Application Stability and Build Integrity

**Branch**: `004-fix-refactoring-regressions` | **Date**: 2026-04-28 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/004-fix-refactoring-regressions/spec.md`

## Summary

The objective of this feature is to restore the application's stability and build integrity following a major refactoring. This involves fixing critical TypeScript regressions in repository adapters, formalizing a centralized `bigint-adapter` for monetary operations, and stabilizing the test suite using centralized test factories. The primary success metric is a 100% successful production build and 100% test pass rate.

## Technical Context

**Language/Version**: TypeScript 5.9, Node.js >=22.12  
**Primary Dependencies**: Vue 3.5, Pinia 3.0, Vite 7.3, TailwindCSS 4.2  
**Storage**: Dexie (Vault)  
**Testing**: Vitest 3.0  
**Target Platform**: Web (PWA)  
**Project Type**: Frontend Web Application  
**Performance Goals**: 100% Build Pass, 100% Test Pass  
**Constraints**: Strict type safety, BigInt for all currency values, Interface-First compliance  
**Scale/Scope**: All modules (`src/modules`), core infrastructure, and test suites.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. Clarity**: Aligning code with interfaces improves readability and predictability.
- [x] **II. Consistency**: Centralizing BigInt logic and test mocks enforces codebase standards.
- [x] **III. Simplicity**: Focus is strictly on restoring stability without adding new features.
- [x] **IV. Documentation**: Updating internal documentation and comments to reflect the new data types.
- [x] **VI. Interface-First Design**: All adapters will be audited to strictly implement Core ports.
- [x] **VII. Architecture**: Hexagonal Architecture boundaries will be reinforced during the audit.
- [x] **VIII. Naming Conventions**: Interfaces will maintain the `I` prefix.
- [x] **IX. No Dead Code**: Cleanup of any obsolete methods or variables found during the build fix.

## Project Structure

### Documentation (this feature)

```text
specs/004-fix-refactoring-regressions/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
src/
├── core/
│   ├── ports/           # Repository interfaces (ITransactionRepository, etc.)
│   └── sync/            # SyncEngine
├── infrastructure/
│   └── storage/         # Repository adapters (VaultTransactionRepository, etc.)
├── modules/             # Business modules (Transactions, Budgets, etc.)
├── shared/
│   └── utils/           # Centralized bigint-adapter
└── stores/              # Dashboard and module stores
```

**Structure Decision**: The existing Hexagonal Architecture structure will be maintained. No structural changes are proposed; the focus is on content alignment within the existing directories.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
