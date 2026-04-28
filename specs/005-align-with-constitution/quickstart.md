# Quickstart: Aligning with Constitution

This guide explains how to maintain the project's architectural integrity following the refactoring.

## 1. Creating a New Module
1. Create the directory: `src/modules/[module-name]`.
2. Define subdirectories: `core/`, `core/ports/`, `adapters/`.
3. Define interfaces in `core/ports/` (prefixed with `I`).
4. Implement business logic in `core/` using those interfaces.
5. Implement concrete adapters in `adapters/`.

## 2. Dependency Injection
1. Add the new interface token to `src/core/di-tokens.ts`.
2. Instantiate and register the adapter in `src/core/di.ts`.
3. Inject the dependency via constructor in other services.
4. Use `useService(DI_TOKENS.I...)` in Vue components.

## 3. Maintenance
- **No Dead Code**: Run `npx knip` regularly and remove any reported unused code.
- **Hexagonal Integrity**: Do not import from `adapters/` or `core/` across different modules. Only import from `core/ports/`.
