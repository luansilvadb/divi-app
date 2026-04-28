import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { container } from '@/core/di'
import { DI_TOKENS } from '@/core/di-tokens'
import type { IWalletRepository } from '@/modules/wallets/core/ports/IWalletRepository'
import type { ILoanRepository } from '@/modules/loans/core/ports/ILoanRepository'
import type { IWallet } from '@/modules/wallets/core/entities/IWallet'
import type { ILoan } from '@/modules/loans/core/entities/ILoan'

export const useDashboardStore = defineStore('dashboard', () => {
  // Repositories
  const IWalletRepo = container.resolve<IWalletRepository>(DI_TOKENS.IWalletRepository)
  const loanRepo = container.resolve<ILoanRepository>(DI_TOKENS.ILoanRepository)

  // State
  const wallets = ref<IWallet[]>([])
  const loans = ref<ILoan[]>([])
  const isLoading = ref(false)
  const hasInitializationError = ref(false)

  // Getters
  const totalBalance = computed(() => {
    const sum = wallets.value.reduce((acc, w) => acc + BigInt(w.balance), 0n)
    return Number(sum) / 100
  })

  const totalDebt = computed(() => {
    const sum = loans.value.reduce((acc, l) => acc + BigInt(l.remaining_value), 0n)
    return Number(sum) / 100
  })

  // Actions
  async function fetchDashboardData() {
    isLoading.value = true
    try {
      const [walletsData, loansData] = await Promise.all([IWalletRepo.getAll(), loanRepo.getAll()])
      wallets.value = walletsData
      loans.value = loansData
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
