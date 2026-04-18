import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { container } from '@/core/di'
import { DI_TOKENS } from '@/core/di-tokens'
import type { IWalletRepository } from '@/shared/domain/contracts/IWalletRepository'
import type { ILoanRepository } from '@/shared/domain/contracts/ILoanRepository'
import type { Wallet } from '@/shared/domain/entities/Wallet'
import type { Loan } from '@/shared/domain/entities/Loan'

export const useDashboardStore = defineStore('dashboard', () => {
  // Repositories
  const walletRepo = container.resolve<IWalletRepository>(DI_TOKENS.WalletRepository)
  const loanRepo = container.resolve<ILoanRepository>(DI_TOKENS.LoanRepository)

  // State
  const wallets = ref<Wallet[]>([])
  const loans = ref<Loan[]>([])
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
      const [walletsData, loansData] = await Promise.all([walletRepo.getAll(), loanRepo.getAll()])
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
