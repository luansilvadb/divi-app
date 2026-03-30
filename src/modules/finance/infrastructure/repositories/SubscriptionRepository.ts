import type { ISubscriptionRepository } from '../../domain/repositories'
import type { Subscription } from '../../domain/entities'
import { db } from '../../../../core/db'
import { supabase } from '../../../../core/supabase'

export class DexieSubscriptionRepository implements ISubscriptionRepository {
  async getAll(): Promise<Subscription[]> {
    const list = await db.subscriptions.toArray()
    return list.map(this.mapToEntity)
  }

  async save(subscription: Subscription): Promise<void> {
    const data = {
      ...subscription,
      synced: false,
    }
    await db.subscriptions.put(data as any)

    // Attempt background sync
    this.sync().catch(console.error)
  }

  async delete(id: string): Promise<void> {
    await db.subscriptions.delete(id)
    const { error } = await supabase.from('subscriptions').delete().eq('id', id)
    if (error) console.error('Error syncing subscription deletion:', error)
  }

  async sync(): Promise<void> {
    const unsynced = await db.subscriptions.where('synced').equals(0).toArray()

    for (const item of unsynced) {
      const { error } = await supabase.from('subscriptions').upsert({
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
      })

      if (!error) {
        await db.subscriptions.update(item.id, { synced: true })
      }
    }
  }

  private mapToEntity(item: any): Subscription {
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
