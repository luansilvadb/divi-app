import type { IActivity } from '../entities/IActivity'

export interface IActivityRepository {
  getAll(): Promise<IActivity[]>
  add(activity: IActivity): Promise<void>
}
