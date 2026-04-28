# Phase 0: Research

## Unknowns Resolved

All context variables have been successfully defined.

## Best Practices & Tools for Refactoring

### 1. Identifying Dead Code
- **Decision**: Use `knip` configured in the project (`knip.json`).
- **Rationale**: `knip` is extremely efficient at finding unused files, exports, and dependencies in TypeScript/Node projects. Since it is already configured in the `package.json`, it is the ideal tool.
- **Alternatives considered**: ESLint `no-unused-vars` (already in use but doesn't find unused exports or files).

### 2. Cyclomatic Complexity Reduction
- **Decision**: Break down functions exceeding complexity 15 into smaller private/helper functions.
- **Rationale**: SonarQube's default threshold is 15. This provides a balance between overly aggressive splitting and maintaining readable code.
- **Alternatives considered**: Extracting logic into new classes/services (can cause over-engineering if not justified by single-responsibility).

### 3. Densification
- **Decision**: Consolidate orphaned files into their respective modules or delete them if entirely unused.
- **Rationale**: Keeps the `src/` directory navigable and enforces the Hexagonal Architecture pattern.
