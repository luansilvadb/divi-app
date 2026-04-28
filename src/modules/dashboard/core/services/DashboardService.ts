import type { IWalletRepository } from '@/modules/wallets/core/ports/IWalletRepository'
import type { ILoanRepository } from '@/modules/loans/core/ports/ILoanRepository'
import type { IDashboardService, IDashboardData } from '../ports/IDashboardService'

export class DashboardService implements IDashboardService {
  constructor(
    private readonly walletRepo: IWalletRepository,
    private readonly loanRepo: ILoanRepository
  ) {}

  async getDashboardData(): Promise<IDashboardData> {
    const [wallets, loans] = await Promise.all([
      this.walletRepo.getAll(),
      this.loanRepo.getAll()
    ])

    const totalBalance = wallets.reduce((acc, w) => acc + BigInt(w.balance), 0n)
    const totalDebt = loans.reduce((acc, l) => acc + BigInt(l.remaining_value), 0n)

    return {
      wallets,
      loans,
      totalBalance: Number(totalBalance) / 100,
      totalDebt: Number(totalDebt) / 100
    }
  }
}
