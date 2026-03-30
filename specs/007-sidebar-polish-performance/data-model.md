# Data Model: Sidebar Polish & Performance

This document describes the data structures used by the sidebar and its performance monitoring system.

## Entities

### SidebarState (Pinia)
Represents the global state of the sidebar and the UI's environmental context.

- **isExpanded** (boolean): Current visual state (expanded or collapsed).
- **isLowPowerMode** (boolean): Detected power-saving state or low-performance hardware.
- **prefetchQueue** (Set<string>): Tracks routes currently being prefetched to avoid duplicates.
- **performanceProfile** (object):
    - **lastFps** (number): The last measured frame rate.
    - **interactionLatency** (number): Time measured for the last expand/collapse action.

### NavItem (Domain Concept)
Represents a single entry in the navigation menu.

- **label** (string): User-facing name.
- **to** (string): Target route path.
- **icon** (string): Raw SVG string for the icon.
- **badge** (string | number | undefined): Optional notification badge.

## State Transitions

| Trigger | Current State | Action | Next State |
|---------|---------------|--------|------------|
| Toggle Click | Expanded | Start Spring Animation | Collapsed |
| Toggle Click | Collapsed | Start Spring Animation | Expanded |
| Hover (>100ms) | Idle | Resolve Route -> Import() | Prefetching |
| FPS Drop (<40) | Standard | Disable heavy CSS | Low Power Mode |
| Power State Change | Low Power | Enable heavy CSS | Standard |
