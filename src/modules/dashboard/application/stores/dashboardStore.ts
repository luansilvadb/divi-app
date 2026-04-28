import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { container } from '@/core/di'
import { DI_TOKENS } from '@/core/di-tokens'
import type { IDashboardService } from '@/modules/dashboard/core/ports/IDashboardService'
import type { IWalletRepository } from '@/modules/wallets/core/ports/IWalletRepository'
import type { ILoanRepository } from '@/modules/loans/core/ports/ILoanRepository'
import type { IWallet } from '@/modules/wallets/core/entities/IWallet'
import type { ILoan } from '@/modules/loans/core/entities/ILoan'

export const useDashboardStore = defineStore('dashboard', () => {
  // Services
  const dashboardService = container.resolve<IDashboardService>(DI_TOKENS.IDashboardService)

  // State
  const wallets = ref<IWallet[]>([])
  const loans = ref<ILoan[]>([])
  const totalBalance = ref(0)
  const totalDebt = ref(0)
  const isLoading = ref(false)
  const hasInitializationError = ref(false)

  // Actions
  async function fetchDashboardData() {
    isLoading.value = true
    try {
      const data = await dashboardService.getDashboardData()
      wallets.value = data.wallets
      loans.value = data.loans
      totalBalance.value = data.totalBalance
      totalDebt.value = data.totalDebt
    } finally {
      isLoading.value = false
    }
  }

  return {
    wallets,
    loans,
    isLoading,
    hasInitializationError,
    totalBalance,
    totalDebt,
    fetchDashboardData,
  }
})
