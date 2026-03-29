---

description: "Task list template for feature implementation based on Vertical Slicing and Clean Architecture"
---

# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks follow the Vertical Slicing structure (`domain`, `application`, `infrastructure`, `ui`).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Paths: `src/modules/[feature]/[layer]/[file]`
- Shared: `src/shared/components/[atomic-level]/[file]`
- Global: `src/core/[file]`

---

## Phase 1: Setup & Domain (Contratos)

**Purpose**: Definição da lógica de negócio e interfaces (Padrão Repositório)

- [ ] T001 [P] Create Domain Entities in `src/modules/[feature]/domain/entities/`
- [ ] T002 [P] Create Repository Interfaces in `src/modules/[feature]/domain/repositories/`
- [ ] T003 [P] Create Domain Exceptions/Errors

---

## Phase 2: Application Layer (Business Logic / State)

**Purpose**: Implementação de casos de uso e gerenciamento de estado (Pinia)

- [ ] T004 Create Pinia Store in `src/modules/[feature]/application/stores/`
- [ ] T005 [P] Implement Use Cases / Services in `src/modules/[feature]/application/services/`
- [ ] T006 Configure Dependency Injection (DI) registration for this module in `src/core/di/`

---

## Phase 3: Infrastructure (Data Access)

**Purpose**: Implementação concreta dos repositórios usando Supabase

- [ ] T007 Implement Supabase Repository in `src/modules/[feature]/infrastructure/repositories/`
- [ ] T008 [P] Add necessary RPC/Database migrations or configurations

---

## Phase 4: UI Layer (Feature Components)

**Purpose**: Implementação dos componentes específicos da feature e páginas

- [ ] T009 [P] Create Atomic Components in `src/shared/components/` (se genérico)
- [ ] T010 [P] Create Feature-specific Components in `src/modules/[feature]/ui/components/`
- [ ] T011 Create Feature Page/View in `src/modules/[feature]/ui/views/`
- [ ] T012 Configure Routing in `src/core/router/`

---

## Phase 5: Testing (Optional)

**Purpose**: Verificação unitária e de integração seguindo os contratos

- [ ] T013 [P] Unit tests for Domain Entities
- [ ] T014 [P] Unit tests for Pinia Store (Application)
- [ ] T015 [P] Integration tests for Repository (Infrastructure) using mocks/test DB

---

## Dependencies & Execution Order

- **Domain First**: Define contracts before implementation
- **DI Registration**: Must resolve interfaces to implementations
- **Infrastructure Implementation**: Must match Domain contracts
- **UI Last**: Depends on Application/State logic

---
