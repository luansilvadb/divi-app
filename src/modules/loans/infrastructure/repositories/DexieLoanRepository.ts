import type { ILoanRepository } from '@/shared/domain/contracts/ILoanRepository'
import type { Loan } from '@/shared/domain/entities/Loan'
import { db, type LocalLoan } from '@/core/db'
import { supabase } from '@/core/supabase'
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

      // Attempt background sync
      this.sync().catch((err) => console.error('[LoanSync] Background sync error', err))
    } catch (err) {
      throw new InfrastructureError('Failed to save loan to local DB', err)
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await db.loans.delete(id)
      const { error } = await supabase.from('loans').delete().eq('id', id)
      if (error) {
        throw new InfrastructureError('Error syncing loan deletion with Supabase', error)
      }
    } catch (err) {
      if (err instanceof InfrastructureError) throw err
      throw new InfrastructureError('Failed to delete loan', err)
    }
  }

  async sync(): Promise<void> {
    try {
      const unsynced = await db.loans.where('syncStatus').equals('pending').toArray()
      if (unsynced.length === 0) return

      const upsertPayload = unsynced.map((item) => ({
        id: item.id,
        user_id: item.user_id,
        name: item.name,
        total_value: item.total_value,
        remaining_value: item.remaining_value,
        interest_rate: item.interest_rate,
        due_date: item.due_date,
        created_at: item.created_at,
      }))

      const { data, error } = await supabase.from('loans').upsert(upsertPayload).select('id')

      if (error) {
        throw new InfrastructureError('[Sync] Bulk upsert failed', error)
      }

      if (data) {
        const idsToUpdate = data.map((d: Record<string, unknown>) => d.id as string)
        await db.transaction('rw', db.loans, async () => {
          const records = await db.loans.bulkGet(idsToUpdate)
          const validRecords = records.reduce((acc, record) => {
            if (record) {
              acc.push({ ...record, syncStatus: 'synced' })
            }
            return acc
          }, [] as LocalLoan[])

          if (validRecords.length > 0) {
            await db.loans.bulkPut(validRecords)
          }
        })
      }
    } catch (err) {
      if (err instanceof InfrastructureError) throw err
      throw new InfrastructureError('Sync process failed', err)
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
