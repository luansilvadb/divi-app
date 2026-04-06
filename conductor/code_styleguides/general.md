# General Code Style Constitution

## Core Principles

### I. Readability
Code must be written first and foremost to be easily read and understood by human developers. Overly clever, "golfed", or obscure constructs are strictly prohibited. If a choice must be made between machine-level micro-optimizations and human readability, readability wins. 

### II. Consistency
All new code must follow established patterns within the existing codebase. Developers must maintain strict consistency in formatting, naming conventions, and structural organization. When moving between different languages and frameworks, apply their respective community standards consistently.

### III. Simplicity
Always prefer simple, straightforward solutions over complex, over-engineered ones (KISS principle - Keep It Simple, Stupid). Complex problems must be systematically broken down into smaller, isolated, and easily manageable components. YAGNI (You Aren't Gonna Need It) applies—do not build for hypothetical future use cases.

### IV. Maintainability
Code must be designed for easy modification and safe extension. Systems must be written to minimize external dependencies and reduce architectural coupling. High cohesion and low coupling are required to ensure that a change in one domain does not silently break another.

### V. Intent-Driven Documentation
Documentation is mandatory and must explain the *why* (context, business logic, and architectural reasoning), not just the *what* (the mechanics of the code). All documentation, comments, and readmes must be updated concurrently with the code changes they describe. Outdated documentation is treated as a critical bug.

## Architectural & Structural Standards

To enforce maintainability and decoupled code, all projects must adhere to a **Feature-Based Modular Architecture** powered by strict **Dependency Injection**. The codebase must be systematically divided into the following directories/layers:

*   **Core:** Contains application-wide singletons, global configurations, startup/bootstrapping logic, and core infrastructure bindings (e.g., authentication services, HTTP client configurations). *Constraint:* The Core layer must only be imported at the root level or injected into features.
*   **Shared:** Contains highly reusable, domain-agnostic components, utilities, design system elements, and generic helpers. *Constraint:* The Shared layer is completely isolated; it must **never** import from `Core` or `Features`.
*   **Features:** Contains vertical slices of the application divided by business domain. Each feature is encapsulated, containing its own models, UI components, and business logic. *Constraint:* Features may import from `Shared` and rely on injected `Core` services, but tight coupling between sibling Features is strictly prohibited.
*   **Dependency Injection (DI):** Inversion of Control (IoC) is mandatory. Hardcoding dependencies (e.g., `new DatabaseService()`) inside business logic is forbidden. All services, repositories, and configurations must be injected (via constructors or framework DI containers) to ensure modules remain easily testable, mockable, and independently verifiable.

## Development Workflow & Review Process

1. **Self-Review:** Before submitting a Pull Request, the author must perform a self-review specifically checking against the Core Principles and verifying structural boundaries (Core/Shared/Features).
2. **Peer Review:** Reviewers must block PRs that violate Readability, Simplicity, or Architectural boundaries (e.g., a Feature importing another Feature directly, or missing Dependency Injection), even if the code passes all automated tests.
3. **Refactoring:** Refactoring for the sake of alignment with this constitution is highly encouraged, provided it is submitted in a separate, isolated PR from feature work.

## Governance

- **Authority:** This Constitution supersedes all individual developer preferences, localized team practices, or legacy patterns. 
- **Enforcement:** All Pull Requests and peer reviews must strictly verify compliance with these principles. Complexity or breaking of architectural boundaries must be heavily justified in the PR description and explicitly approved by technical leadership.
- **Amendments:** Changes to this document require team consensus, a formal proposal, and an accompanying plan for adopting the new style across the codebase.

**Version**: 1.1.0 | **Ratified**: 2023-10-24 | **Last Amended**: 2023-10-24
