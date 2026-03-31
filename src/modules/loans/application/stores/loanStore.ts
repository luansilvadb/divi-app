import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { container } from '@/core/di'
import { DI_TOKENS } from '@/core/di-tokens'
import type { ILoanRepository } from '@/shared/domain/contracts/ILoanRepository'
import type { Loan } from '@/shared/domain/entities/Loan'

export const useLoanStore = defineStore('loans', () => {
  const loanRepo = container.resolve<ILoanRepository>(DI_TOKENS.LoanRepository)

  const loans = ref<Loan[]>([])
  const isLoading = ref(false)

  const fetchLoans = async () => {
    isLoading.value = true
    try {
      loans.value = await loanRepo.getAll()
    } finally {
      isLoading.value = false
    }
  }

  const saveLoan = async (loan: Loan) => {
    await loanRepo.save(loan)
    await fetchLoans()
  }

  const deleteLoan = async (id: string) => {
    await loanRepo.delete(id)
    await fetchLoans()
  }

  const totalDebt = computed(() => loans.value.reduce((sum, l) => sum + l.remaining_value, 0))

  return {
    loans,
    isLoading,
    fetchLoans,
    saveLoan,
    deleteLoan,
    totalDebt
  }
})
