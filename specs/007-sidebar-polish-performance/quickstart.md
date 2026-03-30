# Quickstart: Sidebar Polish & Performance

This guide outlines how to implement the sidebar's performance optimizations and premium polish.

## Prerequisites

### 1. Install Animation Library
We are using `@vueuse/motion` for its high-performance spring physics.

```bash
npm install @vueuse/motion
```

### 2. Configure Global Context
Register the motion plugin in `src/main.ts` (if not already done).

```typescript
import { MotionPlugin } from '@vueuse/motion'
const app = createApp(App)
app.use(MotionPlugin)
```

## Implementation Steps

### Phase 1: Spring Physics
1.  **Remove standard CSS transitions** on `.sidebar` for width and transform.
2.  **Add `v-motion`** to the `.sidebar` element in `AppSidebar.vue`.
3.  **Define spring configuration** using the research findings (`stiffness: 250, damping: 25`).

### Phase 2: Route Prefetching
1.  **Extract route imports** in `src/router/index.ts` to named exports if possible.
2.  **Update `sidebarStore.ts`** with a `prefetchRoute(to)` action.
3.  **Add `@mouseenter.stop="prefetch(item.to)"`** to navigation items in `AppSidebar.vue`.
4.  **Debounce the prefetch** to avoid network noise during rapid mouse movement.

### Phase 3: Performance Audit
1.  **Open Chrome DevTools** -> Performance tab.
2.  **Toggle Sidebar** multiple times.
3.  **Check for "Long Tasks"** or Layout Shifts.
4.  **Audit `backdrop-filter` impact** using the "Rendering" -> "Paint Flashing" tool.

## Verification Checklist

- [ ] Expansion/Collapse feels organic with a subtle "spring" bounce.
- [ ] No "Paint" events occur in the sidebar when idle.
- [ ] Navigation components are downloaded *before* the user clicks (on hover).
- [ ] Low Power Mode automatically disables the background blur and noise.
