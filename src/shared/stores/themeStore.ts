import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export type Theme = 'light' | 'dark' | 'system'

export const useThemeStore = defineStore('theme', () => {
  const themeState = ref<Theme>((localStorage.getItem('divi-ui-theme') as Theme) || 'light')

  const applyTheme = () => {
    const root = document.documentElement
    const isDarkValue =
      themeState.value === 'system'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
        : themeState.value === 'dark'

    requestAnimationFrame(() => {
      if (isDarkValue) {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    })
  }

  let isInitialized = false
  const initThemeObservers = () => {
    if (isInitialized) return
    isInitialized = true

    applyTheme()

    watch(themeState, applyTheme)

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (themeState.value === 'system') {
        applyTheme()
      }
    })
  }

  const setTheme = (newTheme: Theme) => {
    if (themeState.value === newTheme) return
    themeState.value = newTheme
    localStorage.setItem('divi-ui-theme', newTheme)
  }

  const isDark = computed(() => {
    if (themeState.value === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return themeState.value === 'dark'
  })

  const toggle = () => {
    setTheme(isDark.value ? 'light' : 'dark')
  }

  return {
    theme: themeState,
    isDark,
    setTheme,
    toggle,
    initThemeObservers,
  }
})
