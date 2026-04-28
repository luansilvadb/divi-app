import type { ISubscription } from '../entities/ISubscription'

export interface ISubscriptionRepository {
  getAll(): Promise<ISubscription[]>
  save(subscription: ISubscription): Promise<void>
  delete(id: string): Promise<void>
}
