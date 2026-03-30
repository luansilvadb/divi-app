# Research: Sidebar Polish & Performance

## Decision: GPU-Accelerated Animations
- **Choice**: Use `transform: translateX()` for expansion/collapse instead of `width`.
- **Rationale**: `width` changes trigger the Layout/Reflow stage of the rendering pipeline, which is CPU-bound and causes jank. `transform` only triggers the Composite stage, which is GPU-accelerated and ensures 60 FPS.
- **Alternatives considered**: `width` with `will-change: width` (still triggers layout), `flex-basis` (same as width).

## Decision: Static Noise & Optimized Blur
- **Choice**: Convert the `sidebar-noise` SVG filter to a static Data URI background image and use `backdrop-filter: blur()` with `will-change`.
- **Rationale**: Live SVG turbulence filters are expensive to recalculate on every frame. A static noise texture as a background image is much cheaper. Separating blur and noise into pseudo-elements improves rendering isolation.
- **Alternatives considered**: `filter: url(#noise)` directly on the sidebar (high repaint cost).

## Decision: Environment-Aware Optimization (Low Power Mode)
- **Choice**: Implement a detection utility using `navigator.getBattery()` (Chromium) and an FPS-based heuristic (Safari/iOS).
- **Rationale**: There is no universal "isLowPowerMode" API. Combining the Battery Status API with a quick FPS check (measuring `requestAnimationFrame` speed) is the most reliable way to infer if the device is struggling or in power-saving mode.
- **Action**: Add `.low-power-mode` class to `<html>` to disable `backdrop-filter` and `noise` via CSS when detected.

## Decision: Efficient Layout Detection
- **Choice**: Replace the `window.resize` event listener with `window.matchMedia`.
- **Rationale**: `matchMedia` listeners only fire when the media query state changes, whereas `resize` fires continuously during window dragging, causing unnecessary script execution.
- **Alternatives considered**: `ResizeObserver` (good for component-level, but `matchMedia` is better for global breakpoint-based behavior).

## Decision: Performance-Driven Navigation Rendering
- **Choice**: Use `contain: paint` on navigation items and ensure they are rendered with stable keys.
- **Rationale**: `contain: paint` tells the browser that children won't be painted outside the element's bounds, allowing the browser to skip painting them if they are off-screen or during certain optimizations.
