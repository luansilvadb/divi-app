# Contracts: Sidebar Polish & Performance

This document defines the interfaces and contracts for the sidebar component and its supporting store.

## UI Contract: AppSidebar.vue

### Props
- None (Uses Pinia `sidebarStore` for global state).

### Emits
- **logout**: Dispatched when the user clicks the "Sair" button.

### Lifecycle Events
- **onMounted**: Initializes performance detection and breakpoint listeners.
- **onBeforeUnmount**: Cleans up media query listeners.

## Store Contract: sidebarStore.ts

### State
- **isExpanded** (boolean): Reactive state for sidebar width.
- **isLowPowerMode** (boolean): Reactive state for power-saving effects.

### Actions
- **toggleSidebar()**: Swaps `isExpanded` state.
- **setExpanded(value: boolean)**: Sets `isExpanded` to a specific value.
- **initPerformanceDetection()**: Starts the FPS heuristic and battery status monitoring.
- **prefetchRoute(to: string)**: (NEW) Resolves and dynamically imports the component for the target route.

## Interface Contract: Performance Monitoring

### Utils: performance.ts
- **checkIsLowPowerMode()**: Promise<boolean>
    - Resolves true if Battery < 20% or FPS < 40 in 100ms window.
- **isReducedMotionDetected()**: boolean
    - Returns true if `window.matchMedia('(prefers-reduced-motion: reduce)')` matches.
