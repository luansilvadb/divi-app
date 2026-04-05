# Product Guidelines - divi

## UI & Design System (PrimeVue First)
- **Exclusivity:** All UI components MUST be sourced from the PrimeVue library to ensure maximum cohesion and performance.
- **Density:** Views should be designed for high information density, minimizing unnecessary whitespace without sacrificing clarity.
- **Responsiveness:** Utilize TailwindCSS utilities to maintain a seamless experience across all screen sizes.
- **Branding:** Consistent use of Primary, Secondary, and Accent tokens as defined in the project's theme.

## UX Principles
- **Immediate Feedback:** All user interactions should trigger immediate visual confirmation (e.g., PrimeVue Toast, progress indicators).
- **Streamlined Workflows:** Core financial tasks (adding a transaction, checking a budget) should require minimal clicks.
- **Predictability:** Use consistent interaction patterns (e.g., dialogs for creation/editing, tables for listing) across all modules.

## Architectural Standards
- **Vertical Slicing:** Adhere strictly to the `modules/[feature]/` structure for all UI/UX enhancements.
- **Low Coupling:** Maintain clear separation between UI components and business logic/data access layers.
- **Backward Compatibility:** All refactoring must respect existing domain contracts and repository interfaces to avoid regressions.
