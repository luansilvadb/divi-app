import type { IGoal } from '../entities/IGoal'

export interface IGoalRepository {
  getAll(): Promise<IGoal[]>
  save(goal: IGoal): Promise<void>
  delete(id: string): Promise<void>
}
