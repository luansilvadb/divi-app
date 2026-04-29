# Quickstart: Premium Categories UI

## Setup
1. Ensure the `014-premium-categories-ui` branch is active.
2. Run `npm install` (if any new dependencies like `lucide-vue-next` were added).
3. Run `npm run dev`.

## Verification Steps
1. **Navigating**: Open the app and go to the "Categories" section in the sidebar.
2. **Visual Audit (Light Mode)**:
   - Observe the soft mesh gradient background.
   - Verify that category cards have a "frosted glass" appearance.
   - Check that text contrast is high against the glass background.
3. **Visual Audit (Dark Mode)**:
   - Toggle dark mode.
   - Verify that the background gradient shifts to deeper, darker tones.
   - Confirm that cards adapt to a dark glass treatment.
4. **Interaction Check**:
   - Hover over a category card.
   - Confirm the card lifts slightly and a subtle color glow (matching the icon color) appears.
   - Click the card and verify the active state feedback.

## Testing
- Run `npm run test:unit` to verify that existing category logic remains intact.
- Run `npm run test:e2e` to verify the page loads correctly with the new styles.
