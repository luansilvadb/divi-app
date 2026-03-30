# Implementation Plan: Standardize UI Design System

**Branch**: `004-standardize-ui-consistency` | **Date**: 2026-03-29 | **Spec**: [specs/004-standardize-ui-consistency/spec.md]
**Input**: Feature specification from `/specs/004-standardize-ui-consistency/spec.md`

## Summary

Standardize the entire application UI/UX using the "Budgets" screen as the "Holy Grail" reference. This involves refactoring existing views (Dashboard, Transactions, etc.) to use a unified layout structure, shared atomic components, and centralized data formatting utilities, ensuring visual consistency and code reusability across all modules.

## Technical Context

**Language/Version**: Vue 3 (Composition API), TypeScript (Strict Mode)
**Primary Dependencies**: Pinia, Vite, TailwindCSS
**Storage**: Supabase (SDK / RPC)
**Testing**: Vitest, Playwright
**Target Platform**: Web
**Project Type**: Feature-Driven Clean Architecture (Vertical Slicing)
**Performance Goals**: 60fps animations, < 2s initial load, responsive layout (1100px breakpoint)
**Constraints**: Injeção de Dependência (DI), Atomic Design, Tailwind CSS variables
**Scale/Scope**: Refactoring ~6 main feature views and extract ~5-8 shared components.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] I. Feature-Driven Clean Architecture: Feature em `src/modules/<feature>/`?
- [x] II. Domínio como Fonte da Verdade: Contratos e Interfaces em `domain/`?
- [x] III. Infraestrutura e Padrão Repositório: Acesso a dados em `infrastructure/`?
- [x] IV. Injeção de Dependência: Camadas conectadas via DI (sem Unit of Work no FE)?
- [x] V. Atomic Design e Shared Resources: Componentes genéricos em `src/shared/`?
- [x] Tecnologias: Vue 3, Pinia, Supabase, TypeScript?
- [x] Proibição: Sem serviços/repositórios horizontais globais (`src/services` ou `src/repositories`)?

## Project Structure

### Documentation (this feature)

```text
specs/004-standardize-ui-consistency/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── core/                # Infra global (DI registration, themes, base configs)
├── shared/              # Atomic Design (atoms, molecules, organisms genéricos)
└── modules/
    └── [feature]/       # Feature fatiada verticalmente
        ├── domain/      # Entidades, Contratos (Interfaces Repositório)
        ├── application/ # Stores (Pinia), Casos de Uso
        ├── infrastructure/ # Implementação de Repositórios (Supabase SDK)
        └── ui/          # Componentes de UI específicos da feature
```

**Structure Decision**: A estrutura segue rigorosamente o fatiamento vertical em `src/modules/[feature]/`. O reuso visual será garantido via `src/shared/`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., Global Service] | [current need] | [why module-specific insufficient] |


---
