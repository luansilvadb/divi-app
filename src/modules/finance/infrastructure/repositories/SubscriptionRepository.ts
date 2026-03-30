import type { ISubscriptionRepository } from '../../domain/repositories'
import type { Subscription } from '../../domain/entities'
import { db, type LocalSubscription } from '../../../../core/db'
import { supabase } from '../../../../core/supabase'
import { InfrastructureError } from '../../domain/errors'

export class DexieSubscriptionRepository implements ISubscriptionRepository {
  async getAll(): Promise<Subscription[]> {
    try {
      const list = await db.subscriptions.toArray()
      return list.map(this.mapToEntity)
    } catch (err) {
      throw new InfrastructureError('Failed to fetch subscriptions from local DB', err)
    }
  }

  async save(subscription: Subscription): Promise<void> {
    try {
      const data: LocalSubscription = {
        ...subscription,
        synced: false,
      }
      await db.subscriptions.put(data)

      // Attempt background sync
      this.sync().catch((err) => console.error('[SubscriptionSync] Background sync error', err))
    } catch (err) {
      throw new InfrastructureError('Failed to save subscription to local DB', err)
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await db.subscriptions.delete(id)
      const { error } = await supabase.from('subscriptions').delete().eq('id', id)
      if (error) {
        throw new InfrastructureError('Error syncing subscription deletion with Supabase', error)
      }
    } catch (err) {
       if (err instanceof InfrastructureError) throw err
       throw new InfrastructureError('Failed to delete subscription', err)
    }
  }

  async sync(): Promise<void> {
    try {
      const unsynced = await db.subscriptions.where('synced').equals(0).toArray()
      if (unsynced.length === 0) return

      const upsertPayload = unsynced.map((item) => ({
        id: item.id,
        user_id: item.user_id,
        name: item.name,
        amount: item.amount,
        category_id: item.category_id,
        wallet_id: item.wallet_id,
        billing_day: item.billing_day,
        frequency: item.frequency,
        last_billed_at: item.last_billed_at,
        created_at: item.created_at,
      }))

      const { data, error } = await supabase.from('subscriptions').upsert(upsertPayload).select('id')

      if (error) {
        throw new InfrastructureError('[Sync] Bulk upsert failed', error)
      }

      if (data) {
        const idsToUpdate = data.map((d: Record<string, unknown>) => d.id as string)
        await db.transaction('rw', db.subscriptions, async () => {
          const records = await db.subscriptions.bulkGet(idsToUpdate)
          const validRecords = records.reduce((acc, record) => {
             if (record) {
                acc.push({ ...record, synced: true })
             }
             return acc
          }, [] as LocalSubscription[])

          if (validRecords.length > 0) {
              await db.subscriptions.bulkPut(validRecords)
          }
        })
      }
    } catch (err) {
      if (err instanceof InfrastructureError) throw err
      throw new InfrastructureError('Sync process failed', err)
    }
  }

  private mapToEntity(item: LocalSubscription): Subscription {
    return {
      id: item.id,
      user_id: item.user_id,
      name: item.name,
      amount: item.amount,
      category_id: item.category_id,
      wallet_id: item.wallet_id,
      billing_day: item.billing_day,
      frequency: item.frequency,
      last_billed_at: item.last_billed_at,
      created_at: item.created_at,
    }
  }
}
