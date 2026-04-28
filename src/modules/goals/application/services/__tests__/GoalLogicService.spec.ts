import { describe, it, expect } from 'vitest'
import { GoalLogicService } from '../GoalLogicService'
import type { IGoal } from '@/modules/goals/core/entities/IGoal'

describe('GoalLogicService', () => {
  const service = new GoalLogicService()

  const createMockGoal = (current: number, target: number): IGoal => ({
    id: 'g1',
    user_id: 'u1',
    name: 'Emergency Fund',
    target_value: BigInt(target),
    current_value: BigInt(current),
    type: 'saving',
    sync_status: 'synced',
    client_updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    version: 1,
    deleted: false,
  })

  describe('calculateProgressPercentage', () => {
    it('should calculate 50% progress', () => {
      const goal = createMockGoal(5000, 10000)
      expect(service.calculateProgressPercentage(goal)).toBe(50)
    })

    it('should calculate 0% progress', () => {
      const goal = createMockGoal(0, 10000)
      expect(service.calculateProgressPercentage(goal)).toBe(0)
    })

    it('should calculate 100% progress', () => {
      const goal = createMockGoal(10000, 10000)
      expect(service.calculateProgressPercentage(goal)).toBe(100)
    })

    it('should cap at 100% when exceeded', () => {
      const goal = createMockGoal(15000, 10000)
      expect(service.calculateProgressPercentage(goal)).toBe(100)
    })

    it('should return 0 for zero target', () => {
      const goal = createMockGoal(100, 0)
      expect(service.calculateProgressPercentage(goal)).toBe(0)
    })
  })

  describe('estimateCompletionDate', () => {
    it('should estimate completion date', () => {
      const goal = createMockGoal(5000, 10000)
      const result = service.estimateCompletionDate(goal, 1000)

      expect(result).toBeInstanceOf(Date)
      // Should be approximately 5 months from now
      const future = new Date()
      future.setMonth(future.getMonth() + 5)
      expect(result!.getMonth()).toBe(future.getMonth())
    })

    it('should return current date when goal already reached', () => {
      const goal = createMockGoal(10000, 10000)
      const result = service.estimateCompletionDate(goal, 1000)

      const today = new Date()
      expect(result!.getDate()).toBe(today.getDate())
    })

    it('should return null for zero or negative savings', () => {
      const goal = createMockGoal(0, 10000)
      expect(service.estimateCompletionDate(goal, 0)).toBeNull()
      expect(service.estimateCompletionDate(goal, -100)).toBeNull()
    })
  })
})
