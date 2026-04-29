/**
 * Theme Injector: Prevents FOUC (Flash of Unstyled Content) by setting the dark mode class
 * before the main Vue app is initialized. Also injects CSS variables for Chart.js theming.
 * Reference: openspec/changes/apple-design-system-refactor/
 */
(function() {
  const theme = localStorage.getItem('divi-ui-theme') || 'system';
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  const palettes = {
    dark: {
      '--color-accent-main': '#0A84FF',
      '--color-surface-100': '#1C1C1E',
      '--color-surface-200': '#2C2C2E',
      '--color-neutral-1': 'rgba(255,255,255,0.85)',
      '--color-neutral-2': 'rgba(235,235,245,0.6)',
      '--color-error-main': '#FF453A',
      '--color-success-main': '#30D158',
      '--color-info-main': '#0A84FF',
      '--color-warning-main': '#FF9F0A',
      '--color-separator': 'rgba(84,84,88,0.65)',
    },
    light: {
      '--color-accent-main': '#007AFF',
      '--color-surface-100': '#FFFFFF',
      '--color-surface-200': '#F2F2F7',
      '--color-neutral-1': 'rgba(0,0,0,0.85)',
      '--color-neutral-2': 'rgba(60,60,67,0.6)',
      '--color-error-main': '#FF3B30',
      '--color-success-main': '#34C759',
      '--color-info-main': '#007AFF',
      '--color-warning-main': '#FF9500',
      '--color-separator': 'rgba(60,60,67,0.12)',
    }
  };

  // Inject CSS variables for Chart.js theming — Apple HIG palette
  function injectChartColors() {
    const root = document.documentElement;
    const isDarkMode = root.classList.contains('dark');
    const palette = palettes[isDarkMode ? 'dark' : 'light'];

    Object.entries(palette).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }

  // Initial injection
  injectChartColors();

  // Listen for theme toggle events
  window.addEventListener('storage', (e) => {
    if (e.key === 'divi-ui-theme') {
      const newTheme = e.newValue || 'system';
      const isNewDarkMode = newTheme === 'dark' || (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      if (isNewDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      injectChartColors();
    }
  });

  // Also listen for system preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const currentTheme = localStorage.getItem('divi-ui-theme') || 'system';
    if (currentTheme === 'system') {
      const isSystemDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isSystemDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      injectChartColors();
    }
  });
})();
