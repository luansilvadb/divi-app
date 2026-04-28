# Feature Specification: Align Project with Constitution

**Feature Branch**: `006-align-constitution`  
**Created**: 2026-04-28  
**Status**: Draft  
**Input**: User description: "Refatore o projeto para que esteja totalmente alinhado com as diretrizes definidas em @.specify/memory/constitution.md, garantindo consistência estrutural, padrões de código e boas práticas descritas no documento."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Apply Hexagonal Architecture & Interface-First Design (Priority: P1)

As a developer maintaining the codebase, I want all business logic isolated in the core and dependencies injected via ports/adapters so that the codebase remains decoupled, testable, and adheres to principles VI, VII, and VIII.

**Why this priority**: Structural integrity is the foundation of the project. If the architecture is flawed, the rest of the rules are harder to enforce.

**Independent Test**: Can be fully tested by verifying that domain core files have zero imports from infrastructure or external libraries, and that all services depend only on `I`-prefixed interfaces.

**Acceptance Scenarios**:

1. **Given** the current project structure, **When** reviewing the core domain modules, **Then** there are no external dependencies or concrete implementations instantiated inside the core.
2. **Given** any external adapter (e.g., database, email), **When** verifying its naming and usage, **Then** it implements an `I`-prefixed port and is injected rather than instantiated directly.

---

### User Story 2 - Implement Centralized Message Catalog (Priority: P2)

As a user and developer, I want all user-facing strings centralized in a message catalog so that messages are consistent, easily updatable, and conform to principle X.

**Why this priority**: Hardcoded strings are brittle and scatter business logic. Centralizing them is a prerequisite for a maintainable presentation layer.

**Independent Test**: Can be fully tested by verifying that no user-facing string literals exist in business logic or handlers, and instead reference `MSG_*` codes.

**Acceptance Scenarios**:

1. **Given** a validation error or success response, **When** the code emits the message, **Then** it uses a semantic code like `MSG_E_...` or `MSG_S_...` from the central catalog.
2. **Given** parameterized feedback (e.g., "Field {field} is required"), **When** the catalog is used, **Then** placeholders are populated dynamically without string concatenation.

---

### User Story 3 - Eliminate Dead Code (Priority: P3)

As a developer, I want all unused files, functions, and variables removed from the codebase so that the project remains lean and adheres to principle IX.

**Why this priority**: Unused code creates noise and confusion. It should be cleaned up after architectural and string externalization refactoring.

**Independent Test**: Can be fully tested by running a static analysis tool (e.g., `ts-prune` or ESLint `no-unused-vars`) and finding zero orphaned references.

**Acceptance Scenarios**:

1. **Given** the refactored codebase, **When** static analysis is run, **Then** zero unused files or variables are reported.
2. **Given** an old implementation replaced during refactoring, **When** the commit is finalized, **Then** the old code is entirely deleted, not commented out or archived.

### Edge Cases

- What happens when an external library forces a concrete class instantiation? (Adapter layer must wrap it).
- How does the system handle messages that don't fit the standard categories? (Must be categorized into Information, Alert, Success, or Error, or the catalog design must be amended).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST have all interfaces prefixed with `I` (e.g., `IUserRepository`) and concrete implementations using descriptive suffixes.
- **FR-002**: System MUST separate all modules into Hexagonal structure: Core (pure logic), Ports (interfaces), Adapters (implementations).
- **FR-003**: System MUST NOT allow internal layers to be imported across module boundaries; communication is strictly via public interfaces.
- **FR-004**: System MUST centralize all user-facing strings in a single catalog using `MSG_E`, `MSG_S`, `MSG_A`, and `MSG_I` codes.
- **FR-005**: System MUST NOT use string concatenation for parameterized messages; named placeholders must be used.
- **FR-006**: System MUST remove all dead code (unreferenced files, functions, variables) across the entire project.

### Key Entities *(include if feature involves data)*

- **Message Catalog**: The central repository (object/file) storing all standardized strings with their respective `MSG_*` keys.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of domain logic files have zero imports from external adapter or infrastructure libraries.
- **SC-002**: 100% of user-facing messages are sourced from the centralized message catalog.
- **SC-003**: Static analysis reports 0 unused exports, files, or variables in the project.
- **SC-004**: All interface declarations start with `I`.

## Assumptions

- The project uses TypeScript.
- The existing domain logic is covered by tests that can verify refactoring hasn't broken functionality.
- The i18n library or string interpolation mechanism is either already present or can be easily introduced as a lightweight utility.
- All team members are aligned with the constitution changes.

## Out of Scope *(mandatory)*

- Adding new product features or altering existing business rules.
- Upgrading frameworks (e.g., React, Express, etc.) unless strictly necessary to fix typing issues.
- Setting up a complete localization/translation system (multiple languages), only the centralized catalog in the primary language is required for now.
