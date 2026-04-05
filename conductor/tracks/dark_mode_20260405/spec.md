# Specification: Implement dark mode support and theme toggling

## Objective
Implement full dark mode support across the application and provide a user-accessible theme toggle.

## Requirements
- Introduce a dark theme configuration for PrimeVue and TailwindCSS.
- Create a reusable `ThemeToggle` component.
- Persist the user's theme preference using LocalStorage or a Pinia store.
- Ensure all existing core components correctly respond to the active theme.

## Architecture
- **State Management:** Pinia (for active theme state).
- **Persistence:** LocalStorage (to remember theme between sessions).
- **UI:** Tailwind's `dark:` classes and PrimeVue's theme system.