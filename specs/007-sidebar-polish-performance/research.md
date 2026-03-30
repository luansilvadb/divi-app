# Research: Sidebar Polish & Performance Deep Research

This research focuses on identifying the best technologies and patterns to implement premium animations and maximum efficiency for the Divi sidebar.

## 1. Spring Physics in Vue 3
**Decision**: Use `@vueuse/motion`.
**Rationale**:
- **Native Integration**: It's built on top of `Popmotion` and tailored for Vue's Composition API.
- **Spring Physics**: Provides a first-class `spring` transition type with `stiffness`, `damping`, and `mass` controls.
- **Interruption Support**: Automatically handles interruptions when the user rapidly toggles the sidebar, preventing state inconsistency or "jank".
- **Performance**: Optimized for GPU acceleration and minimal overhead.

**Alternatives considered**:
- **GSAP**: Rejected because it's a large library and doesn't integrate as naturally with Vue's reactive state compared to @vueuse/motion.
- **Native CSS `cubic-bezier`**: Rejected because it cannot replicate the dynamic, organic feel of physical springs (especially the overshoot/bounce).

## 2. Smart Route Prefetching
**Decision**: Custom implementation using `router.resolve` + `import()`.
**Rationale**:
- **Intent Detection**: Triggered on `mouseenter` with a 100ms debounce to avoid prefetching on accidental hovers.
- **Resource Efficiency**: Only prefetches the component code (JS/CSS), not data.
- **Network Awareness**: Will skip prefetching if `navigator.connection.saveData` is true or if the connection is 2G/3G.

**Example implementation logic**:
```typescript
const prefetch = (to: string) => {
  if (isSlowConnection()) return;
  const route = router.resolve(to);
  const components = route.matched.flatMap(m => Object.values(m.components));
  components.forEach(c => {
    if (typeof c === 'function') (c as () => Promise<any>)();
  });
};
```

## 3. Low Power Mode & Performance Heuristics
**Decision**: Hybrid detection (Media Queries + FPS Heuristics).
**Rationale**:
- **Media Query**: `prefers-reduced-motion: reduce` is the most reliable cross-browser indicator that the user or system wants to save energy/resources.
- **FPS Heuristic**: Monitoring `requestAnimationFrame` for drops below 40FPS helps identify older hardware even when not in a formal "Low Power Mode".
- **Action**: When detected, the system will disable `backdrop-filter`, complex noise textures, and spring animations.

## 4. UI Optimization (v-memo)
**Decision**: Use `v-memo` for each `sidebar-nav-item`.
**Rationale**:
- **Rendering Efficiency**: Since nav items are in a loop, `v-memo` ensures they only re-render if their essential props (path, active status, badge) change, preventing a full list re-render on sidebar resize/toggle.

## 5. Noise & Blur Performance
**Decision**: Static Layer Isolation.
**Rationale**:
- The "noise" texture is already a static Base64 Data URI.
- By using `will-change: transform` and `contain: paint` on the sidebar, we ensure that effects like `backdrop-filter` are handled in a separate GPU layer, minimizing repaints of the main application content during sidebar expansion.
