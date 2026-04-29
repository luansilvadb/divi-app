# Data Model: Premium Categories UI

## Key Entities

### Category (Domain Entity)
*Note: This feature refines the visual mapping of existing domain data.*

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Unique identifier |
| name | String | Category display name |
| icon | String | Lucide icon identifier |
| color | HEX String | Primary color associated with the category |
| balance | Number | Total balance in this category |

### PremiumUIContext (Visual Entity)
Represents the mapping of domain data to premium visual treatments.

| Field | Type | Description |
|-------|------|-------------|
| glowColor | RGBA | Derived from `Category.color` with reduced opacity (20-30%) |
| glassOpacity | Float | Transparency level (0.7-0.8) based on active theme |
| transitionPreset | String | Easing function identifier (e.g., `ease-spring`) |

### DesignToken (Infrastructure Entity)
The source of truth for all visual constants.

| Field | Type | Description |
|-------|------|-------------|
| name | String | CSS Variable name (e.g., `--radius-2xl`) |
| value | String | Concrete value (e.g., `20px`) |
| theme | String | `light` | `dark` | `common` |
