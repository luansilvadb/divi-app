# Quickstart: UI with New Color Palette (Tailwindcss)

**Feature**: 002-refactor-color-palette
**Date**: 2026-03-29

## How to use the new tokens

With **Tailwindcss** integration, you can use standard utility classes mapped to our color tokens.

### Utility Classes

Use the classes `bg-`, `text-`, and `border-` with our token names.

```html
<template>
  <!-- Main Background and Surface Card -->
  <div class="bg-bg-main min-h-screen p-8">
    <div class="bg-surface-main border border-border-main p-6 rounded-lg shadow-lg max-w-md mx-auto">
      
      <!-- Primary Heading -->
      <h2 class="text-primary-main text-2xl font-bold mb-4">
        Premium Banking
      </h2>
      
      <!-- Secondary Content -->
      <p class="text-text-secondary mb-6">
        Estabilidade e segurança para o seu patrimônio.
      </p>
      
      <!-- Accent Button -->
      <button class="bg-accent-main hover:bg-opacity-90 text-white font-medium py-2 px-4 rounded-sm transition-all">
        Investir Agora
      </button>
      
      <!-- Secondary Action -->
      <p class="text-secondary-main mt-4 text-sm font-semibold cursor-pointer">
        Saiba mais sobre crescimento
      </p>
      
    </div>
  </div>
</template>
```

### Theme Toggling

To switch between Light and Dark mode, the system adds or removes the `.dark` class from the `<html>` or `<body>` element. Tailwind's `dark:` variant is also supported but our tokens already handle the color switch via CSS Variables.

```typescript
// Example of theme switch (src/core/theme/themeManager.ts)
export function toggleTheme() {
  const root = document.documentElement;
  const isDark = root.classList.toggle('dark');
  localStorage.setItem('divi-ui-theme', isDark ? 'dark' : 'light');
}
```
