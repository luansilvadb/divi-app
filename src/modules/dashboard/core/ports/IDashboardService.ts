import type { IWallet } from '@/modules/wallets/core/entities/IWallet'
import type { ILoan } from '@/modules/loans/core/entities/ILoan'

export interface IDashboardData {
  wallets: IWallet[]
  loans: ILoan[]
  totalBalance: number
  totalDebt: number
}

export interface IDashboardService {
  getDashboardData(): Promise<IDashboardData>
}
