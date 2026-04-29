# Data Model: UI Polish and Consistency

This feature primarily involves visual adjustments and does not introduce new persistent domain entities. It refines existing UI components.

## UI Entities

### Navigation Item (Existing)
Represents an entry in the sidebar or bottom bar.
- **Attributes**:
    - `label`: String (from message catalog).
    - `icon`: String (UnoCSS icon class).
    - `route`: String (Vue Router path).

### Sync Status (Existing)
Represents the current state of data synchronization.
- **Attributes**:
    - `status`: 'syncing' | 'synced' | 'pending'.
    - `isOnline`: Boolean.
    - `pendingCount`: Number.

## Validation Rules
- **Icon Naming**: MUST follow the `i-lucide-<icon-name>` pattern using valid Lucide icon names in lowercase.
- **Contrast**: UI elements MUST pass WCAG AA contrast checks (minimum 4.5:1).
