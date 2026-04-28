import type { VaultDatabase, LocalITransaction } from '@/infrastructure/storage/VaultDatabase'
import type { IPredictionService, PredictionResult } from '../domain/prediction'

export class PredictionService implements IPredictionService {
  constructor(private db: VaultDatabase) {}

  async predict(payeeId: string, _amount: bigint): Promise<PredictionResult> {
    const thirtyDaysAgoDate = new Date()
    thirtyDaysAgoDate.setDate(thirtyDaysAgoDate.getDate() - 30)
    const thirtyDaysAgo = thirtyDaysAgoDate.toISOString()

    // 1. Tentar buscar no histórico recente (30 dias) para este payee
    const recenttransactions = await this.db.transactions
      .where('payee_id')
      .equals(payeeId)
      .filter((t: LocalITransaction) => t.date >= thirtyDaysAgo && !t.deleted)
      .toArray()

    if (recenttransactions.length > 0) {
      return this.calculateBestMatch(recenttransactions)
    }

    // 2. Se não houver recente, buscar histórico total para este payee
    const alltransactions = await this.db.transactions
      .where('payee_id')
      .equals(payeeId)
      .filter((t) => !t.deleted)
      .toArray()

    if (alltransactions.length > 0) {
      return this.calculateBestMatch(alltransactions)
    }

    // 3. Fallback: Se for novo payee, buscar a categoria mais usada globalmente
    const globaltransactions = await this.db.transactions
      .filter((t) => !t.deleted)
      .limit(100) // Limitar para performance
      .toArray()

    if (globaltransactions.length > 0) {
      const match = this.calculateBestMatch(globaltransactions)
      return { ...match, confidence: 0 } // Confiança zero pois não é específico do payee
    }

    // 4. Último caso: IDs genéricos (assumindo que existam ou serão preenchidos pela UI)
    return {
      categoryId: 'geral',
      IWalletId: 'default',
      confidence: 0,
    }
  }

  private calculateBestMatch(transactions: LocalITransaction[]): PredictionResult {
    const categoryCounts = new Map<string, number>()
    const IWalletCounts = new Map<string, number>()

    let bestCategoryId: string | null = null
    let bestCategoryCount = 0
    let bestIWalletId: string | null = null
    let bestIWalletCount = 0

    for (const t of transactions) {
      // ICategory tracking with single-pass max detection
      const catCount = (categoryCounts.get(t.category_id) || 0) + 1
      categoryCounts.set(t.category_id, catCount)
      if (catCount > bestCategoryCount) {
        bestCategoryCount = catCount
        bestCategoryId = t.category_id
      }

      // IWallet tracking with single-pass max detection
      const IWalletCount = (IWalletCounts.get(t.wallet_id) || 0) + 1
      IWalletCounts.set(t.wallet_id, IWalletCount)
      if (IWalletCount > bestIWalletCount) {
        bestIWalletCount = IWalletCount
        bestIWalletId = t.wallet_id
      }
    }

    if (!bestCategoryId || !bestIWalletId) {
      return {
        categoryId: 'geral',
        IWalletId: 'default',
        confidence: 0,
      }
    }

    return {
      categoryId: bestCategoryId,
      IWalletId: bestIWalletId,
      confidence: bestCategoryCount / transactions.length,
    }
  }
}
