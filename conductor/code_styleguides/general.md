# Code Style Constitution

## Core Principles

### I. Human-Centric Clarity
Prioritize readability over algorithmic cleverness. Avoid obscure constructs or shorthand that obscures intent. Code must be interpretable by any team member without external context.

### II. Pattern Determinism
Strictly adhere to existing codebase patterns. Formatting, naming conventions, and architectural structures must remain consistent with established local standards to ensure a unified logic flow.

### III. Atomic Simplicity
Prefer the simplest viable solution. Break complex logic into discrete, manageable units. Reject over-engineering; implement only what is necessary for the current requirement (YAGNI).

### IV. Modular Maintainability
Design for change. Minimize coupling and external dependencies. Ensure components are extensible and modifiable with minimal impact on the broader system architecture.

### V. Intent-Based Documentation
Document the "Why," not the "What." Logic justifications must be recorded; assume the code itself explains the execution. Update documentation synchronously with code changes to prevent technical debt.

## Technical Constraints
All code must pass static analysis and linting protocols defined in the root configuration before submission. Modular boundaries must be enforced to prevent circular dependencies.

## Quality Assurance
Every PR must be validated against these five principles. Code that introduces unnecessary complexity or deviates from established naming patterns will be rejected during peer review.

## Governance
This Constitution supersedes individual preferences. Amendments require consensus and must be reflected in the automated linting rules where applicable.
