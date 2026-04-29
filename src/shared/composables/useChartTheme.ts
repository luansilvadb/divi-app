import { computed, onMounted, onUnmounted, ref } from 'vue'

export function useChartTheme() {
  const isDark = ref(false)

  const updateThemeState = () => {
    isDark.value = document.documentElement.classList.contains('dark')
  }

  // Get CSS variable value with fallback
  const getCssVar = (name: string, fallback: string): string => {
    if (typeof window === 'undefined') return fallback
    const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
    return value || fallback
  }

  const colors = computed(() => {
    const accentColor = getCssVar('--color-accent-main', '#8b5cf6')
    const surface100 = getCssVar('--color-surface-100', '#FFFFFF')
    const neutral2 = getCssVar('--color-neutral-2', 'rgba(0,0,0,0.6)')
    
    const isThemeDark = isDark.value

    return {
      accentColor,
      surface100,
      neutral2,
      tooltipBg: isThemeDark ? 'rgba(44, 44, 46, 0.95)' : 'rgba(255, 255, 255, 0.95)',
      tooltipTitleColor: neutral2,
      tooltipBodyColor: isThemeDark ? '#FFFFFF' : '#000000',
      gridColor: isThemeDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
      pointBg: isThemeDark ? '#2C2C2E' : '#FFFFFF',
      isDark: isThemeDark,
    }
  })

  // Helper to convert hex to rgba
  const hexToRgba = (hex: string, alpha: number): string => {
    if (hex.startsWith('rgba')) return hex
    if (hex.startsWith('rgb(')) {
      const values = hex.match(/\d+/g)
      if (values) return `rgba(${values[0]}, ${values[1]}, ${values[2]}, ${alpha})`
    }
    const r = parseInt(hex.slice(1, 3), 16) || 0
    const g = parseInt(hex.slice(3, 5), 16) || 0
    const b = parseInt(hex.slice(5, 7), 16) || 0
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === 'divi-ui-theme') {
      setTimeout(updateThemeState, 50)
    }
  }

  onMounted(() => {
    updateThemeState()
    window.addEventListener('storage', handleStorageChange)
    
    // Also listen for manual theme changes if not via storage
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          updateThemeState()
        }
      })
    })
    
    observer.observe(document.documentElement, { attributes: true })
    
    onUnmounted(() => {
      window.removeEventListener('storage', handleStorageChange)
      observer.disconnect()
    })
  })

  return {
    colors,
    hexToRgba,
  }
}
