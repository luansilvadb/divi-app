import type { IPayeeRepository } from '@/shared/domain/contracts/IPayeeRepository'
import type { Payee } from '@/shared/domain/entities/Payee'
import { db } from '@/core/db'
import { SyncEngine } from '@/core/sync/SyncEngine'

export class DexiePayeeRepository implements IPayeeRepository {
  async getAll(): Promise<Payee[]> {
    const list = await db.payees.filter((p) => !p.deleted).toArray()
    return list as Payee[]
  }

  async save(payee: Payee): Promise<void> {
    const data: Payee = {
      ...payee,
      sync_status: payee.sync_status || 'pending',
      deleted: !!payee.deleted,
      client_updated_at: payee.client_updated_at || new Date().toISOString(),
      created_at: payee.created_at || new Date().toISOString(),
      version: payee.version || 1,
    }
    await db.payees.put(data)
    SyncEngine.getInstance().enqueueSync()
    console.debug('[DexiePayeeRepository] Beneficiário salvo localmente. Sync disparado.')
  }

  async getByName(name: string): Promise<Payee | null> {
    const payee = await db.payees.where('name').equals(name).first()
    return payee ? (payee as Payee) : null
  }
}
