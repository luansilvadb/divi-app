import type { IPayeeRepository } from '@/shared/domain/contracts/IPayeeRepository'
import type { Payee } from '@/shared/domain/entities/Payee'
import { db } from '@/infrastructure/storage/VaultDatabase'
import { SyncEngine } from '@/core/sync/SyncEngine'

export class DexiePayeeRepository implements IPayeeRepository {
  async getAll(): Promise<Payee[]> {
    // Fetch all and filter in single pass (more efficient than .filter().toArray() chain)
    const all = await db.payees.toArray()
    const activePayees: Payee[] = []
    for (let i = 0, len = all.length; i < len; i++) {
      if (!all[i]!.deleted) activePayees.push(all[i]! as Payee)
    }
    return activePayees
  }

  async save(payee: Payee): Promise<void> {
    try {
      await db.transaction('rw', db.payees, async () => {
        const payeeData: Payee = {
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

  async getByName(name: string): Promise<Payee | null> {
    const payee = await db.payees.where('name').equals(name).first()
    return payee ? (payee as Payee) : null
  }
}
