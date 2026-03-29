import { ref, watch } from 'vue'

export type Theme = 'light' | 'dark' | 'system'

const theme = ref<Theme>((localStorage.getItem('theme') as Theme) || 'system')

export const useTheme = () => {
  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
    localStorage.setItem('theme', newTheme)
  }

  const applyTheme = () => {
    const isDark = 
      theme.value === 'dark' || 
      (theme.value === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    
    document.documentElement.classList.toggle('dark', isDark)
  }

  watch(theme, applyTheme, { immediate: true })

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (theme.value === 'system') {
      applyTheme()
    }
  })

  return {
    theme,
    setTheme
  }
}
