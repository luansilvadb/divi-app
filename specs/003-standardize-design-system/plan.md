# Implementation Plan: Standardize UI Components based on Budgets screen

**Branch**: `003-standardize-design-system` | **Date**: 2026-03-29 | **Spec**: [specs/003-standardize-design-system/spec.md](D:\software\divi\specs\003-standardize-design-system\spec.md)
**Input**: Feature specification from `/specs/003-standardize-design-system/spec.md`

## Summary

The goal of this feature is to standardize the application's UI components and styles based on the "Budgets" screen, which is considered the "Holy Grail" of UI/UX for this project. The approach involves extracting common patterns (Glassmorphism, hover effects, icon containers, progress bars) into shared atomic components in `src/shared/components` and then refactoring existing views to use these standardized components.

## Technical Context

**Language/Version**: Vue 3 (Composition API), TypeScript (Strict Mode)
**Primary Dependencies**: Pinia, Vite, Tailwind CSS
**Storage**: Supabase (SDK / RPC)
**Testing**: Vitest, Playwright
**Target Platform**: Web
**Project Type**: Feature-Driven Clean Architecture (Vertical Slicing)
**Performance Goals**: Maintaining fast rendering with Glassmorphism effects (optimize backdrop-filter usage).
**Constraints**: Injeção de Dependência (DI), Atomic Design
**Scale/Scope**: All screens in the `finance` module (Dashboard, Transactions, Budgets, Goals, Loans, etc.).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] I. Feature-Driven Clean Architecture: Feature em `src/modules/<feature>/`? (Standardizing shared UI used by all modules)
- [x] II. Domínio como Fonte da Verdade: Contratos e Interfaces em `domain/`? (Contracts for UI in `contracts/`)
- [x] III. Infraestrutura e Padrão Repositório: Acesso a dados em `infrastructure/`? (N/A for UI refactor)
- [x] IV. Injeção de Dependência: Camadas conectadas via DI (sem Unit of Work no FE)? (N/A for UI refactor)
- [x] V. Atomic Design e Shared Resources: Componentes genéricos em `src/shared/`? (YES, main goal)
- [x] Tecnologias: Vue 3, Pinia, Supabase, TypeScript? (YES)
- [x] Proibição: Sem serviços/repositórios horizontais globais (`src/services` ou `src/repositories`)? (YES)

## Project Structure

### Documentation (this feature)

```text
specs/003-standardize-design-system/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output (UI tokens & components)
├── quickstart.md        # Phase 1 output (Usage guide)
├── contracts/           # Phase 1 output (UI component interfaces)
│   └── themes.md
└── tasks.md             # Phase 2 output (To be created)
```

### Source Code (repository root)

```text
src/
├── core/                # Infra global (DI registration, themes, base configs)
├── shared/              # Atomic Design (atoms, molecules, organisms genéricos)
│   └── components/
│       ├── atoms/       # BaseBadge, BaseProgressBar, BaseIconBox
│       ├── molecules/   # BaseSummaryItem
│       └── organisms/   # BaseViewHeader
└── modules/
    └── finance/         # Refactored to use shared components
        └── ui/
            ├── components/ # Local components updated to use shared ones
            └── views/      # Views updated to use shared components
```

**Structure Decision**: The shared UI library follows the Atomic Design principles in `src/shared/components/`, while features in `src/modules/` are updated to consume these resources.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
