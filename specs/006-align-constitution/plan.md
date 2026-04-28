# Implementation Plan: Align Project with Constitution

**Branch**: `006-align-constitution` | **Date**: 2026-04-28 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/006-align-constitution/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Refatorar a estrutura do projeto para aderir estritamente à Arquitetura Hexagonal, externalizar e centralizar as mensagens para os usuários (Message Catalog), e garantir a ausência de dead code, conforme estipulado nos princípios da Constituição (VI, VII, VIII, IX, X).

## Technical Context

**Language/Version**: TypeScript, Vue 3
**Primary Dependencies**: Vite, Vue Router, Pinia
**Storage**: N/A for refactoring (Adapters exist for Supabase/Dexie)
**Testing**: Vitest, Vue Test Utils
**Target Platform**: Web Browser (PWA)
**Project Type**: Frontend Web Application
**Performance Goals**: N/A for this refactoring
**Constraints**: Zero dead code, strictly Hexagonal, dependency injected
**Scale/Scope**: Entire `src/` codebase

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **VI. Interface-First Design**: All dependencies are injected and depend on `I`-prefixed abstractions.
- **VII. Naming Conventions**: All interfaces use the `I` prefix. Adapters use descriptive suffixes.
- **VIII. Architecture**: All logic inside `src/modules/` is separated into `core`, `ports`, and `adapters`.
- **IX. No Dead Code**: Linting/static analysis guarantees no orphaned code exists.
- **X. Centralized Message Catalog**: All user-facing strings are located in `src/shared/messages/catalog.ts`.

## Project Structure

### Documentation (this feature)

```text
specs/006-align-constitution/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit-tasks command)
```

### Source Code (repository root)

```text
src/
├── main.ts
├── App.vue
├── modules/
│   └── [feature_module]/
│       ├── core/       # Business logic (zero external dependencies)
│       ├── ports/      # I-prefixed interfaces
│       └── adapters/   # Concrete implementations
├── shared/
│   └── messages/
│       └── catalog.ts  # Centralized Message Catalog (MSG_* codes)
├── stores/             # Pinia stores (inject adapters here)
├── router/             # Vue router definitions
└── styles/             # Global CSS/Tailwind
```

**Structure Decision**: A modular architecture mapped precisely to Hexagonal principles. The `src/modules/` directory acts as the boundary for individual domains, inside which the strict core/ports/adapters separation is enforced.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

*No violations. The architecture is fully compliant with the Constitution.*
