# Data Model: Secure Gitignore Configuration

## Entities

### `GitignoreFile`
Represents the `.gitignore` file at the project root.
- **Attributes**:
  - `name`: `.gitignore`
  - `content`: Multiple `IgnorePattern` organized into sections.
  - `location`: Project root.

### `IgnorePattern`
A glob pattern rule for Git to exclude files.
- **Attributes**:
  - `pattern`: The glob pattern (e.g., `*.env`).
  - `category`: The logical grouping of the rule (e.g., "Secrets", "Build Outputs").
  - `comment`: Optional explanation for the rule.

## Relationships

- `GitignoreFile` **contains** multiple `IgnorePattern` entities.

## Validation Rules

- **Uniqueness**: Patterns MUST be unique within the file.
- **Precedence**: General rules MUST come before specific exclusion overrides (`!`).
- **Safety**: Rules MUST cover all identified secret patterns (`.env*`, `*.key`, `*.pem`).
