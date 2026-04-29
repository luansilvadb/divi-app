# Research & Decisions: Codebase Refactoring and Cleanup

## Topic 1: Dead Code Identification

**Context**: The project needs to systematically identify unused files, exports, variables, and imports.

**Decision**: Use `knip` (already in the project ecosystem) combined with `eslint`'s unused-vars rules.
**Rationale**: `knip` is specifically designed for finding dead code, unused dependencies, and orphaned files in TypeScript projects. ESLint handles local unused variables effectively.
**Alternatives considered**: Manual search (error-prone and time-consuming), `ts-prune` (less comprehensive than knip).

## Topic 2: Cyclomatic Complexity Tracking

**Context**: Functions with excessive branching paths need to be identified and simplified.

**Decision**: Use ESLint's `complexity` rule temporarily configured to a strict threshold (e.g., 10) to flag complex functions, then refactor them.
**Rationale**: ESLint is already part of the project. Temporarily adjusting the rule provides a clear, actionable list of targets without needing new dependencies.
**Alternatives considered**: SonarQube (too heavy for this targeted cleanup phase), manual inspection (subjective and slow).

## Topic 3: Safe Refactoring Verification

**Context**: Ensuring no regressions occur during aggressive cleanup.

**Decision**: Rely strictly on the existing Vitest test suite (`npm run test`) and TypeScript compiler (`npm run build:typecheck`).
**Rationale**: The test suite is robust, and the project enforces 100% test pass rate. If the tests pass and the types compile, the refactoring is deemed safe according to project principles.
**Alternatives considered**: Visual regression testing (unnecessary as UI behavior isn't changing), manual QA (too slow, violates automated testing principle).
