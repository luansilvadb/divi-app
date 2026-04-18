/**
 * Theme Injector: Prevents FOUC (Flash of Unstyled Content) by setting the dark mode class
 * before the main Vue app is initialized.
 */
(function() {
  const theme = localStorage.getItem('divi-ui-theme') || 'system';
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
})();
