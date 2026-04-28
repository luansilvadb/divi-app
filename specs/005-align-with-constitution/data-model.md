# Architectural Data Model: Aligning with Constitution

This refactoring focuses on architectural entities as defined in the project's constitution.

## Entities

### 1. IAbstractions (Interfaces)
- **Definition**: Pure contracts defining the behavior required by a module.
- **Naming**: MUST be prefixed with `I` (e.g., `IWalletRepository`, `IAuthService`).
- **Location**: `src/modules/[module]/core/ports/`.

### 2. Core Logic
- **Definition**: Pure business rules and use cases.
- **Dependencies**: MUST only depend on other Core entities or internal Ports (Interfaces).
- **Location**: `src/modules/[module]/core/`.

### 3. Adapters
- **Definition**: Concrete implementations of Ports.
- **Types**:
  - **Inbound**: UI components, API controllers (trigger core logic).
  - **Outbound**: Database repositories, external API clients (called by core logic).
- **Location**: `src/modules/[module]/adapters/`.

### 4. Composition Root (DI)
- **Definition**: The single place where concrete implementations are instantiated and wired together.
- **Location**: `src/core/di.ts`.
