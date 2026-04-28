# Phase 0: Research & Decisions

## 1. Hexagonal Architecture Structure in Vue

**Decision**: Each business module under `src/modules/` will follow a strict Hexagonal layout: `core/`, `ports/`, and `adapters/`.
**Rationale**: Aligns exactly with Constitution Principle VIII. Core domain logic remains pure. Ports define the interfaces (prefixed with `I`). Adapters implement these interfaces (e.g., using Supabase or Dexie).
**Alternatives considered**: 
- Flat module structure: Rejected as it violates the separation of concerns demanded by Hexagonal.
- Global `src/core`, `src/adapters` etc: Rejected because Constitution Principle VIII dictates "Independent business modules internally structured as Hexagonal".

## 2. Centralized Message Catalog

**Decision**: Implement a static dictionary in `src/shared/messages/catalog.ts` exporting a `messages` object, mapping `MSG_E_*`, `MSG_S_*`, `MSG_A_*`, and `MSG_I_*` to their respective strings. For parameterized messages, a lightweight utility function `formatMessage(code, params)` will be used.
**Rationale**: Aligns with Constitution Principle X. A TypeScript object is lightweight, type-safe, and easily refactored.
**Alternatives considered**:
- Full i18n library (e.g., `vue-i18n`): Overkill for a single-language app currently, per the "Out of Scope" section in the spec.

## 3. Dependency Injection Mechanism

**Decision**: Use Vue's built-in `provide/inject` system at the root level (`main.ts`) to inject adapter implementations into Vue components or Pinia stores.
**Rationale**: It is the native Vue way to achieve DI. This prevents components from directly importing concrete adapters, satisfying Principle VI.
**Alternatives considered**:
- Heavy DI containers (e.g., `InversifyJS`, `tsyringe`): Rejected due to added complexity and bundle size.
- Direct instantiation in Pinia: Rejected as it couples the stores to concrete implementations.
