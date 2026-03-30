import { defineStore } from 'pinia';
import { ref } from 'vue';
import { checkIsLowPowerMode } from '../utils/performance';

/**
 * Store global para gerenciar o estado da Sidebar e detecção de performance da UI.
 */
export const useSidebarStore = defineStore('sidebar', () => {
  const isExpanded = ref(true);
  const isLowPowerMode = ref(false);

  /**
   * Inicializa a detecção de performance e recursos do sistema.
   * Ajusta o estado de economia de energia conforme necessário.
   */
  const initPerformanceDetection = async () => {
    isLowPowerMode.value = await checkIsLowPowerMode();

    // Monitoramento reativo do status da bateria se disponível
    if ('getBattery' in navigator) {
      try {
        const battery = await (navigator as any).getBattery();

        const updateLowPowerState = async () => {
          isLowPowerMode.value = await checkIsLowPowerMode();
        };

        battery.addEventListener('chargingchange', updateLowPowerState);
        battery.addEventListener('levelchange', updateLowPowerState);
      } catch (e) {
        // Falha silenciosa se a API não puder ser acessada
      }
    }
  };

  const toggleSidebar = () => {
    isExpanded.value = !isExpanded.value;
  };

  const setExpanded = (value: boolean) => {
    isExpanded.value = value;
  };

  return {
    isExpanded,
    isLowPowerMode,
    toggleSidebar,
    setExpanded,
    initPerformanceDetection
  };
});
