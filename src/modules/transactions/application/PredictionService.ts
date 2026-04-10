import type { DiviDatabase } from '@/core/db'
import type { IPredictionService, PredictionResult } from '../domain/prediction'

export class PredictionService implements IPredictionService {
  constructor(private db: DiviDatabase) {}

  async predict(payeeId: string, _amount: number): Promise<PredictionResult> {
    const thirtyDaysAgoDate = new Date()
    thirtyDaysAgoDate.setDate(thirtyDaysAgoDate.getDate() - 30)
    const thirtyDaysAgo = thirtyDaysAgoDate.toISOString()

    // 1. Tentar buscar no histórico recente (30 dias) para este payee
    const recentTransactions = await this.db.transactions
      .where('payee_id')
      .equals(payeeId)
      .filter(t => t.date >= thirtyDaysAgo && t.deleted === 0)
      .toArray()

    if (recentTransactions.length > 0) {
      return this.calculateBestMatch(recentTransactions)
    }

    // 2. Se não houver recente, buscar histórico total para este payee
    const allTransactions = await this.db.transactions
      .where('payee_id')
      .equals(payeeId)
      .filter(t => t.deleted === 0)
      .toArray()

    if (allTransactions.length > 0) {
      return this.calculateBestMatch(allTransactions)
    }

    // 3. Fallback: Se for novo payee, buscar a categoria mais usada globalmente
    const globalTransactions = await this.db.transactions
      .filter(t => t.deleted === 0)
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
      confidence: 0
    }
  }

  private calculateBestMatch(transactions: any[]): PredictionResult {
    const categoryCounts: Record<string, number> = {}
    const walletCounts: Record<string, number> = {}

    transactions.forEach(t => {
      categoryCounts[t.category_id] = (categoryCounts[t.category_id] || 0) + 1
      walletCounts[t.wallet_id] = (walletCounts[t.wallet_id] || 0) + 1
    })

    const bestCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]
    const bestWallet = Object.entries(walletCounts).sort((a, b) => b[1] - a[1])[0]

    return {
      categoryId: bestCategory[0],
      walletId: bestWallet[0],
      confidence: bestCategory[1] / transactions.length
    }
  }
}
