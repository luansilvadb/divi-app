import type { ILoanRepository } from '../../domain/repositories'
import type { Loan } from '../../domain/entities'
import { db } from '../../../../core/db'
import { supabase } from '../../../../core/supabase'

export class DexieLoanRepository implements ILoanRepository {
  async getAll(): Promise<Loan[]> {
    const list = await db.loans.toArray()
    return list.map(this.mapToEntity)
  }

  async save(loan: Loan): Promise<void> {
    const data = {
      ...loan,
      synced: false
    }
    await db.loans.put(data as any)
    
    // Attempt background sync
    this.sync().catch(console.error)
  }

  async delete(id: string): Promise<void> {
    await db.loans.delete(id)
    const { error } = await supabase.from('loans').delete().eq('id', id)
    if (error) console.error('Error syncing loan deletion:', error)
  }

  async sync(): Promise<void> {
    const unsynced = await db.loans.where('synced').equals(0).toArray()
    
    for (const item of unsynced) {
      const { error } = await supabase
        .from('loans')
        .upsert({
          id: item.id,
          user_id: item.user_id,
          name: item.name,
          total_value: item.total_value,
          remaining_value: item.remaining_value,
          interest_rate: item.interest_rate,
          due_date: item.due_date,
          created_at: item.created_at
        })

      if (!error) {
        await db.loans.update(item.id, { synced: true })
      }
    }
  }

  private mapToEntity(item: any): Loan {
    return {
      id: item.id,
      user_id: item.user_id,
      name: item.name,
      total_value: item.total_value,
      remaining_value: item.remaining_value,
      interest_rate: item.interest_rate,
      due_date: item.due_date,
      created_at: item.created_at
    }
  }
}
