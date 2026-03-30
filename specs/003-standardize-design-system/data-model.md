# Data Model: UI Standardized Components & Tokens

## UI Tokens (CSS Variables)

Based on the "Budgets" screen, the following tokens should be used consistently:

| Token | CSS Variable | Value (Light) | Value (Dark) |
|-------|--------------|---------------|--------------|
| **Glass Background** | `--color-glass-bg` | `rgba(255, 255, 255, 0.75)` | `rgba(30, 41, 59, 0.4)` |
| **Glass Border** | `--color-glass-border` | `rgba(255, 255, 255, 0.4)` | `rgba(255, 255, 255, 0.05)` |
| **Glass Blur** | `--glass-blur` | `16px` | `16px` |
| **Hover Border** | `--color-hover-border` | `rgba(var(--color-primary-main-rgb), 0.3)` | `rgba(var(--color-primary-main-rgb), 0.3)` |
| **Hover Shadow** | `--glass-hover-shadow` | `0 8px 30px rgba(0, 0, 0, 0.08)` | `0 8px 30px rgba(0, 0, 0, 0.2)` |
| **Card Radius** | `--card-radius` | `1.25rem` | `1.25rem` |

## Atomic Design Components

### Atoms

#### `BaseBadge.vue`
Standardized status/type indicator.
- **Props**:
  - `label`: string
  - `color`: string (hex or CSS var)
  - `variant`: 'subtle' | 'outline' | 'solid'

#### `BaseProgressBar.vue`
Visual progress indicator with shimmer effect.
- **Props**:
  - `percentage`: number (0-100)
  - `color`: string (CSS var)
  - `isOverBudget`: boolean (for pulse-error effect)

#### `BaseIconBox.vue`
Rounded container for icons with tinted background.
- **Props**:
  - `color`: string (hex or CSS var)
  - `size`: 'sm' | 'md' | 'lg'

### Molecules

#### `BaseSummaryItem.vue`
Label/Value pair with an icon.
- **Props**:
  - `label`: string
  - `value`: string
  - `icon`: string (SVG component or slot)
  - `color`: string (hex or CSS var)
  - `status`: 'normal' | 'error' | 'success'

### Organisms

#### `BaseViewHeader.vue`
Standardized page title and action area.
- **Props**:
  - `title`: string
  - `subtitle`: string
  - `highlight`: string (text to highlight in primary color)
  - `actionLabel`: string (optional)
- **Slots**:
  - `action`: For the main action button
  - `title`: Custom title layout
