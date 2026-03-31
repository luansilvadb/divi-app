# Implementation Plan: Refatoração do Módulo Finance para Fatiamento Vertical

**Branch**: `001-refactor-finance-vertical-slice` | **Date**: 30/03/2026 | **Spec**: [specs/001-refactor-finance-vertical-slice/spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-refactor-finance-vertical-slice/spec.md`

## Summary

Desacoplamento do módulo monolítico `finance` em módulos independentes e autossuficientes em `src/modules/` (ex: `transactions`, `budgets`, `dashboard`). A arquitetura seguirá o fatiamento vertical estrito com camadas de `domain`, `application`, `infrastructure` e `ui`. Entidades e contratos compartilhados serão centralizados em `src/shared/domain`.

## Technical Context

**Language/Version**: Vue 3 (Composition API), TypeScript (Strict Mode)
**Primary Dependencies**: Pinia, Vite, TailwindCSS
**Storage**: Supabase (SDK / RPC), Dexie (Local Persistence)
**Testing**: Vitest (Unit/Component), Playwright (E2E)
**Target Platform**: Web
**Project Type**: Feature-Driven Clean Architecture (Vertical Slicing)
**Performance Goals**: Paridade funcional com o sistema atual; redução de acoplamento circular para zero.
**Constraints**: Injeção de Dependência (DI) obrigatória, Atomic Design para componentes em `src/shared/`.
**Scale/Scope**: Refatoração de 10 funcionalidades principais e remoção total do diretório `src/modules/finance`.

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
specs/001-refactor-finance-vertical-slice/
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
├── core/                # Infra global (DI registration, themes, base configs)
├── shared/              # Recursos transversais
│   ├── domain/          # Entidades e Contratos compartilhados (Ex: Transaction, Wallet)
│   └── components/      # Atomic Design (átomos, moléculas, organismos)
└── modules/
    ├── dashboard/       # Agregador de dados (US1)
    ├── transactions/    # Gestão de transações (US1)
    ├── budgets/         # Controle de orçamentos (US1)
    ├── ...              # Outras fatias independentes
```

**Structure Decision**: A estrutura segue a arquitetura de fatiamento plano em `src/modules/`, eliminando a pasta `finance`.

## Complexity Tracking

*No violations detected.*
