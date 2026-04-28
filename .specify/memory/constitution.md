<!-- 
Sync Impact Report:
- Version change: 1.1.0 -> 1.2.0
- Modified principles: 
  - IX. No Dead Code (Added)
- Removed sections: 
  - None
- Templates requiring updates (✅ updated / ⚠ pending):
  - d:\software\divi\divi-app\.specify\templates\plan-template.md (✅ updated - no changes required as it references constitution generically)
  - d:\software\divi\divi-app\.specify\templates\spec-template.md (✅ updated - no changes required for dead code rule)
  - d:\software\divi\divi-app\.specify\templates\tasks-template.md (✅ updated - added dead code removal validation to Phase N: Polish)
- Deferred items:
  - None
-->

# divi Constitution

## Core Principles

### I. Clarity
Prioritize readability over cleverness. Code must be interpretable by any team member without external context.

### II. Consistency
Strictly follow existing codebase patterns. Naming, formatting, and architecture must match local standards — no exceptions.

### III. Simplicity
Implement only what the current requirement demands. Break complex logic into discrete units. When in doubt, do less.

### IV. Documentation
Document the "Why," not the "What." Update comments synchronously with code changes.

### V. Walking Skeleton
Every spec covers only what enables a user to complete the primary flow end-to-end. Anything outside that flow is excluded from the MVP and listed explicitly in a `## Out of Scope` section at the end of every `spec.md`. If a spec exceeds three user stories, split it into separate features.

### VI. Interface-First Design
All dependencies between components must be expressed through abstractions — interfaces, protocols, or contracts — never through concrete implementations. A module must never know the internal details of its collaborators; it must only know their contract. Concrete implementations are injected from outside (dependency injection), never instantiated internally. This applies at every layer: services, repositories, clients, and adapters. Any code that couples directly to a concrete class where an abstraction is viable will be rejected.

### VII. Architecture
Independent business modules internally structured as Hexagonal (Ports & Adapters): the **Core** holds pure business logic with no knowledge of infrastructure; **Ports** are interfaces owned by the core defining its contracts; **Adapters** are the concrete implementations injected at the boundary. Adapters know the core — the core never knows the adapters. Modules communicate only through their public interface; internal layers are never imported across module boundaries. Shared primitives live in `shared/` with no business logic. Exceptions require inline justification.

### VIII. Naming Conventions
Interfaces must be prefixed with `I` (e.g. `IUserRepository`, `IEmailClient`). This makes the abstraction/implementation distinction immediately visible at the call site and enforces the contract-first intent of principle VI.

### IX. No Dead Code
Every file, function, and variable must have an active reference in the codebase. Any refactoring, complexity reduction, or cleanup task must include deletion of unreferenced code, backup files, and orphaned modules as part of the same commit. Code is not archived — it is removed. Version control is the backup.

## Governance

Amendments require documentation, approval, and a migration plan. All PRs/reviews must verify compliance. Complexity must be justified.

**Version**: 1.2.0 | **Ratified**: 2026-04-28 | **Last Amended**: 2026-04-28
