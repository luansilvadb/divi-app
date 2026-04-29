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

  // Inject CSS variables for Chart.js theming — Apple HIG palette
  function injectChartColors() {
    const root = document.documentElement;
    const isDarkMode = root.classList.contains('dark');

    const themeColors: Record<string, { dark: string; light: string }> = {
      '--color-accent-main': { dark: '#0A84FF', light: '#007AFF' },
      '--color-surface-100': { dark: '#1C1C1E', light: '#FFFFFF' },
      '--color-surface-200': { dark: '#2C2C2E', light: '#F2F2F7' },
      '--color-neutral-1': { dark: 'rgba(255,255,255,0.85)', light: 'rgba(0,0,0,0.85)' },
      '--color-neutral-2': { dark: 'rgba(235,235,245,0.6)', light: 'rgba(60,60,67,0.6)' },
      '--color-error-main': { dark: '#FF453A', light: '#FF3B30' },
      '--color-success-main': { dark: '#30D158', light: '#34C759' },
      '--color-info-main': { dark: '#0A84FF', light: '#007AFF' },
      '--color-warning-main': { dark: '#FF9F0A', light: '#FF9500' },
      '--color-separator': { dark: 'rgba(84,84,88,0.65)', light: 'rgba(60,60,67,0.12)' },
    };

    Object.entries(themeColors).forEach(([property, values]) => {
      root.style.setProperty(property, isDarkMode ? values.dark : values.light);
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
