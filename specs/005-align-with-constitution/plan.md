# Implementation Plan: Align Project with Constitution

**Branch**: `005-align-with-constitution` | **Date**: 2026-04-28 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-align-with-constitution/spec.md`

## Summary

Refactor the entire codebase to strictly adhere to the project constitution, focusing on Interface-First Design (VI), Hexagonal Architecture (VII), Interface Naming Conventions (VIII), and Dead Code Elimination (IX). The approach involves renaming interfaces with the `I` prefix, extracting abstractions for all cross-module dependencies, reorganizing modules into `core`, `ports`, and `adapters`, and implementing a manual constructor-based Dependency Injection (DI) mechanism. Dead code will be identified and removed using `knip`.

## Technical Context

**Language/Version**: TypeScript 5+ (based on `tsconfig.json`)  
**Primary Dependencies**: Vue 3, Vite, Vitest, Supabase, Knip, UnoCSS  
**Storage**: Supabase (PostgreSQL)  
**Testing**: Vitest  
**Target Platform**: Web (SPA/PWA)
**Project Type**: Web application  
**Performance Goals**: N/A  
**Constraints**: Offline-capable (PWA), Manual Vanilla DI (Constructor injection)  
**Scale/Scope**: ~14 business modules, full project refactoring

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Justification |
|------|--------|---------------|
| Interface-First Design (VI) | PASS | The primary goal is to enforce dependency on abstractions. |
| Hexagonal Architecture (VII) | PASS | Refactoring modules to Core/Ports/Adapters structure. |
| Naming Conventions (VIII) | PASS | Renaming all interfaces to use the `I` prefix. |
| No Dead Code (IX) | PASS | Using `knip` to identify and remove all unreferenced code. |

## Project Structure

### Documentation (this feature)

```text
specs/005-align-with-constitution/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (via /speckit-tasks)
```

### Source Code (repository root)

```text
src/
├── core/                # Global infrastructure and DI
│   ├── di.ts            # Manual DI Container/Composition Root
│   └── supabase.ts
├── modules/
│   └── [module-name]/
│       ├── core/        # Pure business logic (entities, use cases)
│       ├── ports/       # Interfaces (Input/Output ports)
│       └── adapters/    # Concrete implementations (repository, clients)
├── shared/              # Primitives and utilities
└── App.vue
```

**Structure Decision**: Hexagonal Architecture with internal module separation into `core`, `ports`, and `adapters` as mandated by Principle VII. A central `src/core/di.ts` will serve as the Composition Root for manual dependency injection.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | | |
