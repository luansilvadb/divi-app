# Research: Premium Categories UI Redesign

## Atmospheric Backgrounds (Mesh Gradients)

**Decision**: Use CSS `radial-gradient` layering for the atmospheric background.
**Rationale**: CSS gradients are performant, easy to theme via CSS variables, and do not require external assets or complex canvas logic.
**Alternatives considered**: 
- **Animated SVG**: High quality but harder to dynamically theme.
- **Canvas/WebGL**: Maximum flexibility but overkill for a dashboard background and higher battery consumption.

**Implementation Detail**:
```css
.atmosphere-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background-color: var(--surface-background);
  background-image: 
    radial-gradient(at 0% 0%, var(--color-primary-subtle) 0px, transparent 50%),
    radial-gradient(at 50% 0%, var(--color-success-subtle) 0px, transparent 50%),
    radial-gradient(at 100% 0%, var(--color-info-subtle) 0px, transparent 50%);
  filter: blur(80px);
  opacity: 0.6;
}
```

## Glassmorphism Implementation

**Decision**: Define a new `--surface-glass` token set.
**Rationale**: Centralizing glassmorphic values ensures consistency across cards and stats panels.
**Implementation Detail**:
```css
:root {
  --surface-glass: rgba(255, 255, 255, 0.7);
  --glass-blur: 12px;
  --glass-border: rgba(255, 255, 255, 0.3);
}

.dark {
  --surface-glass: rgba(28, 28, 30, 0.7);
  --glass-border: rgba(255, 255, 255, 0.1);
}
```

## Purposeful Motion (Lift & Glow)

**Decision**: Use `transition` with `var(--ease-spring)` for translation and `box-shadow` for the glow.
**Rationale**: The `ease-spring` provides a tactile, premium feel that aligns with Apple HIG's fluid motion.
**Implementation Detail**:
```css
.premium-card {
  transition: transform var(--duration-normal) var(--ease-spring), 
              box-shadow var(--duration-normal) var(--ease-out),
              border-color var(--duration-normal) var(--ease-out);
}

.premium-card:hover {
  transform: translateY(-4px) scale(1.01);
  box-shadow: var(--shadow-lg), 0 0 20px var(--category-glow-color);
}
```

## Needs Clarification Resolved

- **Performance**: Confirmed CSS-only approach is optimal for 60fps targets.
- **Theming**: Radial gradients will use existing `-subtle` tokens to ensure they inherit theme colors automatically.
- **Accessibility**: Glassmorphism transparency will be tuned to maintain WCAG AA contrast ratios for text labels.
