import { describe, it, expect, beforeEach } from 'vitest'
import { DiviDatabase } from '@/core/db'
import { PredictionService } from '../PredictionService'

function subDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() - days)
  return result
}

describe('PredictionService', () => {
  let db: DiviDatabase
  let service: PredictionService

  beforeEach(async () => {
    // Usar uma nova instância do banco para cada teste
    db = new DiviDatabase()
    await db.transactions.clear()
    await db.categories.clear()
    await db.wallets.clear()
    
    service = new PredictionService(db)
  })

  it('deve prever a categoria e carteira mais frequente para um payee conhecido', async () => {
    // Given
    const payeeId = 'payee-1'
    const catAlimentacao = 'cat-alimentacao'
    const catLazer = 'cat-lazer'
    const walletMain = 'wallet-main'

    // 3 transações com Alimentação
    for (let i = 0; i < 3; i++) {
      await db.transactions.add({
        id: `t${i}`,
        title: 'Starbucks',
        amount: 10,
        type: 'expense',
        category_id: catAlimentacao,
        wallet_id: walletMain,
        payee_id: payeeId,
        date: new Date().toISOString(),
        sync_status: 'synced',
        deleted: 0
      })
    }

    // 1 transação com Lazer
    await db.transactions.add({
      id: 't-lazer',
      title: 'Starbucks',
      amount: 15,
      type: 'expense',
      category_id: catLazer,
      wallet_id: walletMain,
      payee_id: payeeId,
      date: new Date().toISOString(),
      sync_status: 'synced',
      deleted: 0
    })

    // When
    const result = await service.predict(payeeId, 10)

    // Then
    expect(result.categoryId).toBe(catAlimentacao)
    expect(result.walletId).toBe(walletMain)
    expect(result.confidence).toBeGreaterThan(0.5)
  })

  it('deve priorizar transações dos últimos 30 dias', async () => {
    // Given
    const payeeId = 'payee-1'
    const catAntiga = 'cat-antiga'
    const catRecente = 'cat-recente'
    
    // 5 transações antigas (> 30 dias)
    for (let i = 0; i < 5; i++) {
      await db.transactions.add({
        id: `old-${i}`,
        title: 'Antigo',
        amount: 10,
        type: 'expense',
        category_id: catAntiga,
        wallet_id: 'w1',
        payee_id: payeeId,
        date: subDays(new Date(), 40).toISOString(),
        sync_status: 'synced',
        deleted: 0
      })
    }

    // 2 transações recentes (< 30 dias)
    for (let i = 0; i < 2; i++) {
      await db.transactions.add({
        id: `new-${i}`,
        title: 'Recente',
        amount: 10,
        type: 'expense',
        category_id: catRecente,
        wallet_id: 'w1',
        payee_id: payeeId,
        date: subDays(new Date(), 5).toISOString(),
        sync_status: 'synced',
        deleted: 0
      })
    }

    // When
    const result = await service.predict(payeeId, 10)

    // Then
    expect(result.categoryId).toBe(catRecente)
  })

  it('deve retornar fallback se o payee for novo', async () => {
    // Given
    const payeeId = 'new-payee'

    // When
    const result = await service.predict(payeeId, 10)

    // Then
    // Como não há nada, deve retornar algo padrão ou vazio (conforme spec: Geral ou última usada)
    // Vamos assumir 'geral' por enquanto se não houver histórico global
    expect(result.categoryId).toBeDefined()
    expect(result.confidence).toBe(0)
  })
})
