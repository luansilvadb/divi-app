import type { Goal } from '../entities/Goal'

export interface IGoalRepository {
  getAll(): Promise<Goal[]>
  save(goal: Goal): Promise<void>
  delete(id: string): Promise<void>
}
