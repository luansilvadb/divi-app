# Research: Secure Gitignore Configuration

## Decision 1: Base Template Selection
**Decision**: Use a combination of GitHub's official templates for Node.js and Vue, supplemented with Supabase and IDE-specific rules.
**Rationale**: These templates are community-vetted and cover 99% of standard use cases. Manual configuration from scratch is prone to omitting obscure but important files.
**Alternatives considered**: Using a single "generic" web template (rejected as it lacks specific rules for Vite/Supabase).

## Decision 2: Security First Approach
**Decision**: Explicitly block all `.env*` files by default and use a "deny-list" approach for common secret extensions (`.key`, `.pem`, `.p12`).
**Rationale**: Prevents accidental commits even if a developer names their secret file non-standardly.
**Alternatives considered**: Only ignoring `.env` (rejected as developers often use `.env.local` or `.env.production`).

## Decision 3: Clean Repository Policy
**Decision**: Ignore all build outputs (`dist/`, `build/`), dependency folders (`node_modules/`), and log files.
**Rationale**: Keeps the repository lightweight and avoids unnecessary diffs in generated files.
**Alternatives considered**: Committing some build artifacts for easier deployment (rejected as it violates Clean Architecture and modern CI/CD practices).

## Decision 4: OS and IDE Agnosticism
**Decision**: Include rules for Windows (Thumbs.db), macOS (.DS_Store), and common editors (VS Code, IntelliJ, Vim).
**Rationale**: Ensures a consistent experience for all team members regardless of their local environment.
**Alternatives considered**: Expecting developers to have global gitignores (rejected as it's not a "complete" solution for the project itself).

## Identified Project-Specific Patterns
- **Supabase**: Ignore `.supabase/functions/.import_map.json` and other local runtime artifacts.
- **Vite**: Ignore `dev-dist` and `dist`.
- **Vertical Slicing**: Ensure that if features have local tests that generate artifacts, those are covered by glob patterns.
