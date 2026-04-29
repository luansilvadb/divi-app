# Implementation Plan: fix-naive-ui-type-error

**Branch**: `012-fix-naive-ui-type-error` | **Date**: 2026-04-29 | **Spec**: [spec.md](file:///c:/teste/divi-app/specs/012-fix-naive-ui-type-error/spec.md)

**Input**: Feature specification from `/specs/012-fix-naive-ui-type-error/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

The primary requirement is to resolve a TypeScript build error where `MessageApiInjection` is missing from `naive-ui/lib/message/src/types`. The technical approach is to update the import to use the public `MessageApi` export from the root `naive-ui` package, which is the stable and recommended way to reference the message API types.

## Technical Context

**Language/Version**: TypeScript 5.9, Vue 3.5  
**Primary Dependencies**: Naive UI 2.44.1, Vite 7.3  
**Storage**: N/A  
**Testing**: vue-tsc (type-check), Vitest  
**Target Platform**: Web Browser  
**Project Type**: Web Application  
**Performance Goals**: N/A (Build stability)  
**Constraints**: Must not break existing message functionality  
**Scale/Scope**: Small bug fix targeting one composable file

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Clarity (I)**: Using public exports improves code legibility.
- [x] **Consistency (II)**: Standardizes UI library type imports across the project.
- [x] **Simplicity (III)**: Resolves the issue with a single-line import change.
- [x] **Architecture (VIII)**: Adheres to external library boundaries by using public APIs.
- [x] **No Dead Code (IX)**: Replaces the invalid internal path reference.

## Project Structure

### Documentation (this feature)

```text
specs/012-fix-naive-ui-type-error/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output (N/A)
├── quickstart.md        # Phase 1 output (N/A)
└── tasks.md             # Phase 2 output (/speckit-tasks command)
```

### Source Code (repository root)

```text
src/
└── modules/
    └── transactions/
        └── application/
            └── composables/
                └── useTransactionForm.ts
```

**Structure Decision**: The fix is confined to the existing Hexagonal Architecture structure, specifically within the Application layer of the Transactions module.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None      |            |                                     |
