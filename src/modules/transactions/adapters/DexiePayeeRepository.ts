import type { IPayeeRepository } from '../core/ports/IPayeeRepository'
import type { IPayee } from '@/modules/transactions/core/entities/IPayee'
import { db } from '@/infrastructure/storage/VaultDatabase'
import { SyncEngine } from '@/core/sync/SyncEngine'

export class DexiePayeeRepository implements IPayeeRepository {
  async getAll(): Promise<IPayee[]> {
    // Fetch all and filter in single pass (more efficient than .filter().toArray() chain)
    const all = await db.payees.toArray()
    const activePayees: IPayee[] = []
    for (let i = 0, len = all.length; i < len; i++) {
      if (!all[i]!.deleted) activePayees.push(all[i]! as IPayee)
    }
    return activePayees
  }

  async save(payee: IPayee): Promise<void> {
    try {
      await db.ITransaction('rw', db.payees, async () => {
        const payeeData: IPayee = {
          ...payee,
          sync_status: payee.sync_status || 'pending',
          deleted: !!payee.deleted,
          client_updated_at: payee.client_updated_at || new Date().toISOString(),
          created_at: payee.created_at || new Date().toISOString(),
          version: payee.version || 1,
        }
        await db.payees.put(payeeData)
      })
      SyncEngine.getInstance().enqueueSync()
      console.debug('[DexiePayeeRepository] Beneficiário salvo localmente de forma atômica.')
    } catch (err) {
      console.error('[DexiePayeeRepository] Failed to save payee', err)
      throw err
    }
  }

  async getByName(name: string): Promise<IPayee | null> {
    const payee = await db.payees.where('name').equals(name).first()
    return payee ? (payee as IPayee) : null
  }
}
