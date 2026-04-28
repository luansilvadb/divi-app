import type { IWalletRepository } from '@/modules/wallets/core/ports/IWalletRepository'
import type { IWallet } from '@/modules/wallets/core/entities/IWallet'
import { db, type LocalIWallet } from '@/infrastructure/storage/VaultDatabase'
import { SyncEngine } from '@/core/sync/SyncEngine'

export class DexieIWalletRepository implements IWalletRepository {
  async getAll(): Promise<IWallet[]> {
    const list = await db.wallets.toArray()
    return list.map((item) => ({
      ...item,
      sync_status: item.sync_status,
      client_updated_at: item.client_updated_at,
      version: item.version || 1,
    })) as IWallet[]
  }

  async create(IWallet: Omit<IWallet, 'id' | 'created_at' | 'sync_status' | 'version' | 'deleted'>): Promise<IWallet> {
    const id = `IWallet_${Date.now()}`
    const created_at = new Date().toISOString()
    const version = 1
    const deleted = false
    const sync_status = 'pending'

    await db.transaction('rw', db.wallets, async () => {
      await db.wallets.put({
        ...IWallet,
        id,
        balance: BigInt(IWallet.balance),
        type: IWallet.type || 'checking',
        sync_status,
        client_updated_at: created_at,
        created_at,
        version,
        deleted,
      } as LocalIWallet)
    })

    SyncEngine.getInstance().enqueueSync()
    const result = await db.wallets.get(id)
    return result as IWallet
  }

  async update(id: string, IWallet: Partial<IWallet>): Promise<IWallet> {
    await db.transaction('rw', db.wallets, async () => {
      await db.wallets.update(id, {
        ...IWallet,
        balance: IWallet.balance !== undefined ? BigInt(IWallet.balance) : undefined,
        sync_status: 'pending',
        client_updated_at: new Date().toISOString(),
      })
    })

    SyncEngine.getInstance().enqueueSync()
    const result = await db.wallets.get(id)
    return result as IWallet
  }

  async getById(id: string): Promise<IWallet | null> {
    const w = await db.wallets.get(id)
    return w ? (w as IWallet) : null
  }
}
