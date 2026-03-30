# Data Model: Sidebar UI State

The "Sidebar Polish & Performance" feature primarily deals with UI state and environment detection. No new persistent domain entities are introduced, but the UI state management is refined for performance.

## UI Components & State

### Sidebar State (Pinia/Local)
- **isCollapsed**: `boolean` (current state)
- **isHovered**: `boolean` (temporary state for visual feedback)
- **isLowPowerMode**: `boolean` (detected state, inferred from battery/FPS)
- **activeItem**: `NavItem` (currently selected navigation item)

## Navigation Configuration (Stable)
- **mainNavItems**: `Array<NavItem>`
- **analysisNavItems**: `Array<NavItem>`

### NavItem Schema
- **to**: `string` (Router link)
- **label**: `string` (Display text)
- **icon**: `string` (SVG icon string or component)
- **badge**: `string | number` (Optional notification badge)

## Environment Metrics (Transient)
- **fps**: `number` (Last 10 frames average)
- **batteryLevel**: `number` (0.0 to 1.0)
- **isCharging**: `boolean`
