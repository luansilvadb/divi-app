# Product Guidelines

## UI/UX Standards
- **Design System**: Use PrimeVue components consistently.
- **Styling**: Tailwind CSS for layout and utility classes.
- **Visual Style**:
  - Modern aesthetic with glassmorphism effects (backdrop-blur, semi-transparent backgrounds).
  - Smooth transitions and hover states.
  - Consistent use of rounded corners (e.g., `rounded-2xl`, `rounded-3xl`).
- **Responsiveness**: All views must be fully responsive and mobile-friendly.
- **Accessibility**: Ensure proper contrast, ARIA labels, and keyboard navigation.

## Code Quality
- **Type Safety**: Strict TypeScript usage. Avoid `any`.
- **Architecture**: Modular structure (`src/modules/...`) following clean architecture principles (domain, application, infrastructure, ui).
- **Testing**: Maintain high test coverage for business logic and UI components.
- **Performance**: Optimize bundle size and rendering performance.
