import type { VaultDatabase, LocalTransaction } from '@/infrastructure/storage/VaultDatabase'
import type { IPredictionService, PredictionResult } from '../domain/prediction'

export class PredictionService implements IPredictionService {
  constructor(private db: VaultDatabase) {}

  async predict(payeeId: string, _amount: bigint): Promise<PredictionResult> {
    const thirtyDaysAgoDate = new Date()
    thirtyDaysAgoDate.setDate(thirtyDaysAgoDate.getDate() - 30)
    const thirtyDaysAgo = thirtyDaysAgoDate.toISOString()

    // 1. Tentar buscar no histórico recente (30 dias) para este payee
    const recentTransactions = await this.db.transactions
      .where('payee_id')
      .equals(payeeId)
      .filter((t: LocalTransaction) => t.date >= thirtyDaysAgo && !t.deleted)
      .toArray()

    if (recentTransactions.length > 0) {
      return this.calculateBestMatch(recentTransactions)
    }

    // 2. Se não houver recente, buscar histórico total para este payee
    const allTransactions = await this.db.transactions
      .where('payee_id')
      .equals(payeeId)
      .filter((t) => !t.deleted)
      .toArray()

    if (allTransactions.length > 0) {
      return this.calculateBestMatch(allTransactions)
    }

    // 3. Fallback: Se for novo payee, buscar a categoria mais usada globalmente
    const globalTransactions = await this.db.transactions
      .filter((t) => !t.deleted)
      .limit(100) // Limitar para performance
      .toArray()

    if (globalTransactions.length > 0) {
      const match = this.calculateBestMatch(globalTransactions)
      return { ...match, confidence: 0 } // Confiança zero pois não é específico do payee
    }

    // 4. Último caso: IDs genéricos (assumindo que existam ou serão preenchidos pela UI)
    return {
      categoryId: 'geral',
      walletId: 'default',
      confidence: 0,
    }
  }

  private calculateBestMatch(transactions: LocalTransaction[]): PredictionResult {
    const categoryCounts = new Map<string, number>()
    const walletCounts = new Map<string, number>()

    let bestCategoryId: string | null = null
    let bestCategoryCount = 0
    let bestWalletId: string | null = null
    let bestWalletCount = 0

    for (const t of transactions) {
      // Category tracking with single-pass max detection
      const catCount = (categoryCounts.get(t.category_id) || 0) + 1
      categoryCounts.set(t.category_id, catCount)
      if (catCount > bestCategoryCount) {
        bestCategoryCount = catCount
        bestCategoryId = t.category_id
      }

      // Wallet tracking with single-pass max detection
      const walletCount = (walletCounts.get(t.wallet_id) || 0) + 1
      walletCounts.set(t.wallet_id, walletCount)
      if (walletCount > bestWalletCount) {
        bestWalletCount = walletCount
        bestWalletId = t.wallet_id
      }
    }

    if (!bestCategoryId || !bestWalletId) {
      return {
        categoryId: 'geral',
        walletId: 'default',
        confidence: 0,
      }
    }

    return {
      categoryId: bestCategoryId,
      walletId: bestWalletId,
      confidence: bestCategoryCount / transactions.length,
    }
  }
}
