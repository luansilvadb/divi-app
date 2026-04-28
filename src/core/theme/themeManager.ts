import { useThemeStore } from '../../shared/stores/themeStore'
import { storeToRefs } from 'pinia'


export const useTheme = () => {
  const store = useThemeStore()

  // Garante que os observadores globais estejam ativos
  store.initThemeObservers()

  const { theme, isDark } = storeToRefs(store)

  return {
    theme,
    isDark,
    setTheme: store.setTheme,
    toggle: store.toggle,
  }
}
