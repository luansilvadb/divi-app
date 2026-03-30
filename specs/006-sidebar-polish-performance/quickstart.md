# Quickstart: Sidebar Polish & Performance

## Local Development Setup

1. **Verify Sidebar**: Ensure you are on the `006-sidebar-polish-performance` branch.
2. **Start Dev Server**: Run `npm run dev` to see the current sidebar.
3. **Inspect Performance**: Open Chrome DevTools > Performance > Rendering and enable:
   - "Paint flashing"
   - "Layout Shift Regions"
   - "Frame Rendering Stats"

## Verification Steps

### 1. 60 FPS Check
- Open the sidebar multiple times.
- Ensure the "Frame Rendering Stats" shows a stable 60 FPS green bar during the animation.

### 2. Low Power Mode Simulation
- Open Chrome DevTools > Performance.
- In the "CPU" dropdown, select "4x slowdown".
- Verify that the sidebar automatically disables the `backdrop-filter` (blur) and `sidebar-noise` if the performance heuristic triggers.
- (Manual test) Append `?forceLowPower=true` to the URL to force the low power mode state.

### 3. Resize Behavior
- Drag the browser window corner.
- Verify that the sidebar only collapses/expands at the specific 1024px breakpoint without intermediate layout recalculations during the drag.

### 4. Theme Transition
- Click the theme toggle button.
- Ensure the transition is instant (<300ms) and no layout shifts occur.
