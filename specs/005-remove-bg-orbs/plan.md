# Implementation Plan: Remove Background Orbs Effect

**Branch**: `005-remove-bg-orbs` | **Date**: 2026-03-29 | **Spec**: [specs/005-remove-bg-orbs/spec.md](D:\software\divi\specs\005-remove-bg-orbs\spec.md)

## Summary
The goal is to remove the "floating gradient orbs" effect globally from the application. The strategy involves emptying the `BaseBackgroundOrbs.vue` template for an immediate global effect, followed by a systematic cleanup of all views that import and use the component. This ensures visual consistency and removes dead code.

## Technical Context
**Language/Version**: Vue 3 (Composition API), TypeScript (Strict Mode)
**Primary Dependencies**: Vite, TailwindCSS
**Storage**: N/A
**Testing**: Vitest, Playwright
**Target Platform**: Web
**Project Type**: Feature-Driven Clean Architecture (Vertical Slicing)
**Performance Goals**: Reduction in DOM nodes and CSS animations
**Constraints**: Atomic Design (component cleanup)
**Scale/Scope**: Affects 8 views across the finance module and one shared atom component

## Constitution Check

- [x] I. Feature-Driven Clean Architecture: N/A (Shared component cleanup)
- [x] II. Domínio como Fonte da Verdade: N/A
- [x] III. Infraestrutura e Padrão Repositório: N/A
- [x] IV. Injeção de Dependência: N/A
- [x] V. Atomic Design e Shared Resources: Componentes genéricos em `src/shared/`? (Yes, `BaseBackgroundOrbs.vue`)
- [x] Tecnologias: Vue 3, Pinia, Supabase, TypeScript? (Yes)
- [x] Proibição: Sem serviços/repositórios horizontais globais? (Yes)

## Project Structure

### Documentation (this feature)
```text
specs/005-remove-bg-orbs/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # To be created next
```

### Source Code (repository root)
```text
src/
├── shared/              # Atomic Design (atoms)
└── modules/
    └── finance/         # Views to be cleaned up
        └── ui/
            └── views/
```

**Structure Decision**: The changes are localized to `src/shared/components/atoms/` and `src/modules/finance/ui/views/`.
