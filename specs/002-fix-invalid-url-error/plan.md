# Implementation Plan: Fix Invalid URL Error for Data URIs

**Branch**: `002-fix-invalid-url-error` | **Date**: 2026-03-30 | **Spec**: [specs/002-fix-invalid-url-error/spec.md]
**Input**: Feature specification from `/specs/002-fix-invalid-url-error/spec.md`

## Summary

O objetivo é eliminar o erro `net::ERR_INVALID_URL` no console do navegador disparado por Data URIs malformadas ou problemáticas, especialmente durante a inicialização das stores do Pinia (`dashboard` e `transactions`). A abordagem técnica envolve mover ativos estáticos de arquivos CSS para arquivos físicos em `/public`, implementar um utilitário de sanitização para URIs dinâmicas e garantir fallbacks seguros para todos os ativos visuais.

## Technical Context

**Language/Version**: Vue 3 (Composition API), TypeScript (Strict Mode)
**Primary Dependencies**: Pinia, Vite
**Storage**: Supabase (SDK / RPC), Dexie (Local Persistence)
**Testing**: Vitest, Playwright
**Target Platform**: Web
**Project Type**: Feature-Driven Clean Architecture (Vertical Slicing)
**Performance Goals**: Data URIs < 128KB, 0 console errors during store installation
**Constraints**: Injeção de Dependência (DI), Atomic Design, Sanitização Rigorosa
**Scale/Scope**: Componentes globais (Sidebar), Views de Dashboard e Transactions

## Constitution Check

- [x] I. Feature-Driven Clean Architecture: Feature em `src/modules/<feature>/`? (Fixes aplicados em `shared` e utilitários)
- [x] II. Domínio como Fonte da Verdade: Contratos e Interfaces em `domain/`?
- [x] III. Infraestrutura e Padrão Repositório: Acesso a dados em `infrastructure/`?
- [x] IV. Injeção de Dependência: Camadas conectadas via DI?
- [x] V. Atomic Design e Shared Resources: Componentes genéricos em `src/shared/`?
- [x] Tecnologias: Vue 3, Pinia, Supabase, TypeScript?
- [x] Proibição: Sem serviços/repositórios horizontais globais?

## Project Structure

### Documentation (this feature)

```text
specs/002-fix-invalid-url-error/
├── plan.md              # Este arquivo
├── research.md          # Pesquisa e análise da causa raiz
├── data-model.md        # Definição de entidades (Asset)
├── quickstart.md        # Guia de boas práticas para ativos
├── contracts/           # Contratos de serviços de ativos (se aplicável)
└── tasks.md             # Tarefas de implementação
```

### Source Code (repository root)

```text
src/
├── core/                # Registro de novos utilitários no DI (se necessário)
├── shared/
│   ├── components/      # Refatoração do AppSidebar para usar ativos físicos
│   └── utils/           # Novo utilitário asset-loader.ts
└── modules/             # Nenhuma alteração estrutural nos módulos
```

**Structure Decision**: A estrutura mantém o isolamento, focando as correções nos componentes compartilhados (`shared`) e introduzindo um utilitário transversal para validação de ativos.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Nenhuma | N/A | N/A |



---
