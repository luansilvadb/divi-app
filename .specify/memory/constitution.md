<!-- 
Sync Impact Report:
- Version change: 1.3.0 -> 1.4.0
- Modified principles: 
  - None
- Added sections:
  - XI. Test-Driven Development
  - XII. Typed Domain Errors
  - XIII. Logging & Tracing
  - XIV. Validation Layer
  - XV. Migrations
- Removed sections: 
  - None
- Templates requiring updates (✅ updated / ⚠ pending):
  - .specify/templates/plan-template.md (✅ updated - no changes required as it references constitution generically)
  - .specify/templates/spec-template.md (✅ updated - no changes required for new rules)
  - .specify/templates/tasks-template.md (✅ updated - added references to Principles XI-XV)
- Deferred items:
  - None
-->

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

### VII. Naming Conventions
Abstractions and their implementations must be named so the distinction is immediately legible at the point of use, following the conventions of the project's language and ecosystem. In TypeScript, interfaces are prefixed with `I` (e.g. `IUserRepository`, `IEmailClient`) and their concrete implementations carry a descriptive suffix (e.g. `PostgresUserRepository`, `SendGridEmailClient`). This convention enforces the contract-first intent of principle VI at the naming level.

### VIII. Architecture
Independent business modules internally structured as Hexagonal (Ports & Adapters): the **Core** holds pure business logic with no knowledge of infrastructure; **Ports** are interfaces owned by the core defining its contracts; **Adapters** are the concrete implementations injected at the boundary. Adapters know the core — the core never knows the adapters. Modules communicate only through their public interface; internal layers are never imported across module boundaries. Shared primitives live in `shared/` with no business logic. Exceptions require inline justification.

### IX. No Dead Code
Every file, function, and variable must have an active reference in the codebase. Any refactoring, complexity reduction, or cleanup task must include deletion of unreferenced code, backup files, and orphaned modules as part of the same commit. Code is not archived — it is removed. Version control is the backup.

### X. Centralized Message Catalog
All user-facing strings — validation messages, error feedback, success confirmations, alerts, and notifications — live in a single central resource file. No user-facing string may be hardcoded inside business logic or any application entry point (route handlers, command handlers, event listeners, or UI components). Every message has a semantic code that encodes its category and sequence:

- `MSG_E` — validation and domain errors
- `MSG_S` — success confirmations
- `MSG_A` — alerts and warnings
- `MSG_I` — informational messages

Parameterized messages use named placeholders following the convention of the project's i18n library (e.g. `{field}`, `{min}`, `{max}`) — never string concatenation. The code is the stable contract; the message text may be updated, translated, or adjusted without touching logic. Any string that a user can read must be traceable to this catalog.

### XI. Test-Driven Development
Tests are written before the implementation they validate. No production code is introduced without a failing test that justifies its existence. The test pyramid governs where each test lives:

- **Unit** — Core logic only. No I/O, no framework, no database. Dependencies are replaced with in-memory fakes or mocks via the interfaces defined in principle VI. Fast, isolated, deterministic.
- **Integration** — Adapters and their boundaries. Validates that a concrete implementation (repository, HTTP client, message consumer) behaves correctly against the real infrastructure it wraps.
- **End-to-End** — Full user flows only. Covers the primary path and the most critical failure paths. Not a substitute for the layers above.

Test files live alongside the code they test, not in a separate top-level folder. A feature is not complete until its tests pass at all three levels relevant to its scope.

### XII. Typed Domain Errors
Errors are first-class domain citizens. Every module defines its own typed error hierarchy — generic or untyped error propagation is not permitted. Error types carry semantic meaning that reflects the domain, not the infrastructure (e.g. `OrderNotFoundException`, `InsufficientStockError`, `InvalidCouponError`). Error codes follow the same catalog convention as messages in principle X (e.g. `ERR_E001`). No module propagates a raw string, a generic base error, or an infrastructure error directly to its callers — infrastructure errors are caught at the adapter boundary and translated into domain errors before crossing into the core.

### XIII. Logging & Tracing
The logger is a dependency injected via interface — `console.*` is never used in production code. Every log entry is structured (key-value or JSON) and includes at minimum: timestamp, severity level, module name, operation name, and correlation ID. Severity levels are used with discipline: `debug` for development detail, `info` for significant state transitions, `warn` for recoverable anomalies, `error` for failures that require attention. Log entries never contain sensitive data (passwords, tokens, PII). A correlation ID must be propagated across every operation that spans more than one module or service, making the full trace of a request reconstructable from logs alone.

### XIV. Validation Layer
Validation is split into two distinct responsibilities that must never be mixed:

- **Structural validation** — type, format, presence, and shape of incoming data. Belongs exclusively at the entry point (adapter boundary): route handlers, command handlers, event consumers. Rejected here before the data ever reaches the Core. Uses the validation library of the ecosystem (e.g. class-validator, zod) and returns errors from the message catalog (principle X).
- **Business rule validation** — invariants, domain constraints, and contextual rules (e.g. "a user cannot place an order with zero items"). Belongs exclusively in the Core. Never duplicated at the adapter boundary.

No validation logic lives in shared utilities, base classes, or middleware unless it is structural and applies universally across all entry points. A validator that queries the database is a business rule — it belongs in the Core, not at the entry boundary.

### XV. Migrations
Database migrations are immutable artifacts. Once a migration has been applied to any environment, it must never be edited, renamed, or deleted — changes to an existing schema are always expressed as a new migration. Every migration must be reversible: a rollback path is mandatory and must be validated before the migration is considered complete. Migrations contain only structural changes (DDL/DML) — no business logic, no data transformations that belong in the domain, and no references to application-layer constructs. The database schema is the source of truth for data structure; the application code adapts to it, not the other way around. Migration files are committed in the same pull request as the application code that depends on them — schema and code changes are never shipped independently.

## Governance

Amendments require documentation, approval, and a migration plan. All PRs/reviews must verify compliance. Complexity must be justified.

**Version**: 1.4.0 | **Ratified**: 2026-04-28 | **Last Amended**: 2026-04-28
