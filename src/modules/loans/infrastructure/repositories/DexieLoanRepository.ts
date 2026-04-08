import type { ILoanRepository } from '@/shared/domain/contracts/ILoanRepository'
import type { Loan } from '@/shared/domain/entities/Loan'
import { db, type LocalLoan } from '@/core/db'
import { InfrastructureError } from '../../domain/errors'

export class DexieLoanRepository implements ILoanRepository {
  async getAll(): Promise<Loan[]> {
    try {
      const list = await db.loans.toArray()
      return list.map(this.mapToEntity)
    } catch (err) {
      throw new InfrastructureError('Failed to fetch loans from local DB', err)
    }
  }

  async save(loan: Loan): Promise<void> {
    try {
      const data: LocalLoan = {
        ...loan,
        syncStatus: 'pending',
      }
      await db.loans.put(data)
    } catch (err) {
      throw new InfrastructureError('Failed to save loan to local DB', err)
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await db.loans.delete(id)
    } catch (err) {
      throw new InfrastructureError('Failed to delete loan', err)
    }
  }

  private mapToEntity(item: LocalLoan): Loan {
    return {
      id: item.id,
      user_id: item.user_id,
      name: item.name,
      total_value: item.total_value,
      remaining_value: item.remaining_value,
      interest_rate: item.interest_rate,
      due_date: item.due_date,
      created_at: item.created_at,
    }
  }
}
