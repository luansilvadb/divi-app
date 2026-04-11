import type { ISubscriptionRepository } from '@/shared/domain/contracts/ISubscriptionRepository'
import type { Subscription } from '@/shared/domain/entities/Subscription'
import { db, type LocalSubscription } from '@/core/db'
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
        category_id: subscription.category_id || '',
        wallet_id: subscription.wallet_id || '',
        sync_status: 'pending',
        deleted: !!subscription.deleted,
        client_updated_at: new Date().toISOString(),
        version: subscription.version || 1,
      }
      await db.subscriptions.put(data)
    } catch (err) {
      throw new InfrastructureError('Failed to save subscription to local DB', err)
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await db.subscriptions.delete(id)
    } catch (err) {
      throw new InfrastructureError('Failed to delete subscription', err)
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
      sync_status: item.sync_status,
      deleted: !!item.deleted,
      client_updated_at: item.client_updated_at,
      version: item.version || 1,
    }
  }
}
