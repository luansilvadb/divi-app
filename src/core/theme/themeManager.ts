import { ref, watch, computed } from 'vue'

export type Theme = 'light' | 'dark' | 'system'

// Estado persistente único (Singleton pattern)
const themeState = ref<Theme>((localStorage.getItem('divi-ui-theme') as Theme) || 'system')

// Utilitário para aplicar o tema no DOM (Otimizado para evitar reflows desnecessários)
const applyTheme = () => {
  const root = document.documentElement
  const isDarkValue =
    themeState.value === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : themeState.value === 'dark'

  // Usa requestAnimationFrame para garantir que a mudança de classe ocorra
  // no início do próximo frame, evitando conflitos com outras manipulações de DOM.
  requestAnimationFrame(() => {
    if (isDarkValue) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  })
}

// Inicialização única dos observadores
let isInitialized = false
const initThemeObservers = () => {
  if (isInitialized) return
  isInitialized = true

  // Aplicação inicial
  applyTheme()

  // Watcher único para mudanças de estado
  watch(themeState, applyTheme)

  // Listener único para mudanças no sistema
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (themeState.value === 'system') {
      applyTheme()
    }
  })
}

/**
 * Hook para gerenciamento de tema com performance otimizada.
 */
export const useTheme = () => {
  // Garante que os observadores globais estejam ativos
  initThemeObservers()

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
  }
}
