# Research: Aligning Project with Constitution

## Decision: Manual Vanilla DI Patterns
- **Standard**: All cross-module dependencies MUST be expressed through interfaces prefixed with `I`.
- **Mechanism**: Use the existing `src/core/di.ts` as the Composition Root.
- **Enforcement**: 
  - All services must use constructor injection.
  - Vue components will use the `useService(DI_TOKENS.IServiceName)` helper.
  - Pinia stores will receive dependencies via initialization or through a resolver.
- **Rationale**: Manual constructor injection is the most transparent and testable way to manage dependencies without relying on complex DI frameworks, aligning with Principle VI.

## Decision: Dead Code Elimination
- **Tool**: `npx knip` will be used to identify unused files, exports, and dependencies.
- **Workflow**:
  1. Run `npx knip`.
  2. Analyze the report.
  3. Delete identified unreferenced code.
  4. Rerun to ensure no cascading dead code remains.
- **Rationale**: Strict adherence to Principle IX (No Dead Code) keeps the cognitive load low and the codebase lean.

## Decision: Module Reorganization (Hexagonal)
- **Mapping**:
  - `src/modules/[name]/domain` -> `src/modules/[name]/core` (Entities)
  - `src/modules/[name]/application` -> `src/modules/[name]/core` (Use cases/Services)
  - `src/modules/[name]/ports` -> `src/modules/[name]/core/ports` (Interfaces)
  - `src/modules/[name]/infrastructure` -> `src/modules/[name]/adapters` (Concrete implementations)
- **Communication**: Modules must only interact through interfaces defined in `ports`. No direct imports of internal module layers across boundaries.
- **Rationale**: Enforces Principle VII (Hexagonal Architecture) and ensures business logic remains pure.

## Decision: Interface Naming
- **Standard**: All interfaces MUST be prefixed with `I`.
- **Action**: Rename existing interfaces (e.g., `UserRepository` -> `IUserRepository`) and extract interfaces for concrete classes used as dependencies.
- **Rationale**: Aligns with Principle VIII, making abstractions immediately identifiable.

## Alternatives Considered
- **Automatic DI Container**: Rejected to avoid "magic" and maintain Principle I (Clarity) and III (Simplicity).
- **Archiving dead code**: Rejected; Principle IX explicitly states "Code is not archived — it is removed."
