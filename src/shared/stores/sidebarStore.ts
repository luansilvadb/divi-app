import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import { checkIsLowPowerMode } from '../utils/performance'
import router from '../../core/router'

/**
 * Store global para gerenciar o estado da Sidebar e detecção de performance da UI.
 */
export const useSidebarStore = defineStore('sidebar', () => {
  const isExpanded = ref(true)
  const isLowPowerMode = ref(false)
  const prefetchQueue = reactive(new Set<string>())

  const performanceProfile = reactive({
    lastFps: 60,
    interactionLatency: 0,
  })

  /**
   * Inicializa a detecção de performance e recursos do sistema.
   * Ajusta o estado de economia de energia conforme necessário.
   */
  const initPerformanceDetection = async () => {
    isLowPowerMode.value = await checkIsLowPowerMode()

    // Monitoramento reativo do status da bateria se disponível
    if ('getBattery' in navigator) {
      try {
        const battery = await (navigator as unknown as { getBattery: () => Promise<{ level: number, charging: boolean, addEventListener: (event: string, callback: () => void) => void }>, connection: { saveData: boolean, effectiveType: string } }).getBattery()

        const updateLowPowerState = async () => {
          isLowPowerMode.value = await checkIsLowPowerMode()
        }

        battery.addEventListener('chargingchange', updateLowPowerState)
        battery.addEventListener('levelchange', updateLowPowerState)
      } catch {
        // Falha silenciosa se a API não puder ser acessada
      }
    }
  }

  /**
   * Prefetch inteligente de rotas baseado no hover do usuário.
   */
  const prefetchRoute = async (to: string) => {
    // Evita prefetch em conexões lentas ou se já estiver na fila
    if (prefetchQueue.has(to)) return

    // Verificação básica de economia de dados se disponível
    const connection = (navigator as unknown as { getBattery: () => Promise<{ level: number, charging: boolean, addEventListener: (event: string, callback: () => void) => void }>, connection: { saveData: boolean, effectiveType: string } }).connection
    if (connection && (connection.saveData || /2g|3g/.test(connection.effectiveType))) {
      return
    }

    try {
      prefetchQueue.add(to)
      const route = router.resolve(to)
      const components = route.matched.flatMap((m) =>
        m.components ? Object.values(m.components) : [],
      )

      // Dispara o carregamento dos componentes (importação dinâmica)
      const loaders = components.map((c) => {
        if (typeof c === 'function') return (c as () => Promise<unknown>)()
        return Promise.resolve()
      })

      await Promise.all(loaders)
    } catch {
      // Falha silenciosa no prefetch para não afetar o usuário
      prefetchQueue.delete(to)
    }
  }

  const toggleSidebar = () => {
    isExpanded.value = !isExpanded.value
  }

  const setExpanded = (value: boolean) => {
    isExpanded.value = value
  }

  return {
    isExpanded,
    isLowPowerMode,
    prefetchQueue,
    performanceProfile,
    toggleSidebar,
    setExpanded,
    initPerformanceDetection,
    prefetchRoute,
  }
})
