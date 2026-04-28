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

    // Primary accent — Apple System Blue
    root.style.setProperty('--color-accent-main', isDarkMode ? '#0A84FF' : '#007AFF');

    // Surface colors for chart backgrounds / tooltips
    root.style.setProperty('--color-surface-100', isDarkMode ? '#1C1C1E' : '#FFFFFF');
    root.style.setProperty('--color-surface-200', isDarkMode ? '#2C2C2E' : '#F2F2F7');

    // Neutral colors for axis text — Apple alpha hierarchy
    root.style.setProperty('--color-neutral-1', isDarkMode ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.85)');
    root.style.setProperty('--color-neutral-2', isDarkMode ? 'rgba(235,235,245,0.6)' : 'rgba(60,60,67,0.6)');

    // Feedback colors — Apple system semantic colors
    root.style.setProperty('--color-error-main',   isDarkMode ? '#FF453A' : '#FF3B30');
    root.style.setProperty('--color-success-main', isDarkMode ? '#30D158' : '#34C759');
    root.style.setProperty('--color-info-main',    isDarkMode ? '#0A84FF' : '#007AFF');
    root.style.setProperty('--color-warning-main', isDarkMode ? '#FF9F0A' : '#FF9500');

    // Separator for chart grid lines
    root.style.setProperty('--color-separator', isDarkMode ? 'rgba(84,84,88,0.65)' : 'rgba(60,60,67,0.12)');
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
