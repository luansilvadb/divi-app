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
  const searchQuery = ref('')

  const fetchLoans = async () => {
    isLoading.value = true
    try {
      loans.value = await loanRepo.getAll()
    } finally {
      isLoading.value = false
    }
  }

  const saveLoan = async (loan: Loan) => {
    try {
      await loanRepo.save(loan)
      await fetchLoans()
    } catch (err) {
      const errorContext = {
        operation: 'saveLoan',
        loanId: loan.id,
        loanDescription: loan.description,
        error: err instanceof Error ? err.message : String(err),
      }
      console.error('[LoanStore] Failed to save loan:', errorContext, err)
      throw err
    }
  }

  const deleteLoan = async (id: string) => {
    try {
      await loanRepo.delete(id)
      await fetchLoans()
    } catch (err) {
      const errorContext = {
        operation: 'deleteLoan',
        loanId: id,
        error: err instanceof Error ? err.message : String(err),
      }
      console.error('[LoanStore] Failed to delete loan:', errorContext, err)
      throw err
    }
  }

  const totalDebt = computed(() => Number(loans.value.reduce((sum, l) => sum + BigInt(l.remaining_value), 0n)))

  return {
    loans,
    isLoading,
    searchQuery,
    fetchLoans,
    saveLoan,
    deleteLoan,
    totalDebt,
  }
})
