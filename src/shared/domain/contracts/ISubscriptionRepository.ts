import type { Subscription } from '../entities/Subscription'

export interface ISubscriptionRepository {
  getAll(): Promise<Subscription[]>
  save(subscription: Subscription): Promise<void>
  delete(id: string): Promise<void>
}

