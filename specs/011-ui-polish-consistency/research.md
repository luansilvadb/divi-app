# Research: UI Polish and Consistency

## Visual Consistency Issues

### 1. Sidebar Icons
- **Findings**: The icon for "Orçamentos" is defined as `i-lucide-IWallet` in `AppSidebar.vue`. Standard Lucide icon for wallet is `wallet`. The prefix `i-lucide-` is correct for UnoCSS icons preset.
- **Decision**: Rename `i-lucide-IWallet` to `i-lucide-wallet`.
- **Rationale**: Fixes the rendering issue where a white box is displayed instead of the icon.

### 2. Sync Status Indicator
- **Findings**: 
    - The text has `opacity-60` by default, which makes it faint.
    - It uses `text-secondary` which might have low contrast depending on the theme.
    - It is scaled down to 90% in `GlobalHeader.vue`, reducing legibility.
- **Decision**: 
    - Increase default opacity to `opacity-80` and `opacity-100` on group hover.
    - Use more vivid semantic colors (e.g., `text-success-main` for "Sincronizado").
    - Remove `scale-90` or adjust it to be more balanced.
- **Rationale**: Improves visibility and feedback clarity.

### 3. Header Action Styling (Notification Bell)
- **Findings**: The notification bell is a simple button with `text-zinc-500`. It lacks the "premium" feel of other components (like the sync indicator).
- **Decision**: 
    - Apply a background surface (e.g., `bg-card-nested`) or a subtle border to the notification button to match the sync indicator's "pill" style.
    - Use `text-label-1` for better contrast.
- **Rationale**: Creates a more cohesive and premium header experience.

## Technical Patterns
- **UnoCSS**: Use shortcuts like `text-primary-label`, `bg-nested`, etc., defined in `uno.config.ts`.
- **Naive UI**: Sidebar uses `NMenu`. Customizations must be careful with deep selectors.
- **Message Catalog**: All strings are already in Portuguese, but should be checked against `catalog.ts`.

## Alternatives Considered
- **Replacing Lucide with another library**: Not necessary, Lucide is already integrated and working for other items.
- **Complete Header Redesign**: Out of scope for polish. Small adjustments to existing elements provide better ROI.
