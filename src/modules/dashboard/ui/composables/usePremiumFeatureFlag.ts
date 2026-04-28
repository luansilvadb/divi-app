import { computed, watch } from 'vue'
import { useStorage, useUrlSearchParams } from '@vueuse/core'

/**
 * Feature flag para alternar entre dashboard clássico e premium
 * Usa localStorage para persistência + query param para override
 */
export function usePremiumFeatureFlag() {
  // Persistente no localStorage (padrão: false - dashboard clássico)
  const storedPreference = useStorage('divi:premium-dashboard', false)

  // Override via query param (?premium=true)
  const queryParams = useUrlSearchParams('hash-params')

  // Helper para verificar se é string true
  const isTrue = (val: unknown): boolean => val === 'true' || val === true

  // Estado computado final
  const isPremiumEnabled = computed(() => {
    // Query param tem prioridade
    if (queryParams.premium !== undefined) {
      return isTrue(queryParams.premium)
    }
    return storedPreference.value
  })

  // Métodos para controlar
  const enablePremium = () => {
    storedPreference.value = true
  }

  const disablePremium = () => {
    storedPreference.value = false
  }

  const togglePremium = () => {
    storedPreference.value = !storedPreference.value
  }

  // Computed para o componente de dashboard a ser renderizado
  const dashboardComponent = computed(() => {
    return isPremiumEnabled.value
      ? () => import('../views/PremiumDashboardView.vue')
      : () => import('../views/DashboardView.vue')
  })

  // Sincronizar query param com storage
  watch(() => queryParams.premium, (newVal) => {
    if (newVal !== undefined) {
      storedPreference.value = isTrue(newVal)
    }
  })

  return {
    isPremiumEnabled,
    dashboardComponent,
    enablePremium,
    disablePremium,
    togglePremium,
  }
}

export type UsePremiumFeatureFlagReturn = ReturnType<typeof usePremiumFeatureFlag>
