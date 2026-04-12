import type { ILoanRepository } from '@/shared/domain/contracts/ILoanRepository'
import type { Loan } from '@/shared/domain/entities/Loan'
import { db, type LocalLoan } from '@/core/db'
import { SyncEngine } from '@/core/sync/SyncEngine'
import { InfrastructureError } from '../../domain/errors'

export class DexieLoanRepository implements ILoanRepository {
  async getAll(): Promise<Loan[]> {
    try {
      const list = await db.loans.filter((l) => !l.deleted).toArray()
      return list.map(this.mapToEntity)
    } catch (err) {
      throw new InfrastructureError('Failed to fetch loans from local DB', err)
    }
  }

  async save(loan: Loan): Promise<void> {
    try {
      const data: LocalLoan = {
        ...loan,
        sync_status: loan.sync_status || 'pending',
        deleted: !!loan.deleted,
        client_updated_at: loan.client_updated_at || new Date().toISOString(),
        created_at: loan.created_at || new Date().toISOString(),
        version: loan.version || 1,
      }
      await db.loans.put(data)
      SyncEngine.getInstance().enqueueSync()
      console.debug('[DexieLoanRepository] Empréstimo salvo localmente. Sync disparado.')
    } catch (err) {
      throw new InfrastructureError(
        'Failed to save loan to local DB',
        err instanceof Error ? err : new Error(String(err)),
      )
    }
  }

  async delete(id: string): Promise<void> {
    try {
      // Soft delete for sync engine
      await db.loans.update(id, {
        deleted: true,
        sync_status: 'pending',
        client_updated_at: new Date().toISOString(),
      })
      SyncEngine.getInstance().enqueueSync()
      console.debug('[DexieLoanRepository] Empréstimo marcado para deleção. Sync disparado.')
    } catch (err) {
      throw new InfrastructureError(
        'Failed to delete loan',
        err instanceof Error ? err : new Error(String(err)),
      )
    }
  }

  private mapToEntity(item: LocalLoan): Loan {
    return {
      id: item.id,
      user_id: item.user_id,
      name: item.name,
      total_value: item.total_value,
      remaining_value: item.remaining_value,
      interest_rate: item.interest_rate || 0,
      due_date: item.due_date,
      sync_status: item.sync_status,
      client_updated_at: item.client_updated_at,
      version: item.version,
      deleted: !!item.deleted,
      created_at: item.created_at || new Date().toISOString(),
      status: 'active', // Default status if not present in LocalLoan
    }
  }
}
