# Data Model: UI Standardization

## UI Theme (CSS Variables & Tailwind)
- **Primary Color**: `var(--color-primary-main)`
- **Secondary Color**: `var(--color-secondary-main)`
- **Accent Color**: `var(--color-accent-main)`
- **Text Primary**: `var(--color-text-primary)`
- **Text Secondary**: `var(--color-text-secondary)`
- **Background Main**: `var(--color-bg-main)`
- **Surface Main**: `var(--color-surface-main)`
- **Border Main**: `var(--color-border-main)`

## Shared Components Contracts

### `BaseViewHeader` (Organism)
- **Props**:
  - `title`: string (e.g., "Dashboard Financeiro")
  - `highlight`: string (e.g., "Financeiro")
  - `subtitle`: string (e.g., "Bem-vindo de volta!")
- **Slots**:
  - `action`: For primary CTA buttons.

### `BaseSummaryItem` (Molecule)
- **Props**:
  - `label`: string
  - `value`: string (formatted)
  - `color`: string (e.g., "var(--color-success-main)")
  - `status`: "normal" | "success" | "error" | "warning"
- **Slots**:
  - `icon`: SVG icon.

### `BaseProgressBar` (Atom)
- **Props**:
  - `percentage`: number
  - `color`: string
  - `isOverBudget`: boolean

### `BaseCard` (Atom)
- **Props**:
  - `clickable`: boolean (default: false)
- **Slots**:
  - `header`: Card title/header area.
  - `default`: Main card content.
  - `footer`: Optional footer actions.
