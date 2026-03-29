import { ref, watch } from 'vue'

export type Theme = 'light' | 'dark' | 'system'

const themeState = ref<Theme>((localStorage.getItem('divi-ui-theme') as Theme) || 'system')

export const useTheme = () => {
  const setTheme = (newTheme: Theme) => {
    themeState.value = newTheme
    localStorage.setItem('divi-ui-theme', newTheme)
  }

  const applyTheme = () => {
    const root = document.documentElement
    const isDark = 
      themeState.value === 'dark' || 
      (themeState.value === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    
    if (isDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }

  // Initial application
  applyTheme()

  // Watch for manual changes
  watch(themeState, applyTheme)

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (themeState.value === 'system') {
      applyTheme()
    }
  })

  return {
    theme: themeState,
    setTheme
  }
}
